(() => {
  'use strict';
  const $ = (s) => document.querySelector(s), J = window.Jalali;
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (g) => g[0] + '-' + pad(g[1]) + '-' + pad(g[2]);
  const parse = (v) => (v ? v.split('-').map(Number) : null);
  const num = (j) => j.jy + '/' + pad(j.jm) + '/' + pad(j.jd);
  const fa = (j, wd) => (wd ? wd[0] + '، ' : '') + J.faDigits(j.jd) + ' ' + J.MONTHS[j.jm - 1][0] + ' ' + J.faDigits(j.jy);
  const en = (j, wd) => (wd ? wd[1] + ', ' : '') + j.jd + ' ' + J.MONTHS[j.jm - 1][1] + ' ' + j.jy;
  const now = new Date(), tg = [now.getFullYear(), now.getMonth() + 1, now.getDate()], tj = J.toJalali(...tg);

  const toast = (t) => { const e = $('#toast'); e.textContent = t; e.classList.add('show'); clearTimeout(toast.id); toast.id = setTimeout(() => e.classList.remove('show'), 1600); };
  async function copy(text) { try { await navigator.clipboard.writeText(text); toast('Copied ' + text); } catch { toast('Copy is not available here'); } }

  // Today
  const twd = J.WEEKDAYS[J.weekday(...tg)];
  $('#t-fa').textContent = fa(tj, twd);
  $('#t-en').textContent = en(tj, twd) + '  ·  ' + iso(tg);
  $('#t-copy').textContent = 'Copy ' + num(tj);
  $('#t-copy').addEventListener('click', () => copy(num(tj)));

  // Gregorian to Jalali
  function g2j() {
    const g = parse($('#g-in').value), a = $('#g-out'), b = $('#g-out-en');
    if (!g) { a.textContent = ''; b.textContent = ''; return; }
    try { const j = J.toJalali(...g); a.textContent = fa(j, J.WEEKDAYS[J.weekday(...g)]); b.textContent = en(j) + '  (' + num(j) + ')'; }
    catch { a.textContent = ''; b.textContent = 'That date is out of range.'; }
  }

  // Jalali to Gregorian
  J.MONTHS.forEach((m, i) => $('#j-m').add(new Option((i + 1) + ' · ' + m[1] + ' (' + m[0] + ')', i + 1)));
  function j2g() {
    const y = +$('#j-y').value, m = +$('#j-m').value, d = +$('#j-d').value, out = $('#j-out');
    out.classList.remove('bad');
    if (!y || !d) { out.textContent = ''; return; }
    if (!J.isValidJalali(y, m, d)) {
      out.classList.add('bad');
      out.textContent = y >= 1 && y < 3000 ? 'Invalid date: ' + J.MONTHS[m - 1][1] + ' ' + y + ' has ' + J.monthLength(y, m) + ' days.' : 'Year out of range.';
      return;
    }
    const g = J.toGregorian(y, m, d), arr = [g.gy, g.gm, g.gd];
    out.textContent = J.WEEKDAYS[J.weekday(...arr)][1] + ', ' + iso(arr);
  }
  ['#j-y', '#j-m', '#j-d'].forEach((s) => $(s).addEventListener('input', j2g));

  // Days between
  function between() {
    const a = parse($('#d-a').value), b = parse($('#d-b').value), out = $('#d-out'), sub = $('#d-sub');
    if (!a || !b) { out.textContent = ''; sub.textContent = ''; return; }
    const n = J.daysBetween(a, b), k = Math.abs(n);
    out.textContent = k + ' day' + (k === 1 ? '' : 's') + (n < 0 ? ' (the second date is earlier)' : '');
    try { sub.textContent = Math.floor(k / 7) + ' weeks and ' + (k % 7) + ' days  ·  ' + num(J.toJalali(...a)) + ' to ' + num(J.toJalali(...b)); } catch { sub.textContent = ''; }
  }
  ['#d-a', '#d-b'].forEach((s) => $(s).addEventListener('input', between));
  $('#g-in').addEventListener('input', g2j);

  // Calendar
  const cal = { y: tj.jy, m: tj.jm };
  function draw() {
    $('#c-title').textContent = J.MONTHS[cal.m - 1][0] + ' ' + J.faDigits(cal.y);
    $('#c-sub').textContent = J.MONTHS[cal.m - 1][1] + ' ' + cal.y;
    const g = J.toGregorian(cal.y, cal.m, 1), first = J.weekday(g.gy, g.gm, g.gd), len = J.monthLength(cal.y, cal.m), grid = $('#c-grid');
    grid.textContent = '';
    ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].forEach((w) => { const h = document.createElement('b'); h.textContent = w; grid.appendChild(h); });
    for (let i = 0; i < first; i++) grid.appendChild(document.createElement('span'));
    for (let d = 1; d <= len; d++) {
      const c = document.createElement('button'); c.type = 'button'; c.className = 'cell' + ((first + d - 1) % 7 === 6 ? ' fri' : '') + (cal.y === tj.jy && cal.m === tj.jm && d === tj.jd ? ' today' : '');
      c.textContent = J.faDigits(d); c.setAttribute('aria-label', d + ' ' + J.MONTHS[cal.m - 1][1] + ' ' + cal.y);
      c.addEventListener('click', () => { $('#j-y').value = cal.y; $('#j-m').value = cal.m; $('#j-d').value = d; j2g(); $('#j-out').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
      grid.appendChild(c);
    }
  }
  $('#c-prev').addEventListener('click', () => { cal.m--; if (cal.m < 1) { cal.m = 12; cal.y--; } draw(); });
  $('#c-next').addEventListener('click', () => { cal.m++; if (cal.m > 12) { cal.m = 1; cal.y++; } draw(); });

  // Defaults
  $('#g-in').value = iso(tg); g2j();
  $('#j-y').value = tj.jy; $('#j-m').value = tj.jm; $('#j-d').value = tj.jd; j2g();
  const later = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30);
  $('#d-a').value = iso(tg); $('#d-b').value = iso([later.getFullYear(), later.getMonth() + 1, later.getDate()]); between();
  draw();

  const root = document.documentElement;
  try { root.dataset.theme = localStorage.getItem('jalalikit-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); } catch { root.dataset.theme = 'dark'; }
  $('#theme').addEventListener('click', () => { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('jalalikit-theme', root.dataset.theme); } catch { /* ignore */ } });
})();
