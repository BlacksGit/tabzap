const api = typeof browser !== "undefined" ? browser : chrome;

function key(u) {
  try { const x = new URL(u); x.hash = ""; return x.href; } catch (e) { return u; }
}

api.action.onClicked.addListener(async tab => {
  const tabs = await api.tabs.query({ windowId: tab.windowId });
  const seen = new Set();
  const dupes = [];
  for (const t of tabs) {
    if (t.pinned || !t.url || t.url.startsWith("about:") || t.url.startsWith("chrome:")) continue;
    const k = key(t.url);
    if (seen.has(k)) dupes.push(t.id); else seen.add(k);
  }
  if (dupes.length) await api.tabs.remove(dupes);
  api.action.setBadgeText({ text: String(dupes.length) });
  setTimeout(() => api.action.setBadgeText({ text: "" }), 2500);
});
