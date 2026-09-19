/* C_TS452 exam runbook — shared engine
   Renders a TASK data object into an interactive checklist page.
   Works from file:// . Degrades gracefully when localStorage is unavailable. */

(function () {
  'use strict';

  /* ---------------- storage (safe) ---------------- */
  var MEM = {}, OK = true;
  try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); }
  catch (e) { OK = false; }
  var S = {
    get: function (k, d) {
      try { var v = OK ? localStorage.getItem(k) : MEM[k]; return v === null || v === undefined ? d : v; }
      catch (e) { return d; }
    },
    set: function (k, v) { try { if (OK) localStorage.setItem(k, v); else MEM[k] = v; } catch (e) { } },
    del: function (k) { try { if (OK) localStorage.removeItem(k); else delete MEM[k]; } catch (e) { } },
    keys: function () { try { return OK ? Object.keys(localStorage) : Object.keys(MEM); } catch (e) { return []; } }
  };
  window.XS = S;

  /* ---------------- group number ---------------- */
  function hashGG() {
    var m = /(?:^|[#&])gg=(\d{1,2})/.exec(location.hash || '');
    return m ? m[1] : null;
  }
  var GG = hashGG() || S.get('cts452.gg', '');
  if (GG) S.set('cts452.gg', GG);
  function pad(g) { g = String(g || '').replace(/\D/g, ''); return g.length === 1 ? '0' + g : g; }
  function sub(t) { return GG ? String(t).split('##').join(pad(GG)) : String(t); }
  window.CTS = { gg: function () { return GG; }, sub: sub, pad: pad };

  /* ---------------- decimal notation ---------------- */
  var DEC = S.get('cts452.dec', 'de'); // 'de' -> 1.234,56 | 'us' -> 1,234.56
  function amt(t) {
    t = String(t);
    if (DEC === 'de') return t;
    // German 1.234,56 -> US 1,234.56 : swap every dot and comma, char by char
    var out = '', c;
    for (var i = 0; i < t.length; i++) {
      c = t.charAt(i);
      out += (c === '.') ? ',' : (c === ',') ? '.' : c;
    }
    return out;
  }

  /* ---------------- tiny helpers ---------------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) { t = el('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('on');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('on'); }, 1300);
  }

  function copy(text, node) {
    function done() {
      if (node) { node.classList.add('copied'); setTimeout(function () { node.classList.remove('copied'); }, 900); }
      toast('Copied  ' + text);
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fb(); });
      } else fb();
    } catch (e) { fb(); }
    function fb() {
      var ta = el('textarea'); ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e2) { toast('Select and copy manually'); }
      document.body.removeChild(ta);
    }
  }
  window.CTScopy = copy;

  /* ---------------- inline markup: <v> <m> <k> <f> ---------------- */
  function hydrate(root) {
    root.querySelectorAll('v').forEach(function (n) {
      if (n._h) return; n._h = 1;
      var raw = n.getAttribute('data-raw') || n.textContent;
      n.setAttribute('data-raw', raw);
      n.className = 'v'; n.textContent = sub(raw);
      n.title = 'Click to copy';
      n.addEventListener('click', function (e) { e.stopPropagation(); copy(n.textContent, n); });
    });
    root.querySelectorAll('m').forEach(function (n) {
      if (n._h) return; n._h = 1;
      var raw = n.getAttribute('data-raw') || n.textContent;
      n.setAttribute('data-raw', raw);
      n.className = 'm'; n.textContent = amt(raw);
      n.title = 'Click to copy (' + (DEC === 'de' ? 'German' : 'US') + ' notation)';
      n.addEventListener('click', function (e) { e.stopPropagation(); copy(n.textContent, n); });
    });
  }
  function reHydrate() {
    document.querySelectorAll('v').forEach(function (n) { n.textContent = sub(n.getAttribute('data-raw')); });
    document.querySelectorAll('m').forEach(function (n) {
      n.textContent = amt(n.getAttribute('data-raw'));
      n.title = 'Click to copy (' + (DEC === 'de' ? 'German' : 'US') + ' notation)';
    });
    document.querySelectorAll('[data-sub]').forEach(function (n) {
      n.textContent = sub(n.getAttribute('data-sub'));
    });
    document.querySelectorAll('a[data-tasklink]').forEach(function (a) {
      a.href = a.getAttribute('data-tasklink') + (GG ? '#gg=' + pad(GG) : '');
    });
  }
  window.CTShydrate = hydrate;
  window.CTSreHydrate = reHydrate;

  /* wide tables get a horizontal scroller so nothing is clipped on a phone */
  function wrapTables(root) {
    (root || document).querySelectorAll('table.dc, table.kv').forEach(function (t) {
      if (t.parentNode && t.parentNode.classList && t.parentNode.classList.contains('tscroll')) return;
      var w = el('div', 'tscroll');
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });
  }

  /* mobile drawer for the step rail */
  function drawer(rail) {
    var btn = document.getElementById('nav');
    if (!btn || !rail) return;
    var scrim = el('div', 'scrim');
    document.body.appendChild(scrim);
    function close() { rail.classList.remove('open'); scrim.classList.remove('on'); }
    function open() { rail.classList.add('open'); scrim.classList.add('on'); }
    btn.addEventListener('click', function () {
      rail.classList.contains('open') ? close() : open();
    });
    scrim.addEventListener('click', close);
    rail.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) close(); });
  }

  /* offline support when served over https (GitHub Pages); silent elsewhere */
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    // file:// is not a secure context, so this is a no-op locally — by design
    if (location.protocol === 'file:' || !window.isSecureContext) return;
    try {
      var p = navigator.serviceWorker.register('sw.js');
      // swallow async rejection too: some embedded webviews block SW scripts
      if (p && p.catch) p.catch(function () { });
    } catch (e) { }
  }
  window.CTSsw = registerSW;

  /* ---------------- block renderers ---------------- */
  function bPath(b) {
    var w = el('div', 'blk');
    if (b.h) w.appendChild(el('div', 'blk-h', b.h));
    var p = el('div', 'path');
    if (b.tcode) {
      (Array.isArray(b.tcode) ? b.tcode : [b.tcode]).forEach(function (tc) {
        var btn = el('button', 'tc', esc(tc));
        btn.title = 'Click to copy the transaction code';
        btn.addEventListener('click', function (e) { e.stopPropagation(); copy(tc, null); });
        p.appendChild(btn);
      });
      if (b.crumbs) p.appendChild(el('span', 'or', 'or menu path'));
    }
    if (b.crumbs) {
      var ol = el('ol', 'crumbs');
      b.crumbs.forEach(function (c) { ol.appendChild(el('li', '', esc(c))); });
      p.appendChild(ol);
    }
    w.appendChild(p);
    if (b.note) w.appendChild(el('div', 'blk', b.note));
    return w;
  }
  function bClick(b) {
    var w = el('div', 'blk');
    if (b.h) w.appendChild(el('div', 'blk-h', b.h));
    (b.items || []).forEach(function (it, i) {
      var d = el('div', 'click');
      d.appendChild(el('div', 'ic', String(i + 1)));
      d.appendChild(el('div', 'tx', it));
      w.appendChild(d);
    });
    return w;
  }
  function bFields(b) {
    var w = el('div', 'blk');
    w.appendChild(el('div', 'blk-h', b.h || 'Enter these values'));
    var t = el('table', 'fl');
    t.innerHTML = '<tr class="hdr"><th>Field on screen</th><th>Value</th><th></th></tr>';
    (b.rows || []).forEach(function (r) {
      var tr = el('tr', r[3] ? 'hot' : '');
      tr.appendChild(el('td', 'f', r[0]));
      tr.appendChild(el('td', '', r[1]));
      tr.appendChild(el('td', 'n', r[2] || ''));
      t.appendChild(tr);
    });
    w.appendChild(t);
    return w;
  }
  function bTable(b) {
    var w = el('div', 'blk');
    if (b.h) w.appendChild(el('div', 'blk-h', b.h));
    var t = el('table', 'dc'), hr = el('tr', 'hdr');
    (b.cols || []).forEach(function (c) { hr.appendChild(el('th', '', c)); });
    t.appendChild(hr);
    (b.rows || []).forEach(function (r) {
      var tr = el('tr');
      r.forEach(function (c) { tr.appendChild(el('td', '', c)); });
      t.appendChild(tr);
    });
    w.appendChild(t); return w;
  }
  function bCo(b) {
    var icons = { danger: '☠', warn: '⚠', info: 'ℹ', jud: '⚖', ok: '✓' };
    var w = el('div', 'co ' + (b.kind || 'info'));
    if (b.hd) w.appendChild(el('div', 't', '<span>' + (icons[b.kind] || '') + '</span>' + esc(b.hd)));
    w.appendChild(el('div', '', b.html));
    return w;
  }
  function bList(b) {
    var w = el('div', 'blk');
    if (b.h) w.appendChild(el('div', 'blk-h', b.h));
    var l = el(b.ol === false ? 'ul' : 'ol', b.ol === false ? 'bl' : 'st');
    (b.items || []).forEach(function (i) { l.appendChild(el('li', '', i)); });
    w.appendChild(l); return w;
  }
  function bScreen(b, tid) {
    var w = el('div', 'scr');
    w.appendChild(el('div', 'scr-h', esc(b.title)));
    var body = el('div', 'scr-b');
    (b.blocks || []).forEach(function (x) { body.appendChild(render(x, tid)); });
    w.appendChild(body); return w;
  }
  function bDeep(b, tid) {
    var d = el('details', 'dd');
    if (b.open) d.setAttribute('open', '');
    var s = el('summary', '', esc(b.title) + (b.sub ? '<span class="sub">' + esc(b.sub) + '</span>' : ''));
    d.appendChild(s);
    var body = el('div', 'dd-b');
    (b.blocks || []).forEach(function (x) { body.appendChild(render(x, tid)); });
    d.appendChild(body); return d;
  }
  function bLogs(b, tid) {
    var w = el('div', 'logs');
    w.appendChild(el('div', 'blk-h', b.h || 'Write these down'));
    (b.items || []).forEach(function (it) {
      var k = 'cts452.' + tid + '.log.' + it[0];
      var r = el('div', 'lg');
      r.appendChild(el('label', '', it[1]));
      var inp = el('input'); inp.type = 'text'; inp.placeholder = it[2] || '';
      inp.value = S.get(k, '');
      inp.addEventListener('input', function () { S.set(k, inp.value); });
      r.appendChild(inp); w.appendChild(r);
    });
    return w;
  }
  function bHtml(b) { return el('div', 'blk', b.html); }

  function render(b, tid) {
    switch (b.t) {
      case 'path': return bPath(b);
      case 'click': return bClick(b);
      case 'fields': return bFields(b);
      case 'table': return bTable(b);
      case 'co': return bCo(b);
      case 'list': return bList(b);
      case 'screen': return bScreen(b, tid);
      case 'deep': return bDeep(b, tid);
      case 'logs': return bLogs(b, tid);
      default: return bHtml(b);
    }
  }

  /* ---------------- page build ---------------- */
  function build(T) {
    var tid = T.id;
    var prefix = 'cts452.' + tid + '.';

    /* --- top bar --- */
    var bar = el('div', 'bar');
    bar.innerHTML =
      '<div class="bar-in">' +
      '<button id="nav" class="btn sm" aria-label="Steps menu">&#9776;</button>' +
      '<div class="brand"><span class="tag">C_TS452</span>' +
      '<a href="index.html" data-tasklink="index.html" style="text-decoration:none;color:inherit">Task ' + T.num + '</a></div>' +
      '<div class="sp"></div>' +
      '<div class="ctl"><label for="gg">Group&nbsp;##</label>' +
      '<input id="gg" class="gg-in" maxlength="2" inputmode="numeric" placeholder="--"></div>' +
      '<div class="ctl"><label>Decimals</label><select id="dec" class="sel">' +
      '<option value="de">1.234,56</option><option value="us">1,234.56</option></select></div>' +
      '<div class="ctl"><button id="tmr" class="timer" title="Click to start / pause">00:00</button></div>' +
      '<button id="thm" class="btn sm" title="Light / dark">◑</button>' +
      '<button id="exp" class="btn sm">Expand all</button>' +
      '<button id="rst" class="btn sm" title="Clear ticks for this task">Reset</button>' +
      '</div>' +
      '<div class="bar-prog"><span class="lbl" id="pgl">0 / 0</span><div class="prog"><i id="pgi"></i></div></div>';
    document.body.appendChild(bar);

    if (!OK) {
      var nb = el('div', 'nostore',
        'Browser storage is blocked for local files — ticks and notes will not survive a reload. ' +
        'Everything else works. Keep the page open, and keep your paper log sheet.');
      document.body.appendChild(nb);
    }

    /* --- layout --- */
    var wrap = el('div', 'wrap');
    var rail = el('nav', 'rail');
    var main = el('div', 'main');
    wrap.appendChild(rail); wrap.appendChild(main);
    document.body.appendChild(wrap);

    /* --- head --- */
    var head = el('div', 'head');
    head.innerHTML =
      '<div class="eyebrow">Unit 1 · Task ' + T.num + '</div>' +
      '<h1>' + T.title + '</h1>' +
      '<p>' + T.subtitle + '</p>' +
      '<div class="meta">' + (T.pills || []).map(function (p) {
        return '<span class="pill ' + (p[1] || '') + '">' + p[0] + '</span>';
      }).join('') + '</div>';
    main.appendChild(head);

    if (T.org) {
      var os = el('div', 'orgstrip');
      T.org.forEach(function (o) {
        os.appendChild(el('div', '', '<div class="k">' + o[0] + '</div><div class="v">' + o[1] + '</div>'));
      });
      main.appendChild(os);
    }

    (T.intro || []).forEach(function (b) { main.appendChild(render(b, tid)); });

    /* --- steps --- */
    rail.appendChild(el('h4', '', 'Steps'));
    var boxes = [];
    T.steps.forEach(function (st) {
      var sid = tid + '-' + st.n;
      var sec = el('section', 'step open'); sec.id = sid;

      var sh = el('div', 'sh');
      var cb = el('div', 'cb'); cb.setAttribute('role', 'checkbox'); cb.tabIndex = 0;
      var num = el('div', 'num', String(st.n));
      var ttl = el('div', 'sh-t', st.title);
      var est = el('span', 'est', (st.est || 5) + ' min');
      var car = el('span', 'car', '▶');
      sh.appendChild(cb); sh.appendChild(num); sh.appendChild(ttl);
      sh.appendChild(est); sh.appendChild(car);
      sec.appendChild(sh);

      var sb = el('div', 'sb');
      if (st.goal) sb.appendChild(el('div', 'goal', st.goal));
      (st.blocks || []).forEach(function (b) { sb.appendChild(render(b, tid)); });
      if (st.done) sb.appendChild(el('div', 'dw', '<span class="ic">✓</span><div><b>Done when:</b> ' + st.done + '</div>'));
      sec.appendChild(sb);
      main.appendChild(sec);

      /* rail link */
      var a = el('a', '', '<span class="rn">' + st.n + '</span><span data-sub="' +
        st.railTitle.replace(/"/g, '&quot;') + '">' + st.railTitle + '</span>');
      a.href = '#' + sid;
      rail.appendChild(a);

      /* state */
      var key = prefix + 'step.' + st.n;
      function paint() {
        var on = S.get(key, '0') === '1';
        cb.classList.toggle('on', on);
        sec.classList.toggle('done', on);
        a.classList.toggle('done', on);
        cb.setAttribute('aria-checked', on ? 'true' : 'false');
      }
      function toggle(e) {
        if (e) e.stopPropagation();
        S.set(key, S.get(key, '0') === '1' ? '0' : '1');
        paint(); progress();
      }
      cb.addEventListener('click', toggle);
      cb.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } });
      sh.addEventListener('click', function () { sec.classList.toggle('open'); });
      paint();
      boxes.push({ key: key, paint: paint });
    });

    /* --- final checklist --- */
    if (T.check) {
      var ck = el('div', 'ck');
      ck.appendChild(el('h3', '', 'Task ' + T.num + ' — final check before you move on'));
      T.check.forEach(function (c, i) {
        var key = prefix + 'chk.' + i;
        var row = el('div', 'row');
        var cb2 = el('div', 'cb'); cb2.tabIndex = 0;
        var tx = el('div', 'tx', c);
        function p2() { cb2.classList.toggle('on', S.get(key, '0') === '1'); }
        function t2() { S.set(key, S.get(key, '0') === '1' ? '0' : '1'); p2(); progress(); }
        cb2.addEventListener('click', t2);
        cb2.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); t2(); } });
        p2();
        row.appendChild(cb2); row.appendChild(tx); ck.appendChild(row);
        boxes.push({ key: key, paint: p2 });
      });
      main.appendChild(ck);
    }

    (T.outro || []).forEach(function (b) { main.appendChild(render(b, tid)); });

    /* --- progress --- */
    function progress() {
      var n = 0;
      boxes.forEach(function (b) { if (S.get(b.key, '0') === '1') n++; });
      var pct = boxes.length ? Math.round(n / boxes.length * 100) : 0;
      document.getElementById('pgl').textContent = n + ' / ' + boxes.length + '  ·  ' + pct + '%';
      document.getElementById('pgi').style.width = pct + '%';
      S.set(prefix + 'pct', String(pct));
    }
    progress();

    /* --- controls --- */
    var ggIn = document.getElementById('gg');
    ggIn.value = GG ? pad(GG) : '';
    ggIn.addEventListener('input', function () {
      GG = ggIn.value.replace(/\D/g, '').slice(0, 2);
      S.set('cts452.gg', GG);
      reHydrate();
    });
    ggIn.addEventListener('blur', function () { if (GG) { ggIn.value = pad(GG); } });
    if (!GG) setTimeout(function () { ggIn.focus(); toast('Type your group number first'); }, 350);

    var decIn = document.getElementById('dec');
    decIn.value = DEC;
    decIn.addEventListener('change', function () { DEC = decIn.value; S.set('cts452.dec', DEC); reHydrate(); });

    document.getElementById('thm').addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme');
      var nx = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nx);
      S.set('cts452.theme', nx);
    });
    var th = S.get('cts452.theme', ''); if (th) document.documentElement.setAttribute('data-theme', th);

    var expBtn = document.getElementById('exp');
    expBtn.addEventListener('click', function () {
      var anyClosed = !!document.querySelector('.step:not(.open)');
      document.querySelectorAll('.step').forEach(function (s) { s.classList.toggle('open', anyClosed); });
      document.querySelectorAll('details.dd').forEach(function (d) { d.open = anyClosed; });
      expBtn.textContent = anyClosed ? 'Collapse all' : 'Expand all';
    });

    document.getElementById('rst').addEventListener('click', function () {
      if (!confirm('Clear every tick and note for Task ' + T.num + '?\n(Your group number and settings are kept.)')) return;
      S.keys().slice().forEach(function (k) { if (k.indexOf(prefix) === 0) S.del(k); });
      location.reload();
    });

    /* --- timer --- */
    var tb = document.getElementById('tmr');
    var tKey = prefix + 'timer', rKey = prefix + 'running';
    var base = parseInt(S.get(tKey, '0'), 10) || 0;
    var startedAt = parseInt(S.get(rKey, '0'), 10) || 0;
    function elapsed() { return base + (startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0); }
    function fmt(s) { var m = Math.floor(s / 60), x = s % 60; return (m < 10 ? '0' : '') + m + ':' + (x < 10 ? '0' : '') + x; }
    function tick() {
      var e = elapsed();
      tb.textContent = fmt(e);
      tb.classList.toggle('over', e > (T.budget || 60) * 60);
      tb.title = startedAt ? 'Running — click to pause (budget ' + T.budget + ' min)'
        : 'Paused — click to start (budget ' + T.budget + ' min)';
      tb.style.opacity = startedAt ? '1' : '.62';
    }
    tb.addEventListener('click', function () {
      if (startedAt) { base = elapsed(); startedAt = 0; S.set(tKey, String(base)); S.set(rKey, '0'); }
      else { startedAt = Date.now(); S.set(rKey, String(startedAt)); }
      tick();
    });
    tick(); setInterval(tick, 1000);

    /* --- rail highlight --- */
    var links = Array.prototype.slice.call(rail.querySelectorAll('a'));
    var secs = Array.prototype.slice.call(document.querySelectorAll('section.step'));
    function spy() {
      var y = window.scrollY + 160, cur = 0;
      secs.forEach(function (s, i) { if (s.offsetTop <= y) cur = i; });
      links.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
    }
    window.addEventListener('scroll', spy, { passive: true }); spy();

    hydrate(document.body);
    reHydrate();
    wrapTables(document.body);
    drawer(rail);
    registerSW();
  }

  /* printing: force everything open so nothing is lost on paper */
  function expandForPrint() {
    document.querySelectorAll('.step').forEach(function (s) { s.classList.add('open'); });
    document.querySelectorAll('details').forEach(function (d) { d.open = true; });
  }
  window.addEventListener('beforeprint', expandForPrint);
  if (window.matchMedia) {
    try {
      window.matchMedia('print').addListener(function (m) { if (m.matches) expandForPrint(); });
    } catch (e) { }
  }

  window.CTSbuild = build;

  /* index pages just need chrome + hydration */
  window.CTSsimple = function () {
    var th = S.get('cts452.theme', ''); if (th) document.documentElement.setAttribute('data-theme', th);
    hydrate(document.body); reHydrate();
    wrapTables(document.body);
    drawer(document.querySelector('.rail'));
    registerSW();
  };
})();
