import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, ExternalLink } from 'lucide-react'
import { Card, Tag, Crumbs, PageSkeleton, ErrorState, Thumb, Chart, Empty, Seg } from '../components/ui'
import { useData } from '../hooks/useData'
import { useFilters } from '../hooks/useFilters'
import { fmt, pct, dmy, rates, median, FORMULAS } from '../utils/format'

type Sort = 'date' | 'views' | 'er'
export default function Reels() {
  const { data, isLoading, isError, refetch } = useData()
  const { q, showExcluded } = useFilters()
  const [sort, setSort] = useState<Sort>('views')
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (isLoading || !data) return <PageSkeleton />
  const brand = (id: string) => data.brands.find(b => b.id === id)!
  const med = (id: string) => median(data.reels.filter(r => r.brandId === id).map(r => r.views))
  const pctile = (r: typeof data.reels[0]) => { const s = data.reels.filter(x => x.brandId === r.brandId); return Math.round((s.filter(x => x.views <= r.views).length / s.length) * 100) }
  const list = data.reels
    .filter(r => (showExcluded || !brand(r.brandId).excluded) && (r.caption + brand(r.brandId).name + r.tags.join(' ')).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sort === 'date' ? b.date.localeCompare(a.date) : sort === 'views' ? b.views - a.views : rates(b).er - rates(a).er)
  const th = (t: string, tip?: string) => <th className="th" title={tip}>{t}{tip && <span className="ml-1 cursor-help text-slate-400" aria-hidden>ⓘ</span>}</th>
  return (
    <>
      <Crumbs items={[{ label: 'Reels' }]} />
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Reels</h1>
      <Card title="ER и просмотры: поиск аномалий" className="mb-6">
        <Chart h={300} option={{
          legend: false, tooltip: { trigger: 'item', formatter: (p: any) => `<b>${p.data[2]}</b><br/>Просмотры: ${fmt(p.data[0])}<br/>ER: ${pct(p.data[1], 2)}` },
          xAxis: { type: 'log', name: 'Просмотры', axisLabel: { formatter: fmt } }, yAxis: { type: 'value', name: 'ER', axisLabel: { formatter: (v: number) => pct(v, 0) } }, dataZoom: [{ type: 'inside' }],
          series: [{ type: 'scatter', symbolSize: 10, data: list.map(r => [r.views, rates(r).er, r.caption]), itemStyle: { opacity: 0.75 } }],
        }} />
      </Card>
      <Card title={`Все Reels (${list.length})`} action={<Seg value={sort} onChange={setSort} options={[['views', 'Просмотры'], ['er', 'ER'], ['date', 'Дата']]} />}>
        {!list.length ? <Empty /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead><tr className="border-b border-slate-200 dark:border-slate-800">
                {th('Reel')}{th('Бренд')}{th('Просмотры')}{th('Лайки')}{th('Комм.')}{th('Шеры')}{th('Сохр.')}
                {th('ER', FORMULAS.er)}{th('Share', FORMULAS.share)}{th('Save', FORMULAS.save)}{th('Comment', FORMULAS.comment)}{th('Удерж., с')}{th('К медиане бренда', 'Просмотры / медиана просмотров бренда; percentile внутри бренда')}
              </tr></thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {list.map(r => {
                  const k = rates(r), x = r.views / med(r.brandId), b = brand(r.brandId)
                  return (
                    <tr key={r.id} className="transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="td"><div className="flex min-w-[220px] items-start gap-3">
                        <a href={r.url} target="_blank" rel="noreferrer" aria-label="Открыть Reel" className="relative"><Thumb hue={r.hue} className="h-14 w-10" /><Play className="absolute left-3 top-5 h-4 w-4 text-white" aria-hidden /></a>
                        <div className="min-w-0"><div className="flex items-center gap-1 font-medium">{r.caption}<ExternalLink className="h-3 w-3 text-slate-400" aria-hidden /></div>
                          <div className="text-xs text-slate-500">{dmy(r.date)}</div>
                          <div className="mt-1 flex flex-wrap gap-1">{r.tags.map(t => <Tag key={t}>{t}</Tag>)}{r.note && <Tag tone="amber">{r.note}</Tag>}</div></div></div></td>
                      <td className="td"><Link to={`/brands/${b.id}`} className="hover:text-indigo-600">{b.name}</Link>{b.excluded && <div><Tag>исключён</Tag></div>}</td>
                      <td className="td">{fmt(r.views)}</td><td className="td">{fmt(r.likes)}</td><td className="td">{fmt(r.comments)}</td><td className="td">{fmt(r.shares)}</td><td className="td">{fmt(r.saves)}</td>
                      <td className="td font-medium" title={FORMULAS.er}>{pct(k.er, 2)}</td><td className="td" title={FORMULAS.share}>{pct(k.share, 2)}</td>
                      <td className="td" title={FORMULAS.save}>{pct(k.save, 2)}</td><td className="td" title={FORMULAS.comment}>{pct(k.comment, 2)}</td><td className="td">{r.avgWatchSec}</td>
                      <td className="td"><Tag tone={x >= 2 ? 'green' : x < 0.7 ? 'red' : 'slate'}>{x >= 1 ? `в ${x.toFixed(1).replace('.', ',')} раза выше` : `в ${(1 / x).toFixed(1).replace('.', ',')} раза ниже`}</Tag>
                        <div className="mt-1 text-xs text-slate-500">медиана {fmt(med(r.brandId))} · p{pctile(r)}</div></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}
