// =====================================================================
// Sytraex ortak modül: Supabase istemcisi, oturum, dil, üst/alt bilgi, yardımcılar
// =====================================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_KEY } from './config.js';
import { dict } from './i18n.js';

export const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

export const state = { user: null, profile: null };
export const $  = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const qs = new URLSearchParams(location.search);

// ---------- güvenli metin ----------
export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- dil ----------
const storedLang = (() => { try { return localStorage.getItem('sytraexLang'); } catch { return null; } })();
let lang = storedLang || ((navigator.language || 'tr').toLowerCase().startsWith('tr') ? 'tr' : 'en');
if (!dict[lang]) lang = 'tr';
document.documentElement.lang = lang;

export const getLang = () => lang;
export function t(key, vars = {}) {
  let s = dict[lang]?.[key] ?? dict.tr[key] ?? key;
  for (const k in vars) s = s.replaceAll(`{${k}}`, vars[k]);
  return s;
}
export function applyI18n(root = document) {
  $$('[data-i18n]', root).forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-html]', root).forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  $$('[data-i18n-ph]', root).forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $$('[data-i18n-title]', root).forEach(el => { el.title = t(el.dataset.i18nTitle); });
  document.documentElement.lang = lang;
  const titleKey = document.body.dataset.title;
  if (titleKey) document.title = `${t(titleKey)} | Sytraex`;
}
export function setLang(l) {
  if (!dict[l] || l === lang) return;
  lang = l;
  try { localStorage.setItem('sytraexLang', l); } catch {}
  renderHeader(document.body.dataset.active);
  renderFooter();
  applyI18n();
  window.dispatchEvent(new CustomEvent('langchange', { detail: l }));
}

// ---------- oturum ----------
export async function fetchProfile(uid) {
  const { data } = await sb.from('profiles').select('*').eq('id', uid).maybeSingle();
  return data;
}
export const nextTarget = () => {
  const n = qs.get('next');
  return n && /^[a-z0-9\-_.]+\.html(\?[^#]*)?$/i.test(n) ? n : 'profile.html';
};

export async function initPage({ requireLogin = false } = {}) {
  const { data: { session } } = await sb.auth.getSession();
  state.user = session?.user ?? null;
  if (requireLogin && !state.user) {
    const here = location.pathname.split('/').pop() + location.search;
    location.replace(`login.html?next=${encodeURIComponent(here)}`);
    return null;
  }
  if (state.user) state.profile = await fetchProfile(state.user.id);
  renderHeader(document.body.dataset.active);
  renderFooter();
  applyI18n();
  sb.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_OUT') location.href = 'index.html'; });
  return state;
}
export async function signOut() { await sb.auth.signOut(); location.href = 'index.html'; }

// ---------- üst / alt bilgi ----------
export function renderHeader(active = '') {
  const el = $('#site-header');
  if (!el) return;
  const on = (k) => (active === k ? 'active' : '');
  const authLinks = state.user
    ? `<a href="profile.html" class="${on('profile')}">${esc(t('nav_profile'))}</a>
       <a href="#" id="navLogout">${esc(t('nav_logout'))}</a>`
    : `<a href="login.html" class="${on('login')}">${esc(t('nav_login'))}</a>
       <a href="register.html" class="btn btn-primary btn-sm">${esc(t('nav_register'))}</a>`;
  el.innerHTML = `
  <header class="site-header"><div class="container nav">
    <a class="brand" href="index.html" aria-label="Sytraex"><img src="logo.png" alt=""><span><b>SYTRAEX</b><small>Share Your Travel Experience</small></span></a>
    <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false">☰</button>
    <nav class="nav-links" id="navLinks">
      <a href="index.html" class="${on('home')}">${esc(t('nav_home'))}</a>
      <a href="search-results.html" class="${on('explore')}">${esc(t('nav_explore'))}</a>
      <a href="whitepaper.html" class="${on('whitepaper')}">${esc(t('nav_whitepaper'))}</a>
      ${authLinks}
      <div class="lang-switch" role="group" aria-label="Language">
        <button data-lang="tr" class="${lang === 'tr' ? 'on' : ''}">TR</button>
        <button data-lang="en" class="${lang === 'en' ? 'on' : ''}">EN</button>
      </div>
    </nav>
  </div></header>`;
  $('#navToggle').onclick = (e) => { const o = $('#navLinks').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', o); };
  $$('.lang-switch button', el).forEach(b => b.onclick = () => setLang(b.dataset.lang));
  const lo = $('#navLogout'); if (lo) lo.onclick = (e) => { e.preventDefault(); signOut(); };
}
export function renderFooter() {
  const el = $('#site-footer');
  if (!el) return;
  el.innerHTML = `
  <footer class="site-footer"><div class="container foot">
    <div><a class="brand" href="index.html"><img src="logo.png" alt=""><span><b>SYTRAEX</b></span></a><p>${esc(t('footer_about'))}</p></div>
    <div><h4>${esc(t('footer_platform'))}</h4>
      <a href="search-results.html">${esc(t('nav_explore'))}</a>
      <a href="share-experience.html">${esc(t('hero_btn_share'))}</a>
      <a href="whitepaper.html">${esc(t('nav_whitepaper'))}</a></div>
    <div><h4>${esc(t('footer_legal'))}</h4>
      <a href="privacy.html">${esc(t('legal_privacy'))}</a>
      <a href="terms.html">${esc(t('legal_terms'))}</a>
      <a href="mailto:info@sytraex.com">info@sytraex.com</a></div>
  </div><div class="copyright">© ${new Date().getFullYear()} Sytraex · ${esc(t('footer_rights'))}</div></footer>`;
}

// ---------- bildirimler / iletişim kutusu ----------
export function toast(msg, type = '') {
  let box = $('#toasts');
  if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
  const d = document.createElement('div');
  d.className = `toast ${type}`; d.setAttribute('role', 'status'); d.textContent = msg;
  box.appendChild(d);
  setTimeout(() => d.remove(), 4500);
}
export function modal({ title, body = '', confirmText, cancelText, input = null, danger = false }) {
  return new Promise(resolve => {
    const bg = document.createElement('div');
    bg.className = 'modal-bg';
    bg.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><h3>${esc(title)}</h3>
      ${body ? `<p>${esc(body)}</p>` : ''}
      ${input ? `<div class="field mt"><textarea id="mInput" maxlength="${input.max || 300}" placeholder="${esc(input.placeholder || '')}"></textarea></div>` : ''}
      <div class="acts"><button class="btn btn-soft" id="mNo">${esc(cancelText || t('cancel'))}</button>
      <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="mYes">${esc(confirmText || t('ok'))}</button></div></div>`;
    document.body.appendChild(bg);
    const done = (v) => { bg.remove(); resolve(v); };
    $('#mNo', bg).onclick = () => done(null);
    $('#mYes', bg).onclick = () => done(input ? ($('#mInput', bg).value.trim() || '') : true);
    bg.onclick = (e) => { if (e.target === bg) done(null); };
    (input ? $('#mInput', bg) : $('#mYes', bg)).focus();
  });
}
export function setBusy(btn, busy, label) {
  if (!btn) return;
  if (busy) { btn.dataset.label = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<span class="spinner"></span> ${esc(label || '')}`; }
  else { btn.disabled = false; if (btn.dataset.label) btn.innerHTML = btn.dataset.label; }
}
export function showAlert(el, msg, type = 'err') {
  if (!el) return;
  el.className = `alert alert-${type}`; el.textContent = msg; el.classList.remove('hidden');
}
export const hideAlert = (el) => el && el.classList.add('hidden');

// ---------- sabitler ----------
export const DURATIONS = ['3h', 'day', '1d', 'weekend', '1w'];
export const MODES = ['night', 'day', 'history', 'nature', 'food', 'adventure', 'budget'];
export const MODE_ICON = { night: '🌙', day: '☀️', history: '🏛️', nature: '🌿', food: '🍕', adventure: '🏄', budget: '💰' };
export const durLabel = (k) => t('dur_' + k);
export const modeLabel = (k) => `${MODE_ICON[k] || ''} ${t('mode_' + k)}`.trim();

export function fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch { return ''; }
}
export function fmtTime(iso) {
  try { return new Date(iso).toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-GB', { hour: '2-digit', minute: '2-digit' }); }
  catch { return ''; }
}
export function avatarSrc(url, name = '?') {
  if (url && /^https:\/\//.test(url)) return url;
  const ch = esc((name || '?').trim().charAt(0).toUpperCase() || '?');
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#1e2a52"/><text x="32" y="42" font-size="30" font-family="Arial" font-weight="700" text-anchor="middle" fill="#f7c948">${ch}</text></svg>`);
}
export const safeImg = (u) => (u && /^https:\/\//.test(u) ? u : 'logo.png');

export function postCardHTML(p) {
  const cover = safeImg(p.images?.[0]);
  const name = p.author_name || p.username;
  const rating = p.votes > 0 ? `<span class="stars">★ ${Number(p.avg_score).toFixed(1)} <span class="muted">(${p.votes})</span></span>` : `<span class="faint">${esc(t('no_votes'))}</span>`;
  return `<a class="post-card" href="post-detail.html?id=${esc(p.id)}">
    <div class="post-thumb"><img loading="lazy" src="${esc(cover)}" alt="${esc(p.title)}"><span class="badge">${esc(modeLabel(p.mode))}</span></div>
    <div class="post-body"><h3>${esc(p.title)}</h3>
      <div class="post-loc">📍 ${esc(p.location)} · ${esc(durLabel(p.duration))}</div>
      <div class="post-meta"><span class="author"><img class="avatar" src="${esc(avatarSrc(p.author_avatar, name))}" alt=""><span>${esc(name)}</span></span>${rating}</div>
    </div></a>`;
}
export const skeletons = (n = 3) => Array.from({ length: n }, () => '<div class="skeleton"></div>').join('');

export function youtubeEmbed(url) {
  if (!url) return null;
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
}

// ---------- görsel işleme & yükleme ----------
export function compressImage(file, maxDim = 1600, quality = 0.82, square = false) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (square) { const s = Math.min(sw, sh); sx = (sw - s) / 2; sy = (sh - s) / 2; sw = sh = s; }
      const scale = Math.min(1, maxDim / Math.max(sw, sh));
      const c = document.createElement('canvas');
      c.width = Math.round(sw * scale); c.height = Math.round(sh * scale);
      c.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height);
      c.toBlob(b => b ? resolve(b) : reject(new Error('compress failed')), 'image/webp', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('invalid image')); };
    img.src = url;
  });
}
export async function uploadImage(bucket, blob) {
  const uid = state.user.id;
  const path = `${uid}/${crypto.randomUUID()}.webp`;
  const { error } = await sb.storage.from(bucket).upload(path, blob, { contentType: 'image/webp', cacheControl: '31536000' });
  if (error) throw error;
  return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
export async function removeImages(bucket, urls) {
  const marker = `/object/public/${bucket}/`;
  const paths = (urls || []).map(u => { const i = u.indexOf(marker); return i > -1 ? decodeURIComponent(u.slice(i + marker.length)) : null; })
    .filter(p => p && p.startsWith(state.user.id + '/'));
  if (paths.length) await sb.storage.from(bucket).remove(paths);
}

// ---------- şehir / konum otomatik tamamlama (OpenStreetMap Nominatim, ücretsiz) ----------
export function attachCityAutocomplete(input, { onSelect, fillMode = 'full' } = {}) {
  if (!input || input.dataset.acBound) return;
  input.dataset.acBound = '1';
  input.setAttribute('autocomplete', 'off');
  const wrap = input.parentElement;
  if (wrap && getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
  const list = document.createElement('ul');
  list.className = 'ac-list hidden';
  list.setAttribute('role', 'listbox');
  (wrap || input.parentNode).appendChild(list);

  let items = [], active = -1, timer = null, ctrl = null, myId = 0;

  function close() { list.classList.add('hidden'); list.innerHTML = ''; items = []; active = -1; }
  function render() {
    list.innerHTML = items.map((it, i) => `<li role="option" data-i="${i}" class="${i === active ? 'on' : ''}">${esc(it.label)}</li>`).join('');
    list.classList.toggle('hidden', !items.length);
  }
  function pick(i) {
    const it = items[i]; if (!it) return;
    input.value = fillMode === 'short' ? (it.short || it.label) : it.label;
    close();
    input.dispatchEvent(new Event('change', { bubbles: true }));
    if (onSelect) onSelect(it);
  }
  function formatItem(r) {
    const a = r.address || {};
    const city = a.city || a.town || a.village || a.municipality || a.county || r.name || '';
    const region = a.state || a.province || '';
    const country = a.country || '';
    const label = [city, region && region !== city ? region : '', country].filter(Boolean).join(', ');
    return { label: label || r.display_name, short: city || r.display_name.split(',')[0].trim(), lat: r.lat, lon: r.lon };
  }
  async function search(q) {
    const id = ++myId;
    if (ctrl) ctrl.abort();
    ctrl = new AbortController();
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&featureType=settlement&accept-language=${getLang()}&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
      if (!res.ok || id !== myId) return;
      const data = await res.json();
      if (id !== myId) return;
      const seen = new Set();
      items = data.map(formatItem).filter(it => { const k = it.label.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
      active = -1;
      render();
    } catch { /* iptal edildi ya da ağ hatası - sessiz geç */ }
  }
  input.addEventListener('input', () => {
    const q = input.value.trim();
    clearTimeout(timer);
    if (q.length < 2) { close(); return; }
    timer = setTimeout(() => search(q), 380);
  });
  input.addEventListener('keydown', (e) => {
    if (list.classList.contains('hidden') || !items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % items.length; render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + items.length) % items.length; render(); }
    else if (e.key === 'Enter') { if (active > -1) { e.preventDefault(); pick(active); } }
    else if (e.key === 'Escape') { close(); }
  });
  list.addEventListener('mousedown', (e) => {
    const li = e.target.closest('li'); if (!li) return;
    e.preventDefault(); pick(+li.dataset.i);
  });
  document.addEventListener('click', (e) => { if (e.target !== input && !list.contains(e.target)) close(); });
  input.addEventListener('blur', () => setTimeout(close, 150));
}

export function friendlyError(err) {
  const m = (err?.message || String(err || '')).toLowerCase();
  if (m.includes('invalid login')) return t('err_invalid_login');
  if (m.includes('email not confirmed')) return t('err_email_unconfirmed');
  if (m.includes('already registered') || m.includes('already been registered')) return t('err_email_taken');
  if (m.includes('rate limit') || m.includes('too many')) return t('err_rate_limit');
  if (m.includes('password') && m.includes('characters')) return t('err_pw_short');
  if (m.includes('duplicate') || m.includes('unique')) return t('err_duplicate');
  if (m.includes('failed to fetch') || m.includes('network')) return t('err_network');
  return err?.message || t('err_generic');
}
