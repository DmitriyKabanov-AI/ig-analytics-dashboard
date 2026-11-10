import { Card, Tag, Bar, Crumbs, PageSkeleton, ErrorState, Chart, Empty, statusTone } from '../components/ui'
import { useData } from '../hooks/useData'
import { useFilters } from '../hooks/useFilters'
import { fmt, pct, dmy } from '../utils/format'

export default function Trends() {
  const { data, isLoading, isError, refetch } = useData()
  const { q } = useFilters()
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (isLoading || !data) return <PageSkeleton />
  const list = data.trends.filter(t => (t.name + t.type).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <Crumbs items={[{ label: 'Тренды и мемы' }]} />
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Тренды и мемы</h1>
      <Card title="ER тренда против обычного контента брендов" className="mb-6">
        <Chart option={{
          xAxis: { type: 'category', data: list.map(t => t.name), axisLabel: { interval: 0, width: 90, overflow: 'break' } }, yAxis: { type: 'value', axisLabel: { formatter: (v: number) => pct(v, 1) } },
          tooltip: { valueFormatter: (v: number) => pct(v, 2) },
          series: [{ name: 'ER примеров', type: 'bar', data: list.map(t => t.er), itemStyle: { borderRadius: [4, 4, 0, 0] } }, { name: 'Обычный ER бренда', type: 'bar', data: list.map(t => t.baselineEr), itemStyle: { borderRadius: [4, 4, 0, 0], opacity: 0.45 } }],
        }} />
      </Card>
      {!list.length ? <Empty /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map(t => {
            const ex = t.reelIds.map(id => data.reels.find(r => r.id === id)!).filter(Boolean), diff = t.er / t.baselineEr - 1
            return (
              <Card key={t.id}>
                <div className="mb-3 flex items-start justify-between gap-2"><div><h3 className="font-semibold">{t.name}</h3><div className="text-xs text-slate-500">{t.type} · с {dmy(t.firstSeen)}</div></div><Tag tone={statusTone(t.status)}>{t.status}</Tag></div>
                <dl className="mb-4 grid grid-cols-3 gap-2 text-sm">
                  <div><dt className="text-xs text-slate-500">Объём</dt><dd className="tabular-nums">{fmt(t.volume)}</dd></div>
                  <div><dt className="text-xs text-slate-500">Рост</dt><dd className="tabular-nums">{t.growth >= 0 ? '+' : ''}{pct(t.growth, 0)}</dd></div>
                  <div><dt className="text-xs text-slate-500">ER примеров</dt><dd className="tabular-nums">{pct(t.er, 2)}</dd></div>
                </dl>
                <p className="mb-4 text-xs text-slate-500">К обычному контенту бренда: <b className={diff >= 0 ? 'text-emerald-600' : 'text-rose-600'}>{diff >= 0 ? '+' : ''}{pct(diff, 0)}</b></p>
                <div className="space-y-2"><div><div className="mb-1 text-xs text-slate-500">Fit — подходит бренду</div><Bar value={t.fit / 100} tone="green" label="Fit" /></div>
                  <div><div className="mb-1 text-xs text-slate-500">Risk — репутационный риск</div><Bar value={t.risk / 100} tone="red" label="Risk" /></div></div>
                <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800"><div className="mb-1 text-xs text-slate-500">Примеры</div>
                  {ex.map(r => <div key={r.id} className="truncate text-sm">{r.caption} <span className="text-slate-400">· {data.brands.find(b => b.id === r.brandId)?.name}</span></div>)}</div>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}
