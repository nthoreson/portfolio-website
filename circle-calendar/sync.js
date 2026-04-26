const fs = require('fs');
const path = require('path');

const EVENTS_FILE = path.join(__dirname, 'events.json');
const API_BASE = 'https://app.circle.so/api/v1/events';

async function fetchPage(token, communityId, page) {
  const url = `${API_BASE}?community_id=${communityId}&page=${page}&per_page=100`;
  const res = await fetch(url, {
    headers: { Authorization: `Token ${token}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Circle API error ${res.status}: ${body}`);
  }
  return res.json();
}

async function syncEvents() {
  const token = process.env.CIRCLE_API_TOKEN;
  const communityId = process.env.CIRCLE_COMMUNITY_ID;

  if (!token || !communityId) {
    throw new Error('CIRCLE_API_TOKEN and CIRCLE_COMMUNITY_ID must be set');
  }

  const collected = [];
  let page = 1;

  while (true) {
    const data = await fetchPage(token, communityId, page);

    const items = Array.isArray(data) ? data : data.events ?? data.records ?? [];
    if (items.length === 0) break;

    for (const event of items) {
      collected.push({
        title: event.name ?? event.title ?? '',
        description: event.description ?? event.body ?? '',
        start_time: event.starts_at ?? event.start_time ?? event.starts_at_datetime ?? null,
        event_url: event.url ?? event.event_url ?? `https://app.circle.so/c/${communityId}/events/${event.slug ?? event.id}`,
      });
    }

    // Circle API uses a `has_more` or pagination metadata field; stop if fewer than full page returned
    const hasMore = data.has_more ?? data.meta?.has_more ?? (items.length === 100);
    if (!hasMore) break;
    page++;
  }

  fs.writeFileSync(EVENTS_FILE, JSON.stringify(collected, null, 2));
  return collected.length;
}

module.exports = { syncEvents };
