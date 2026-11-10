import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Metric, Tag, Badge, Seg, Crumbs, PageSkeleton, ErrorState, Avatar, Thumb, Empty, statusTone } from '../components/ui'
import { Dynamics } from '../components/Dynamics'
import { useData } from '../hooks/useData'
import { fmt, pct, growth, median } from '../utils/format'
import { useFilters } from '../hooks/useFilters'

export default function Overview() {
  const { data, isLoading, isError, refetch } = useData()
  const { showExcluded } = useFilters()
  const [sort, setSort] = useState<'reach' | 'er' | 'growth'>('reach')
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (isLoading || !data) return <PageSkeleton />
  const act = data.brands.filter(b => !b.excluded), exc = data.brands.filter(b => b.excluded)
  const ids = new Set(act.map(b => b.id))
  const agg = act[0].series.map((p, i) => ({
    week: p.week, followers: act.reduce((a, b) => a + b.series[i].followers, 0),
    views: act.reduce((a, b) => a + b.series[i].views, 0), er: act.reduce((a, b) => a + b.series[i].er, 0) / act.length,
  }))
  const val = { reach: (b: typeof act[0]) => b.medianViews, er: (b: typeof act[0]) => b.er, growth: (b: typeof act[0]) => growth(b) }[sort]
  const show = { reach: fmt, er: (v: number) => pct(v, 2), growth: (v: number) => '+' + pct(v) }[sort]
  const top = [...act].sort((a, b) => val(b) - val(a)).slice(0, 5)
  const weekAgo = new Date('2026-11-02').getTime()
  const best = data.reels.filter(r => ids.has(r.brandId) && new Date(r.date).getTime() >= weekAgo).sort((a, b) => b.views - a.views).slice(0, 4)
  const rising = data.trends.filter(t => t.status === 'растёт').sort((a, b) => b.growth - a.growth).slice(0, 4)
  const anomalies = act.map(b => ({ b, d: b.series[25].views / median(b.series.slice(0, 25).map(p => p.views)) - 1 })).filter(x => Math.abs(x.d) > 0.35).sort((a, b) => Math.abs(b.d) - Math.abs(a.d)).slice(0, 4)
  const kpi: [string, string, string?][] = [
    ['Аккаунтов', String(act.length), 'в аналитике'], ['Исключено', String(exc.length), 'вне агрегатов'], ['Суммарная аудитория', fmt(agg[25].followers)],
    ['Средний ER', pct(agg.slice(-8).reduce((a, p) => a + p.er, 0) / 8, 2), 'за 8 недель'], ['Просмотры', fmt(agg.slice(-12).reduce((a, p) => a + p.views, 0)), 'за 12 недель'],
  ]
  return (
    <>
      <Crumbs items={[{ label: 'Обзор' }]} />
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Обзор рынка</h1>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpi.map(([l, v, h]) => <Card key={l}><Metric label={l} value={v} hint={h} /></Card>)}
      </div>
      <div className="mb-6"><Dynamics series={agg} /></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card title="Топ брендов" action={<Seg value={sort} onChange={setSort} options={[['reach', 'Охват'], ['er', 'ER'], ['growth', 'Рост']]} />}>
          <ul className="space-y-3">
            {top.map(b => (
              <li key={b.id}><Link to={`/brands/${b.id}`} className="flex items-center gap-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                <Avatar name={b.name} hue={b.hue} size={32} /><span className="flex-1 truncate text-sm font-medium">{b.name}</span><span className="text-sm tabular-nums">{show(val(b))}</span>
              </Link></li>
            ))}
          </ul>
        </Card>
        <Card title="Лучшие Reels недели">
          {best.length ? <ul className="space-y-3">{best.map(r => (
            <li key={r.id} className="flex items-center gap-3"><Thumb hue={r.hue} className="h-12 w-9" />
              <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{r.caption}</div><div className="text-xs text-slate-500">{data.brands.find(b => b.id === r.brandId)?.name}</div></div>
              <span className="text-sm tabular-nums">{fmt(r.views)}</span></li>))}</ul> : <Empty />}
        </Card>
        <Card title="Растущие тренды">
          <ul className="space-y-3">{rising.map(t => (
            <li key={t.id} className="flex items-center justify-between gap-2"><span className="truncate text-sm font-medium">{t.name}</span><Tag tone="green">+{pct(t.growth, 0)}</Tag></li>))}</ul>
        </Card>
        <Card title="Бренды с аномальной динамикой" className="lg:col-span-2">
          {anomalies.length ? <ul className="grid gap-3 sm:grid-cols-2">{anomalies.map(({ b, d }) => (
            <li key={b.id}><Link to={`/brands/${b.id}`} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
              <span className="text-sm font-medium">{b.name}</span><Tag tone={d > 0 ? 'green' : 'red'}>{d > 0 ? '+' : ''}{pct(d, 0)} к медиане просмотров</Tag></Link></li>))}</ul> : <Empty text="Аномалий на этой неделе нет" />}
        </Card>
        {showExcluded && (
          <Card title="Исключённые аккаунты">
            <ul className="space-y-2">{exc.map(b => (
              <li key={b.id} className="flex items-center justify-between gap-2"><span className="text-sm text-slate-500">{b.name}</span><Badge>исключён</Badge></li>))}</ul>
          </Card>
        )}
      </div>
    </>
  )
}
