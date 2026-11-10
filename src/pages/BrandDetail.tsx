import { useParams } from 'react-router-dom'
import { ExternalLink, ArrowDown, ArrowUp } from 'lucide-react'
import { Card, Metric, Badge, Tag, Bar, Crumbs, PageSkeleton, ErrorState, Avatar, Thumb, Chart, Empty } from '../components/ui'
import { Dynamics } from '../components/Dynamics'
import { useBrandData } from '../hooks/useData'
import { fmt, pct, dmy, rates } from '../utils/format'

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
export default function BrandDetail() {
  const { id } = useParams()
  const { brand: b, reels, comments, isLoading, isError, refetch } = useBrandData(id)
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (isLoading) return <PageSkeleton />
  if (!b) return <Empty text="Бренд не найден" />
  const sorted = [...reels].sort((x, y) => rates(y).er - rates(x).er), best = sorted.slice(0, 2), worst = sorted.slice(-2).reverse()
  const heat = b.heat.flatMap((row, d) => row.map((v, h) => [h, d, v]))
  const analyst = comments.filter(c => c.author === 'analyst')
  const PostRow = ({ r, up }: { r: typeof reels[0]; up: boolean }) => (
    <li className="flex items-center gap-3"><Thumb hue={r.hue} className="h-12 w-9" />
      <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{r.caption}</div><div className="text-xs text-slate-500">{fmt(r.views)} просмотров · ER {pct(rates(r).er, 2)}</div></div>
      {up ? <ArrowUp className="h-4 w-4 text-emerald-500" aria-label="лучший" /> : <ArrowDown className="h-4 w-4 text-rose-500" aria-label="худший" />}</li>
  )
  return (
    <>
      <Crumbs items={[{ label: 'Бренды', to: '/brands' }, { label: b.name }]} />
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={b.name} hue={b.hue} size={56} />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight">{b.name}</h1>
            <a href={b.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600">@{b.handle}<ExternalLink className="h-3 w-3" aria-hidden /></a>
          </div>
          <div className="text-right text-sm text-slate-500"><div>Обновлено {dmy(b.updatedAt)}</div>{b.excluded ? <Badge>исключён</Badge> : <Badge tone="green">активен</Badge>}</div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Целевая аудитория" className="lg:col-span-2" action={<span className="text-xs text-slate-400">{b.audience.source}</span>}>
          <div className="grid gap-4 md:grid-cols-3">
            <Chart h={220} option={{ legend: false, xAxis: { type: 'category', data: b.audience.age.map(a => a.label) }, yAxis: { type: 'value', axisLabel: { formatter: (v: number) => pct(v, 0) } }, tooltip: { valueFormatter: (v: number) => pct(v) }, series: [{ name: 'Возраст', type: 'bar', data: b.audience.age.map(a => a.v), itemStyle: { borderRadius: [4, 4, 0, 0] } }] }} />
            <Chart h={220} option={{ legend: { bottom: 0, top: 'auto' }, tooltip: { trigger: 'item', valueFormatter: (v: number) => pct(v, 0) }, series: [{ name: 'Пол', type: 'pie', radius: ['50%', '72%'], center: ['50%', '45%'], label: { show: false }, data: [{ name: 'Женщины', value: b.audience.female }, { name: 'Мужчины', value: b.audience.male }] }] }} />
            <ul className="space-y-3 pt-4">{b.audience.geo.map(g => <li key={g.label}><div className="mb-1 text-xs text-slate-500">{g.label}</div><Bar value={g.v} label={g.label} /></li>)}</ul>
          </div>
        </Card>
        <Card title="Контент">
          <div className="mb-2 grid grid-cols-2 gap-3"><Metric label="Средний ER" value={pct(b.er, 2)} /><Metric label="Медиана просмотров" value={fmt(b.medianViews)} /><Metric label="Постов в неделю" value={String(b.postsPerWeek).replace('.', ',')} /></div>
          <Chart h={200} option={{ legend: { bottom: 0, top: 'auto' }, tooltip: { trigger: 'item', valueFormatter: (v: number) => v + '%' }, series: [{ name: 'Форматы', type: 'pie', radius: ['48%', '70%'], center: ['50%', '42%'], label: { show: false }, data: b.formats }] }} />
        </Card>

        <Card title="Tone of voice" className="lg:col-span-3">
          <div className="grid gap-4 md:grid-cols-3">
            {b.tov.map(t => (
              <div key={t.tag} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <div className="mb-2 flex items-center justify-between"><Tag tone="indigo">{t.tag}</Tag><span className="text-xs text-slate-500">confidence</span></div>
                <Bar value={t.confidence} label={`Уверенность: ${t.tag}`} />
                <ul className="mt-3 space-y-2 text-sm italic text-slate-600 dark:text-slate-400">{t.quotes.map(q => <li key={q} className="border-l-2 border-indigo-300 pl-3 dark:border-indigo-700">{q}</li>)}</ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">TOV — модельная оценка, не истина в последней инстанции.</p>
        </Card>

        <Card title="Лучшие посты"><ul className="space-y-3">{best.map(r => <PostRow key={r.id} r={r} up />)}</ul></Card>
        <Card title="Худшие посты"><ul className="space-y-3">{worst.map(r => <PostRow key={r.id} r={r} up={false} />)}</ul></Card>
        <Card title="Комментарий аналитика">
          <p className="text-sm text-slate-700 dark:text-slate-300">{b.note}</p>
          {analyst.slice(0, 2).map(c => <p key={c.id} className="mt-3 border-l-2 border-slate-300 pl-3 text-sm text-slate-500 dark:border-slate-700">{c.text}</p>)}
        </Card>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Динамика</h2>
      <Dynamics series={b.series} />
      <Card title="Активность по дням и часам" className="mt-4">
        <Chart h={260} option={{
          legend: false, grid: { left: 8, right: 12, top: 10, bottom: 50, containLabel: true }, tooltip: { trigger: 'item', formatter: (p: any) => `${DAYS[p.value[1]]}, ${p.value[0]}:00 — активность ${p.value[2]}` },
          xAxis: { type: 'category', data: [...Array(24).keys()].map(h => h + ':00'), splitArea: { show: true } }, yAxis: { type: 'category', data: DAYS, inverse: true },
          visualMap: { min: 0, max: 12, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#e0e7ff', '#6366f1', '#312e81'] }, textStyle: { color: '#94a3b8' } },
          series: [{ name: 'Активность', type: 'heatmap', data: heat }],
        }} />
      </Card>
    </>
  )
}
