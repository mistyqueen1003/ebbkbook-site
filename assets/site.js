/* Render the embedded markdown, build the sidebar TOC, then draw mermaid diagrams. */
(function () {
  'use strict';

  var source = document.getElementById('md');
  var content = document.getElementById('content');
  var tocBox = document.getElementById('toc');
  if (!source || !content) return;

  /* ---------- 1. markdown ---------- */
  marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });
  content.innerHTML = marked.parse(source.textContent);

  /* ---------- 2. table of contents ---------- */
  var heads = Array.prototype.slice.call(content.querySelectorAll('h2'));
  var links = [];

  if (tocBox && heads.length) {
    var list = document.createElement('ul');

    heads.forEach(function (h, i) {
      if (!h.id) h.id = 'sec-' + (i + 1);

      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.trim();
      li.appendChild(a);
      list.appendChild(li);
      links.push(a);
    });

    tocBox.appendChild(list);
  }

  /* ---------- 3. mermaid ---------- */
  var codes = Array.prototype.slice.call(content.querySelectorAll('code.language-mermaid'));
  var nodes = codes.map(function (code) {
    var holder = document.createElement('div');
    holder.className = 'mermaid';
    holder.textContent = code.textContent;
    var pre = code.closest('pre');
    (pre || code).replaceWith(holder);
    return holder;
  });

  if (nodes.length && typeof mermaid !== 'undefined') {
    var dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    mermaid.initialize({
      startOnLoad: false,
      theme: dark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: '-apple-system, "Segoe UI", "Microsoft YaHei", sans-serif',
      flowchart: { htmlLabels: true, curve: 'basis', padding: 16 }
    });

    mermaid.run({ nodes: nodes }).catch(function (err) {
      console.error('mermaid render failed', err);
    });
  }

  /* ---------- 4. scroll spy ---------- */
  if (heads.length && links.length && 'IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('active'); });
        var active = byId[entry.target.id];
        if (active) active.classList.add('active');
      });
    }, { rootMargin: '-15% 0px -75% 0px', threshold: 0 });

    heads.forEach(function (h) { spy.observe(h); });
  }
})();
