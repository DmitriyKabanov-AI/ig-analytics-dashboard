import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { Card, Metric, Badge, Crumbs, PageSkeleton, ErrorState, Avatar, Empty } from '../components/ui'
import { useData } from '../hooks/useData'
import { useFilters } from '../hooks/useFilters'
import { fmt, pct, dmy } from '../utils/format'

export default function Brands() {
  const { data, isLoading, isError, refetch } = useData()
  const { q, showExcluded } = useFilters()
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (isLoading || !data) return <PageSkeleton />
  const list = data.brands.filter(b => (showExcluded || !b.excluded) && (b.name + b.handle).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <Crumbs items={[{ label: 'Бренды' }]} />
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Бренды</h1>
      {!list.length ? <Empty /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map(b => (
            <Card key={b.id} className={`group relative transition-shadow duration-150 hover:border-indigo-300 dark:hover:border-indigo-700 ${b.excluded ? 'opacity-70' : ''}`}>
              <div className="flex items-start gap-3">
                <Avatar name={b.name} hue={b.hue} />
                <div className="min-w-0 flex-1">
                  <Link to={`/brands/${b.id}`} className="block truncate font-semibold after:absolute after:inset-0 after:rounded-xl">{b.name}</Link>
                  <a href={b.url} target="_blank" rel="noreferrer" className="relative z-[1] inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600">@{b.handle}<ExternalLink className="h-3 w-3" aria-hidden /></a>
                </div>
                {b.excluded ? <Badge>исключён</Badge> : <Badge tone="green">активен</Badge>}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Metric label="Подписчики" value={fmt(b.followers)} /><Metric label="Средний ER" value={pct(b.er, 2)} />
                <Metric label="Медианные просмотры" value={fmt(b.medianViews)} /><Metric label="Постов в неделю" value={String(b.postsPerWeek).replace('.', ',')} />
              </div>
              <p className="mt-4 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{b.note}</p>
              <div className="mt-3 text-xs text-slate-400">Обновлено {dmy(b.updatedAt)}</div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
