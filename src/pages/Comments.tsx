import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Tag, Crumbs, PageSkeleton, ErrorState, Chart, Empty, Seg, statusTone } from '../components/ui'
import { useData } from '../hooks/useData'
import { useFilters } from '../hooks/useFilters'
import { dmy } from '../utils/format'

export default function Comments() {
  const { data, isLoading, isError, refetch } = useData()
  const { q } = useFilters()
  const [who, setWho] = useState<'all' | 'analyst' | 'user'>('all')
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (isLoading || !data) return <PageSkeleton />
  const brand = (id: string) => data.brands.find(b => b.id === id)!
  const list = data.comments.filter(c => (who === 'all' || c.author === who) && (c.text + brand(c.brandId).name).toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.date.localeCompare(a.date))
  const users = data.comments.filter(c => c.author === 'user')
  const topics = Array.from(new Set(users.map(c => c.topic)))
  const sent = ['позитив', 'нейтрал', 'негатив'] as const
  return (
    <>
      <Crumbs items={[{ label: 'Комментарии и наблюдения' }]} />
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Комментарии и наблюдения</h1>
      <Card title="Темы комментариев и тональность" className="mb-6">
        <Chart option={{
          xAxis: { type: 'category', data: topics }, yAxis: { type: 'value', minInterval: 1, name: 'Комментариев' }, color: ['#10b981', '#94a3b8', '#f43f5e'],
          series: sent.map(s => ({ name: s, type: 'bar', stack: 'a', data: topics.map(t => users.filter(c => c.topic === t && c.sentiment === s).length) })),
        }} />
      </Card>
      <Card title={`Записи (${list.length})`} action={<Seg value={who} onChange={setWho} options={[['all', 'Все'], ['analyst', 'Аналитик'], ['user', 'Аудитория']]} />}>
        {!list.length ? <Empty /> : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {list.map(c => (
              <li key={c.id} className="flex flex-wrap items-start justify-between gap-2 py-3">
                <div className="min-w-0 flex-1"><p className="text-sm">{c.text}</p>
                  <div className="mt-1 text-xs text-slate-500"><Link to={`/brands/${c.brandId}`} className="hover:text-indigo-600">{brand(c.brandId).name}</Link> · {dmy(c.date)} · {c.author === 'analyst' ? 'аналитик' : 'пользователь'}</div></div>
                <div className="flex gap-1"><Tag tone="indigo">{c.topic}</Tag>{c.author === 'user' && <Tag tone={statusTone(c.sentiment)}>{c.sentiment}</Tag>}</div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
