// ── Shared utilities ──────────────────────────────────────────
const API = 'http://localhost:3000/api';

// Shared nav active-link highlighter
document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach(l => {
    if (l.getAttribute('href') === path) l.classList.add('active');
  });
});

// Generic API helper
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// Show inline alert
function showAlert(containerId, message, type = 'info') {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `
    <div class="alert alert-${type}">
      ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'} ${message}
      <button class="alert-close" onclick="this.parentElement.remove()">×</button>
    </div>`;
  if (type === 'success') setTimeout(() => el.innerHTML = '', 3500);
}

// Populate select from API
async function populateSelect(selectId, endpoint, valueField, labelField) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  try {
    const data = await apiFetch(`${API}/${endpoint}`);
    const items = data.data || [];
    sel.innerHTML = `<option value="">— Select —</option>` +
      items.map(i => `<option value="${i[valueField]}">${i[labelField]}</option>`).join('');
  } catch (e) {
    sel.innerHTML = `<option value="">Error loading</option>`;
  }
}

// Open / close modals
function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

// Format currency
function fmtMoney(n) {
  return '৳ ' + Number(n).toFixed(2);
}

// Status badge HTML
function statusBadge(s) {
  const map = { scheduled:'info', cancelled:'danger', completed:'success', pending:'warning', paid:'success', unpaid:'warning' };
  const cls = map[s?.toLowerCase()] || 'muted';
  return `<span class="badge badge-${cls}">${s || '—'}</span>`;
}

// Confirm before delete
async function confirmDelete(msg) {
  return confirm(msg || 'Are you sure you want to delete this record?');
}
