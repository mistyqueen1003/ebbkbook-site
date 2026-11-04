/* Reader: render full book markdown, build a chapter TOC, track reading progress. */
(function () {
  'use strict';

  var src = document.getElementById('md');
  var content = document.getElementById('content');
  if (!src || !content) return;

  marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });
  content.innerHTML = marked.parse(src.textContent);

  /* lazy-load all images, they are local and numerous */
  Array.prototype.forEach.call(content.querySelectorAll('img'), function (img) {
    img.loading = 'lazy';
    img.decoding = 'async';
  });

  /* ---------- TOC from level-1 headings ---------- */
  var heads = Array.prototype.slice.call(content.querySelectorAll('h1'));
  var toc = document.getElementById('toc');

  if (toc && heads.length) {
    var list = document.createElement('ul');
    heads.forEach(function (h, i) {
      if (!h.id) h.id = 'h-' + i;
      var text = h.textContent.replace(/\s+/g, ' ').trim();
      if (!text) return;

      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = text.length > 42 ? text.slice(0, 42) + '…' : text;
      a.title = text;
      li.appendChild(a);
      list.appendChild(li);
    });
    toc.appendChild(list);
  }

  /* ---------- reading progress ---------- */
  var bar = document.getElementById('progress');
  var counter = document.getElementById('counter');
  function updateProgress() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    if (bar) bar.style.width = pct.toFixed(2) + '%';
    if (counter) counter.textContent = Math.round(pct) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* ---------- font size ---------- */
  var size = 18;
  function applySize() {
    document.documentElement.style.setProperty('--reader-size', size + 'px');
    try { localStorage.setItem('reader-size', String(size)); } catch (e) {}
  }
  try {
    var saved = parseInt(localStorage.getItem('reader-size'), 10);
    if (saved >= 14 && saved <= 28) size = saved;
  } catch (e) {}
  applySize();

  var plus = document.getElementById('font-plus');
  var minus = document.getElementById('font-minus');
  if (plus) plus.addEventListener('click', function () { size = Math.min(28, size + 1); applySize(); });
  if (minus) minus.addEventListener('click', function () { size = Math.max(14, size - 1); applySize(); });

  /* ---------- TOC toggle (mobile) ---------- */
  var toggle = document.getElementById('toc-toggle');
  if (toggle && toc) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('toc-open');
    });
    toc.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') document.body.classList.remove('toc-open');
    });
  }

  /* ---------- next / previous chapter ---------- */
  var idx = -1;
  function currentIndex() {
    var pos = window.scrollY + 120;
    for (var i = heads.length - 1; i >= 0; i--) {
      if (heads[i].offsetTop <= pos) return i;
    }
    return 0;
  }
  function go(delta) {
    idx = currentIndex();
    var next = Math.min(heads.length - 1, Math.max(0, idx + delta));
    heads[next].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight' || e.key === 'j') go(1);
    if (e.key === 'ArrowLeft' || e.key === 'k') go(-1);
  });
})();
