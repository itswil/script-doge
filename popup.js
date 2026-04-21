let scripts = [];

const formatPattern = (input) => {
  if (input.includes('*')) return input;
  try {
    const url = new URL(input.startsWith('http') ? input : `https://${input}`);
    return `*://${url.hostname}/*`;
  } catch {
    return '*://*/*';
  }
};

const save = () => chrome.storage.local.set({ scripts });

const render = () => {
  const header = document.getElementById('scripts-header');
  const container = document.getElementById('scripts');
  header.style.display = scripts.length ? 'block' : 'none';
  container.innerHTML = scripts.map((s) => `
    <div class="script-item">
      <div class="script-header">
        <span class="script-url">${s.url}</span>
        <button class="del-btn" data-id="${s.id}">Remove</button>
      </div>
      <pre class="script-code">${s.code}</pre>
    </div>
  `).join('');
  container.onclick = (e) => {
    const btn = e.target.closest('.del-btn');
    if (!btn) return;
    const id = btn.dataset.id;
    chrome.runtime.sendMessage({ type: 'unregister', id });
    scripts = scripts.filter(s => s.id !== id);
    save();
    render();
  };
};

document.getElementById('save').onclick = async () => {
  const urlVal = document.getElementById('url').value.trim();
  const codeVal = document.getElementById('code').value;
  if (!urlVal || !codeVal) return;

  const id = `script_${Date.now()}`;
  const resp = await chrome.runtime.sendMessage({
    type: 'register',
    id,
    matches: [formatPattern(urlVal)],
    code: codeVal
  });

  if (resp?.ok) {
    scripts.push({ id, url: formatPattern(urlVal), code: codeVal });
    save();
    render();
    document.getElementById('url').value = '';
    document.getElementById('code').value = '';
  }
};

chrome.storage.local.get(['scripts'], (r) => {
  scripts = r.scripts || [];
  render();
});

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  try { document.getElementById('url').value = new URL(tab.url).hostname; } catch {}
});