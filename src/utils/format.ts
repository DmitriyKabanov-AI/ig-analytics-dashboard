import type { Brand, Reel } from '../types'
export const fmt = (n: number) => {
  const a = Math.abs(n)
  if (a >= 1e6) return +(n / 1e6).toFixed(1) + 'M'
  if (a >= 1e3) return +(n / 1e3).toFixed(1) + 'K'
  return String(Math.round(n))
}
export const pct = (x: number, d = 1) => (x * 100).toFixed(d).replace('.', ',') + '%'
export const dmy = (s: string) => new Date(s).toLocaleDateString('ru-RU')
export const median = (a: number[]) => {
  const s = [...a].sort((x, y) => x - y), m = s.length >> 1
  return s.length ? (s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) : 0
}
export const rates = (r: Reel) => ({
  er: (r.likes + r.comments + r.shares + r.saves) / r.views,
  share: r.shares / r.views, save: r.saves / r.views, comment: r.comments / r.views,
})
export const growth = (b: Brand, w = 8) => { const s = b.series; return s[s.length - 1].followers / s[s.length - 1 - w].followers - 1 }
export const FORMULAS = {
  er: 'ER = (лайки + комментарии + шеры + сохранения) / просмотры',
  share: 'Share rate = шеры / просмотры',
  save: 'Save rate = сохранения / просмотры',
  comment: 'Comment rate = комментарии / просмотры',
}
