(function (root) {
  'use strict';
  const div = (a, b) => Math.trunc(a / b), mod = (a, b) => a - Math.trunc(a / b) * b;
  const BR = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  function jalCal(jy, noLeap) {
    const bl = BR.length, gy = jy + 621;
    let leapJ = -14, jp = BR[0], jm, jump = 0, i;
    if (jy < jp || jy >= BR[bl - 1]) throw new Error('Year out of range');
    for (i = 1; i < bl; i++) { jm = BR[i]; jump = jm - jp; if (jy < jm) break; leapJ += div(jump, 33) * 8 + div(mod(jump, 33), 4); jp = jm; }
    let n = jy - jp;
    leapJ += div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
    if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
    const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150, march = 20 + leapJ - leapG;
    if (noLeap) return { gy, march };
    if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
    let leap = mod(mod(n + 1, 33) - 1, 4); if (leap === -1) leap = 4;
    return { leap, gy, march };
  }
  function g2d(gy, gm, gd) {
    let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
    return d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  }
  function d2g(jdn) {
    let j = 4 * jdn + 139361631; j += div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
    const i = div(mod(j, 1461), 4) * 5 + 308, gd = div(mod(i, 153), 5) + 1, gm = mod(div(i, 153), 12) + 1;
    return { gy: div(j, 1461) - 100100 + div(8 - gm, 6), gm, gd };
  }
  function j2d(jy, jm, jd) { const r = jalCal(jy, true); return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1; }
  function d2j(jdn) {
    const gy = d2g(jdn).gy; let jy = gy - 621; const r = jalCal(jy), jdn1f = g2d(gy, 3, r.march);
    let k = jdn - jdn1f, jm, jd;
    if (k >= 0) { if (k <= 185) return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 }; k -= 186; }
    else { jy -= 1; k += 179; if (r.leap === 1) k += 1; }
    jm = 7 + div(k, 30); jd = mod(k, 30) + 1; return { jy, jm, jd };
  }
  const isLeap = (jy) => jalCal(jy).leap === 0;
  const monthLength = (jy, jm) => (jm <= 6 ? 31 : jm <= 11 ? 30 : isLeap(jy) ? 30 : 29);
  const isValidJalali = (jy, jm, jd) => jy >= -61 && jy < 3177 && jm >= 1 && jm <= 12 && jd >= 1 && jd <= monthLength(jy, jm);
  const toJalali = (gy, gm, gd) => d2j(g2d(gy, gm, gd));
  const toGregorian = (jy, jm, jd) => d2g(j2d(jy, jm, jd));
  const daysBetween = (a, b) => g2d(b[0], b[1], b[2]) - g2d(a[0], a[1], a[2]);
  const MONTHS = [['فروردین', 'Farvardin'], ['اردیبهشت', 'Ordibehesht'], ['خرداد', 'Khordad'], ['تیر', 'Tir'], ['مرداد', 'Mordad'], ['شهریور', 'Shahrivar'], ['مهر', 'Mehr'], ['آبان', 'Aban'], ['آذر', 'Azar'], ['دی', 'Dey'], ['بهمن', 'Bahman'], ['اسفند', 'Esfand']];
  const WEEKDAYS = [['شنبه', 'Saturday'], ['یکشنبه', 'Sunday'], ['دوشنبه', 'Monday'], ['سه‌شنبه', 'Tuesday'], ['چهارشنبه', 'Wednesday'], ['پنجشنبه', 'Thursday'], ['جمعه', 'Friday']];
  const weekday = (gy, gm, gd) => (new Date(Date.UTC(gy, gm - 1, gd)).getUTCDay() + 1) % 7;
  const faDigits = (s) => String(s).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const api = { toJalali, toGregorian, isLeap, monthLength, isValidJalali, daysBetween, weekday, faDigits, MONTHS, WEEKDAYS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Jalali = api;
})(typeof self !== 'undefined' ? self : this);
