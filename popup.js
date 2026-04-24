let scripts = [];

const formatPattern = (input) => {
  try {
    let clean = input.trim();
    if (clean.includes('*')) return clean;
    if (!clean.startsWith('http')) clean = 'https://' + clean;
    const url = new URL(clean);
    return `*://${url.hostname}/*`;
  } catch {
    return "*://*/*";
  }
};

const extractName = (code) => {
  const match = code.match(/@name\s+(.+)/i);
  return match ? match[1].trim() : null;
};

const save = () => chrome.storage.local.set({ scripts });

const render = () => {
  const container = document.getElementById('scripts');
  const header = document.getElementById('scripts-header');
  header.style.display = scripts.length ? 'block' : 'none';
  container.innerHTML = scripts.map((s) => `
    <div class="script-item">
      <div class="script-header">
        <div>
          <span class="script-url">${s.url}</span>
          ${s.name ? `<div class="script-name">${s.name}</div>` : ''}
        </div>
        <button class="del-btn" data-id="${s.id}">Remove</button>
      </div>
      <pre class="script-code">${s.code}</pre>
    </div>
  `).join('');

  container.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const resp = await chrome.runtime.sendMessage({ type: 'unregister', id });
      if (resp.ok) {
        scripts = scripts.filter(s => s.id !== id);
        save();
        render();
      }
    });
  });
};

const load = () => {
  chrome.storage.local.get(['scripts'], (result) => {
    scripts = Array.isArray(result.scripts) ? result.scripts : [];
    render();
  });
};

document.getElementById('save').addEventListener('click', async () => {
  const urlVal = document.getElementById('url').value;
  const codeVal = document.getElementById('code').value;

  if (!urlVal || !codeVal) return;

  const id = `script_${Date.now()}`;
  const pattern = formatPattern(urlVal);

  const response = await chrome.runtime.sendMessage({
    type: 'register',
    id,
    matches: [pattern],
    code: codeVal
  });

  if (response && response.ok) {
    const name = extractName(codeVal);
    scripts.push({ id, url: pattern, code: codeVal, name });
    save();
    render();
    document.getElementById('url').value = '';
    document.getElementById('code').value = '';
  } else {
    alert("Error: " + (response?.error || "Check Background Console"));
  }
});

load();
chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (tab?.url) {
    try {
      const u = new URL(tab.url);
      document.getElementById('url').value = u.hostname;
    } catch {}
  }
});