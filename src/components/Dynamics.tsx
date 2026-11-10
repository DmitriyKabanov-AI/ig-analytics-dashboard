import { useState } from 'react'
import { Card, Chart, Seg, Empty } from './ui'
import { fmt, pct } from '../utils/format'
import type { Point } from '../types'

/** Динамика подписчиков / просмотров / ER с переключателем периода — общий блок для Overview и BrandDetail */
export function Dynamics({ series }: { series: Point[] }) {
  const [n, setN] = useState(12)
  const s = series.slice(-n), x = { type: 'category', data: s.map(p => p.week), boundaryGap: false }
  const zoom = [{ type: 'inside' }]
  const sw = <Seg value={n} onChange={setN} options={[[8, '8 нед.'], [12, '12 нед.'], [26, '26 нед.']]} />
  if (!s.length) return <Empty />
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Подписчики и просмотры по неделям" action={sw} className="lg:col-span-2">
        <Chart option={{
          xAxis: { ...x, boundaryGap: true }, dataZoom: zoom, tooltip: { valueFormatter: fmt },
          yAxis: [{ type: 'value', name: 'Подписчики', axisLabel: { formatter: fmt }, scale: true }, { type: 'value', name: 'Просмотры', axisLabel: { formatter: fmt }, splitLine: { show: false } }],
          series: [
            { name: 'Просмотры', type: 'bar', yAxisIndex: 1, data: s.map(p => p.views), barMaxWidth: 16, itemStyle: { opacity: 0.35, borderRadius: [3, 3, 0, 0] } },
            { name: 'Подписчики', type: 'line', smooth: true, showSymbol: false, data: s.map(p => p.followers), lineStyle: { width: 2.5 } },
          ],
        }} />
      </Card>
      <Card title="Средний ER по неделям" className="lg:col-span-2">
        <Chart h={220} option={{
          xAxis: x, dataZoom: zoom, legend: false, tooltip: { valueFormatter: (v: number) => pct(v, 2) },
          yAxis: { type: 'value', axisLabel: { formatter: (v: number) => pct(v, 1) }, scale: true },
          series: [{ name: 'ER', type: 'line', smooth: true, showSymbol: false, data: s.map(p => p.er), areaStyle: { opacity: 0.1 }, color: '#10b981' }],
        }} />
      </Card>
    </div>
  )
}
