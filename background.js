chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  const handle = (promise) => {
    promise.then(() => sendResponse({ ok: true })).catch(e => sendResponse({ ok: false, error: e.message }));
    return true;
  };

  if (msg.type === 'register') {
    handle(chrome.userScripts.register([{
      id: msg.id,
      matches: msg.matches,
      js: [{ code: msg.code }],
      runAt: 'document_idle',
      world: 'USER_SCRIPT'
    }]));
  } else if (msg.type === 'unregister') {
    handle(chrome.userScripts.unregister({ ids: [msg.id] }));
  }
});