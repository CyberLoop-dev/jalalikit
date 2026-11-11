const J = require('./jalali.js');
let failed = 0;
const eq = (name, a, b) => { const ok = JSON.stringify(a) === JSON.stringify(b); if (!ok) failed++; console.log(ok ? 'ok  ' : 'FAIL', name, ok ? '' : JSON.stringify(a) + ' != ' + JSON.stringify(b)); };
eq('2024-03-20 -> 1403/1/1', J.toJalali(2024, 3, 20), { jy: 1403, jm: 1, jd: 1 });
eq('2021-03-21 -> 1400/1/1', J.toJalali(2021, 3, 21), { jy: 1400, jm: 1, jd: 1 });
eq('2021-03-20 -> 1399/12/30', J.toJalali(2021, 3, 20), { jy: 1399, jm: 12, jd: 30 });
eq('2025-03-20 -> 1403/12/30', J.toJalali(2025, 3, 20), { jy: 1403, jm: 12, jd: 30 });
eq('2025-03-21 -> 1404/1/1', J.toJalali(2025, 3, 21), { jy: 1404, jm: 1, jd: 1 });
eq('2026-03-21 -> 1405/1/1', J.toJalali(2026, 3, 21), { jy: 1405, jm: 1, jd: 1 });
eq('1403/1/1 -> 2024-03-20', J.toGregorian(1403, 1, 1), { gy: 2024, gm: 3, gd: 20 });
eq('leap 1399, 1403', [J.isLeap(1399), J.isLeap(1403)], [true, true]);
eq('not leap 1400-1402', [1400, 1401, 1402].map(J.isLeap), [false, false, false]);
eq('month lengths 1404', [J.monthLength(1404, 1), J.monthLength(1404, 7), J.monthLength(1404, 12)], [31, 30, 29]);
eq('invalid 1404/12/30', J.isValidJalali(1404, 12, 30), false);
eq('days 2024-03-20..2025-03-20', J.daysBetween([2024, 3, 20], [2025, 3, 20]), 365);
eq('weekday 2024-03-20 (Wednesday) -> 4', J.weekday(2024, 3, 20), 4);
let bad = 0; const start = Date.UTC(1990, 0, 1);
for (let i = 0; i < 20000; i++) {
  const d = new Date(start + i * 86400000), g = [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()];
  const j = J.toJalali(...g), b = J.toGregorian(j.jy, j.jm, j.jd);
  if (b.gy !== g[0] || b.gm !== g[1] || b.gd !== g[2] || !J.isValidJalali(j.jy, j.jm, j.jd)) bad++;
}
eq('round trip over 20000 days (1990-2044)', bad, 0);
eq('faDigits', J.faDigits('1404/07/09'), '۱۴۰۴/۰۷/۰۹');
console.log(failed ? 'FAILURES: ' + failed : 'all passed');
process.exit(failed ? 1 : 0);
