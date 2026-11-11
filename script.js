(function () {
  'use strict';

  var TOTAL = 106;
  var SINGLE = { tag: 'Respuesta única', text: 'La suma del bloque da 100%.' };
  var MULTI = { tag: 'Opción múltiple', text: 'Cada persona pudo elegir varias opciones, por eso la suma supera el 100%.', multi: true };

  // Para cambiar un dato, editar los valores de esta lista.
  var SECTIONS = {
    perfil: [
      { title: 'Género', foot: SINGLE, rows: [
        { label: 'Mujeres', pct: 61.3, n: 65 },
        { label: 'Hombres', pct: 37.7, n: 40 },
        { label: 'Prefirió no responder', pct: 0.9, n: 1 }
      ] },
      { title: 'Edad', foot: SINGLE, rows: [
        { label: '46 a 60 años', pct: 35.8, n: 38 },
        { label: '18 a 25 años', pct: 30.2, n: 32 },
        { label: '26 a 35 años', pct: 24.5, n: 26 },
        { label: '36 a 45 años', pct: 6.6, n: 7 },
        { label: 'Menores de 18 años', pct: 1.9, n: 2 },
        { label: 'Mayores de 60 años', pct: 0.9, n: 1 }
      ] }
    ],
    identidad: [
      { title: 'Importancia', foot: { tag: SINGLE.tag, text: 'La suma del bloque da 100%. El 80,2% está incluido dentro del 97,2%.' },
        highlight: { label: 'Lo considera importante o muy importante', pct: 97.2, n: 103 },
        rows: [
          { label: 'Muy importante', pct: 80.2, n: 85 },
          { label: 'Importante', pct: 17.0, n: 18 },
          { label: 'No relevante o sin opinión', pct: 2.8, n: 3 }
        ] },
      { title: 'Vigencia del logo actual', foot: SINGLE, rows: [
        { label: 'La ve poco vigente', pct: 36.8, n: 39 },
        { label: 'La ve neutra', pct: 35.8, n: 38 },
        { label: 'La ve vigente', pct: 27.4, n: 29 },
        { label: 'Promedio sobre 5 (no es un porcentaje)', fixed: '2,9' }
      ] },
      { title: 'Qué transmite hoy el logo', wide: true, cols: 2,
        foot: { tag: SINGLE.tag, text: 'La suma del bloque da 100% (99,9% por redondeo).' }, rows: [
        { label: 'Turismo y cultura', pct: 38.7, n: 41 },
        { label: 'Ninguna de las opciones', pct: 13.2, n: 14 },
        { label: 'Historia y tradición', pct: 22.6, n: 24 },
        { label: 'Otro', pct: 6.6, n: 7 },
        { label: 'Identidad local', pct: 16.0, n: 17 },
        { label: 'Modernidad', pct: 2.8, n: 3 }
      ] }
    ],
    quieren: [
      { title: 'Qué debe transmitir el nuevo logo', foot: MULTI, rows: [
        { label: 'Identidad riojana', pct: 74.5, n: 79 },
        { label: 'Tradición', pct: 41.5, n: 44 },
        { label: 'Cercanía con la gente', pct: 40.6, n: 43 },
        { label: 'Modernidad', pct: 18.9, n: 20 },
        { label: 'Profesionalismo', pct: 4.7, n: 5 }
      ] },
      { title: 'Cómo debe ser', foot: MULTI, rows: [
        { label: 'Representativo de la cultura riojana', pct: 67.0, n: 71 },
        { label: 'Tradicional', pct: 48.1, n: 51 },
        { label: 'Moderno', pct: 29.2, n: 31 },
        { label: 'Colorido', pct: 20.8, n: 22 },
        { label: 'Minimalista', pct: 16.0, n: 17 },
        { label: 'Sobrio', pct: 8.5, n: 9 }
      ] }
    ],
    problema: [
      { big: true, pct: 8.5, n: 9, title: 'Asocia el logo con el cartel de la Ruta 40',
        sub: 'También con una señal de tránsito, con vialidad o con la policía',
        foot: { tag: 'Mención espontánea', text: 'En las respuestas abiertas.' } },
      { big: true, pct: 36.8, n: 39, title: 'La ve poco vigente',
        sub: 'Puntajes 1 y 2 en vigencia',
        foot: { tag: SINGLE.tag, text: 'Pregunta de vigencia.' } },
      { big: true, pct: 50.9, n: 54, title: 'No lo identifica con claridad',
        sub: '29,2% no lo reconoce y 21,7% lo siente familiar pero no lo ubica',
        subN: '31 personas no lo reconocen y 23 lo sienten familiar pero no lo ubican',
        foot: { tag: SINGLE.tag, text: 'Pregunta de reconocimiento.' } }
    ]
  };

  var mode = 'pct';
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function fmtPct(p) { return p.toFixed(1).replace('.', ',') + '%'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function valueText(item) {
    if (item.fixed) return item.fixed;
    return mode === 'pct' ? fmtPct(item.pct) : String(item.n);
  }
  function titleText(item) {
    if (item.fixed) return item.label;
    return item.n + ' de ' + (item.base || TOTAL) + ' personas (' + fmtPct(item.pct) + ')';
  }

  function rowHTML(item, cls) {
    var fixed = item.fixed ? ' is-fixed' : '';
    var w = item.fixed ? 0 : Math.min(item.pct, 100);
    return '<li class="row' + (cls ? ' ' + cls : '') + fixed + '" tabindex="0" title="' + esc(titleText(item)) + '"' +
      ' data-pct="' + (item.pct == null ? '' : item.pct) + '" data-n="' + (item.n == null ? '' : item.n) + '"' + (item.fixed ? ' data-fixed="' + esc(item.fixed) + '"' : '') + '>' +
      '<span class="val">' + valueText(item) + '</span>' +
      '<span class="lab">' + esc(item.label) + '</span>' +
      '<span class="bar" aria-hidden="true"><i style="--w:' + w + '%"></i></span></li>';
  }

  function footHTML(foot) {
    return '<p class="card-foot"><span class="tag' + (foot.multi ? ' tag-multi' : '') + '">' + esc(foot.tag) + '</span>' + esc(foot.text) + '</p>';
  }

  function cardHTML(b) {
    var html = '<article class="card' + (b.wide ? ' span-2' : '') + '"><h3>' + esc(b.title) + '</h3><ul class="rows' + (b.cols === 2 ? ' cols-2' : '') + '">';
    if (b.highlight) html += rowHTML(b.highlight, 'highlight');
    b.rows.forEach(function (r) { html += rowHTML(r); });
    return html + '</ul>' + footHTML(b.foot) + '</article>';
  }

  function bigHTML(b) {
    return '<article class="card card-big" data-big data-pct="' + b.pct + '" data-n="' + b.n + '" title="' + esc(b.n + ' de ' + TOTAL + ' personas (' + fmtPct(b.pct) + ')') + '">' +
      '<span class="big">' + (mode === 'pct' ? fmtPct(b.pct) : b.n + '<small>personas</small>') + '</span>' +
      '<h3>' + esc(b.title) + '</h3>' +
      '<p class="sub" data-sub="' + esc(b.sub) + '" data-subn="' + esc(b.subN || b.sub) + '">' + esc(b.sub) + '</p>' +
      '<span class="bar" aria-hidden="true"><i style="--w:' + b.pct + '%"></i></span>' +
      footHTML(b.foot) + '</article>';
  }

  function render() {
    Object.keys(SECTIONS).forEach(function (key) {
      var grid = $('#grid-' + key);
      if (!grid) return;
      grid.innerHTML = SECTIONS[key].map(function (b) { return b.big ? bigHTML(b) : cardHTML(b); }).join('');
    });
  }

  // Cambiar entre porcentaje y cantidad de personas
  function setMode(next) {
    mode = next;
    $$('.seg-btn[data-mode]').forEach(function (btn) {
      var on = btn.getAttribute('data-mode') === mode;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    $$('.row').forEach(function (row) {
      if (row.hasAttribute('data-fixed')) return;
      var v = $('.val', row);
      v.textContent = mode === 'pct' ? fmtPct(parseFloat(row.getAttribute('data-pct'))) : row.getAttribute('data-n');
    });
    $$('[data-big]').forEach(function (card) {
      var pct = parseFloat(card.getAttribute('data-pct'));
      var n = card.getAttribute('data-n');
      $('.big', card).innerHTML = mode === 'pct' ? fmtPct(pct) : n + '<small>personas</small>';
      var sub = $('.sub', card);
      sub.textContent = mode === 'pct' ? sub.getAttribute('data-sub') : sub.getAttribute('data-subn');
    });
  }

  // Animar las barras al entrar en pantalla
  function observeBars() {
    var targets = $$('.card');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    targets.forEach(function (t) { io.observe(t); });
  }

  var X = window.__EXTRA__ || { preguntas: [], cruces: [], abiertas: [], individuales: [] };
  var viewMain, viewExtra, barMain, barExtra, mainY = 0;
  function nmz(s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  function crossHTML(t) {
    var h = '<article class="card span-2"><h3>' + esc(t.title) + '</h3><div class="xwrap"><table class="xt"><thead><tr><th scope="col">Indicador</th>';
    t.heads.forEach(function (x) { h += '<th scope="col">' + esc(x) + '</th>'; });
    h += '</tr></thead><tbody>';
    t.rows.forEach(function (r) {
      h += '<tr><th scope="row">' + esc(r.label) + '</th>';
      r.cells.forEach(function (c) { h += '<td>' + (c.t ? '<b>' + c.t + '</b>' : '<b>' + fmtPct(c.p) + '</b> <span class="mut">' + c.n + '</span>') + '</td>'; });
      h += '</tr>';
    });
    return h + '</tbody></table></div><p class="card-foot">' + esc(t.foot) + ' El número gris es la cantidad de personas.</p></article>';
  }

  function renderExtra() {
    $('#grid-adicional-preguntas').innerHTML = X.preguntas.map(cardHTML).join('');
    $('#grid-adicional-cruces').innerHTML = X.cruces.map(crossHTML).join('');
    $('#grid-adicional-abiertas').innerHTML = X.abiertas.map(cardHTML).join('');
    setupTable();
  }

  // Tabla de respuestas individuales (sin nombres ni correos)
  function setupTable() {
    var data = X.individuales, body = $('#tbody'), q = $('#q'), cnt = $('#count'), open = {};
    var sels = { g: $('#f-g'), e: $('#f-e'), l: $('#f-l'), c: $('#f-c') };
    data.forEach(function (r) {
      r._s = nmz([r.g, r.e, r.l, r.o, r.c, r.r, r.s, r.k, r.n].concat(r.d.map(function (x) { return x[1]; })).join(' '));
    });
    Object.keys(sels).forEach(function (k) {
      var vals = [];
      data.forEach(function (r) { if (vals.indexOf(r[k]) < 0) vals.push(r[k]); });
      sels[k].innerHTML = '<option value="">' + esc(sels[k].getAttribute('data-all')) + '</option>' + vals.map(function (v) { return '<option>' + esc(v) + '</option>'; }).join('');
      sels[k].addEventListener('change', draw);
    });
    q.addEventListener('input', draw);
    $('#clear').addEventListener('click', function () { q.value = ''; Object.keys(sels).forEach(function (k) { sels[k].value = ''; }); draw(); });
    function draw() {
      var t = nmz(q.value), html = '', n = 0;
      data.forEach(function (r) {
        for (var k in sels) { if (sels[k].value && r[k] !== sels[k].value) return; }
        if (t && r._s.indexOf(t) < 0) return;
        n++;
        html += '<tr class="ir" data-id="' + r.id + '" tabindex="0" aria-expanded="' + (open[r.id] ? 'true' : 'false') + '">' +
          [r.id, r.g, r.e, r.l, r.o, r.c, r.r, r.v, r.s, r.k, r.n].map(function (v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>';
        if (open[r.id]) {
          html += '<tr class="detail"><td colspan="11"><dl>' + (r.d.length ? r.d.map(function (x) { return '<div><dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd></div>'; }).join('') : '<div><dd>Sin respuestas adicionales.</dd></div>') + '</dl></td></tr>';
        }
      });
      body.innerHTML = html;
      cnt.textContent = 'Mostrando ' + n + ' de ' + data.length + ' respuestas';
    }
    function toggleRow(el) {
      var row = el && el.closest ? el.closest('.ir') : null;
      if (!row) return;
      var id = row.getAttribute('data-id'); open[id] = !open[id]; draw();
      var again = body.querySelector('.ir[data-id="' + id + '"]'); if (again) again.focus();
    }
    body.addEventListener('click', function (e) { toggleRow(e.target); });
    body.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleRow(e.target); } });
    draw();
  }

  // Cambio de vista (principal / datos adicionales) según el hash
  function route(first) {
    var h = location.hash, toExtra = h === '#datos-adicionales' || h.indexOf('#adicional-') === 0, wasExtra = !viewExtra.hidden;
    if (toExtra === wasExtra && !first) return;
    if (toExtra && !wasExtra) mainY = window.pageYOffset;
    viewMain.hidden = toExtra; barMain.hidden = toExtra; viewExtra.hidden = !toExtra; barExtra.hidden = !toExtra;
    window.dispatchEvent(new Event('viewchange'));
    if (toExtra) {
      var el = h.indexOf('#adicional-') === 0 ? document.getElementById(h.slice(1)) : null;
      if (el) el.scrollIntoView(); else window.scrollTo(0, 0);
    } else if (wasExtra) window.scrollTo(0, mainY);
  }

  // Menú: la sección activa se calcula según la posición del scroll
  function setupNav() {
    var pinned = null, ticking = false;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function curView() { return viewExtra.hidden ? viewMain : viewExtra; }
    function curBar() { return viewExtra.hidden ? barMain : barExtra; }
    function headerH() { return curBar().offsetHeight || 84; }
    function syncHeader() { document.documentElement.style.setProperty('--hdr', headerH() + 'px'); }
    function setActive(id) {
      $$('[data-nav]', curBar()).forEach(function (a) {
        var on = a.getAttribute('data-nav') === id;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }
    function update() {
      ticking = false;
      if (pinned) return;
      var secs = $$('[data-section]', curView()), line = headerH() + 40, current = null;
      secs.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s.id; });
      if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 4) {
        secs.forEach(function (s) { if (s.getBoundingClientRect().top < window.innerHeight * 0.6) current = s.id; });
      }
      setActive(current);
    }
    function requestUpdate() { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('[data-nav]');
      if (!a) return;
      var id = a.getAttribute('data-nav'), target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      pinned = id; setActive(id);
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      try { history.replaceState(null, '', '#' + id); } catch (err) { /* sin historial */ }
    });
    function release() { if (pinned) { pinned = null; requestUpdate(); } }
    window.addEventListener('wheel', release, { passive: true });
    window.addEventListener('touchmove', release, { passive: true });
    window.addEventListener('keydown', function (e) { if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].indexOf(e.key) !== -1) release(); });
    window.addEventListener('pointerdown', function (e) { if (!e.target.closest || !e.target.closest('.topbar')) release(); });
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', function () { syncHeader(); requestUpdate(); });
    window.addEventListener('viewchange', function () { pinned = null; syncHeader(); update(); });
    syncHeader(); update();
  }

  function init() {
    viewMain = $('#view-main'); viewExtra = $('#view-extra'); barMain = $('#topbar'); barExtra = $('#topbar-extra');
    render();
    renderExtra();
    $$('.seg-btn[data-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () { setMode(btn.getAttribute('data-mode')); });
    });
    $$('.toggle-bars').forEach(function (cb) {
      cb.addEventListener('change', function () {
        document.body.classList.toggle('no-bars', !cb.checked);
        $$('.toggle-bars').forEach(function (o) { o.checked = cb.checked; });
      });
    });
    observeBars();
    setupNav();
    window.addEventListener('hashchange', function () { route(false); });
    route(true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
