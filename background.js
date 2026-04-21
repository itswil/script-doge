chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!chrome.userScripts) {
    sendResponse({ ok: false, error: "API_UNAVAILABLE: Enable 'Allow user scripts' in Extension Details." });
    return false;
  }

  if (msg.type === 'register') {
    chrome.userScripts.register([{
      id: msg.id,
      matches: msg.matches,
      js: [{ code: msg.code }],
      runAt: 'document_idle',
      world: 'USER_SCRIPT'
    }])
    .then(() => sendResponse({ ok: true }))
    .catch(err => sendResponse({ ok: false, error: err.message }));
    return true; // Required for async response
  }

  if (msg.type === 'unregister') {
    chrome.userScripts.unregister({ ids: [msg.id] })
    .then(() => sendResponse({ ok: true }))
    .catch(err => sendResponse({ ok: false, error: err.message }));
    return true;
  }
});
