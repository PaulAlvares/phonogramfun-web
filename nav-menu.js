/* Phone menu for phonogramfun.com (added 2026-10-18).
   Each page hides its nav links on small screens. This adds a ☰ button that
   shows those same links in a drop-down panel whenever they are hidden.
   No dependencies; pages without JS keep the existing footer links. */
(function () {
  var bar = document.querySelector('header.nav') || document.querySelector('body > nav');
  if (!bar) return;
  var links = bar.querySelector('.nav-links, .nav-center');
  if (!links) return;

  var css = document.createElement('style');
  css.textContent =
    '.pfm-btn{display:none;flex:none;align-items:center;justify-content:center;width:44px;height:44px;margin-left:8px;padding:0;border:2px solid #2A2238;border-radius:12px;background:#fff;color:#2A2238;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.pfm-btn svg{width:22px;height:22px}.pfm-btn .x{display:none}.pfm-open .pfm-btn .x{display:block}.pfm-open .pfm-btn .b{display:none}' +
    '.pfm-show .pfm-btn{display:inline-flex}' +
    // Make room for the button on small phones: shrink the wordmark and header CTA a little.
    '@media (max-width:440px){.pfm-show .pfm-btn{width:40px;height:40px;margin-left:6px}' +
    '.pfm-show header.nav .brand .name,.pfm-show .nav-brand{font-size:clamp(15px,4.4vw,20px)!important;min-width:0}' +
    '.pfm-show header.nav .brand{min-width:0;gap:8px}.pfm-show header.nav .brand img{width:38px;height:38px}' +
    '.pfm-show header.nav .nav-cta,.pfm-show .btn-nav{font-size:14px!important;padding:8px 11px!important}' +
    '.pfm-show header.nav .nav-inner{gap:6px}}' +
    '.pfm-panel{display:none;position:fixed;left:0;right:0;z-index:1000;opacity:1;filter:none;background:#FFF8F0!important;border-bottom:2px solid #2A2238;box-shadow:0 12px 30px rgba(26,20,48,.18);padding:8px 16px 18px;max-height:calc(100vh - 80px);overflow:auto}' +
    '.pfm-open .pfm-panel{display:block}' +
    '.pfm-panel a{display:block!important;opacity:1!important;transform:none!important;background:none!important;font-family:Nunito,system-ui,sans-serif;font-weight:800;font-size:18px;line-height:1.3;color:#2A2238!important;text-decoration:none;padding:14px 4px;margin:0;border-bottom:1px solid rgba(42,34,56,.12)}' +
    '.pfm-panel a:last-child{border-bottom:0}.pfm-panel a[aria-current]{color:#5B5BE0}' +
    '@media (prefers-reduced-motion:no-preference){.pfm-open .pfm-panel{animation:pfm-in .16s ease-out}}@keyframes pfm-in{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}';
  document.head.appendChild(css);

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'pfm-btn';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'pfm-panel');
  btn.setAttribute('aria-label', 'Menu');
  btn.innerHTML = '<svg class="b" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>' +
    '<svg class="x" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

  // A div (not <nav>) so page-level `nav {}` / `nav a {}` styles can't reach the panel.
  var panel = document.createElement('div');
  panel.id = 'pfm-panel';
  panel.className = 'pfm-panel';
  panel.setAttribute('role', 'navigation');
  panel.setAttribute('aria-label', 'Menu');
  [].forEach.call(links.querySelectorAll('a'), function (a) {
    var c = a.cloneNode(true);
    c.removeAttribute('class');
    panel.appendChild(c);
  });

  // The ☰ goes at the far right, after "Get the app".
  var host = bar.querySelector('.nav-inner') || bar;
  host.appendChild(btn);
  document.body.appendChild(panel);

  var root = document.documentElement;
  function place() { panel.style.top = Math.round(bar.getBoundingClientRect().bottom) + 'px'; }
  function setOpen(open) {
    root.classList.toggle('pfm-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    if (open) place();
  }
  function sync() {
    var hidden = getComputedStyle(links).display === 'none';
    root.classList.toggle('pfm-show', hidden);
    if (!hidden) setOpen(false);
  }
  btn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!root.classList.contains('pfm-open')); });
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('click', function (e) { if (root.classList.contains('pfm-open') && !panel.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('pfm-open')) { setOpen(false); btn.focus(); } });
  window.addEventListener('resize', function () { sync(); if (root.classList.contains('pfm-open')) place(); });
  window.addEventListener('scroll', function () { if (root.classList.contains('pfm-open')) place(); }, { passive: true });
  sync();
})();
