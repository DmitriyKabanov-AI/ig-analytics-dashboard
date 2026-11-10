import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import ReactECharts from 'echarts-for-react'
import { ChevronRight, Inbox, AlertTriangle, RotateCw } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { pct } from '../utils/format'

export const Card = ({ title, action, children, className = '' }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) => (
  <section className={`rounded-xl border border-slate-200 bg-white p-5 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 ${className}`}>
    {(title || action) && (
      <header className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        {action}
      </header>
    )}
    {children}
  </section>
)
export const Metric = ({ label, value, hint, title }: { label: string; value: ReactNode; hint?: ReactNode; title?: string }) => (
  <div title={title}>
    <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
    <div className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
    {hint && <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{hint}</div>}
  </div>
)
const TONES = {
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  red: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  amber: 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
}
export const Tag = ({ children, tone = 'slate' }: { children: ReactNode; tone?: keyof typeof TONES }) => (
  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${TONES[tone]}`}>{children}</span>
)
export const Badge = Tag
export const statusTone = (s: string) => (s === 'растёт' || s === 'позитив' ? 'green' : s === 'сдувается' || s === 'негатив' ? 'red' : 'amber') as keyof typeof TONES
export const Skeleton = ({ className = '' }: { className?: string }) => <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />
export const PageSkeleton = () => (
  <div className="space-y-4" aria-busy="true" aria-label="Загрузка">
    <Skeleton className="h-6 w-64" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
    <div className="grid gap-4 lg:grid-cols-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-72" />)}</div>
  </div>
)
export const Empty = ({ text = 'Нет данных по этому фильтру' }: { text?: string }) => (
  <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
    <Inbox className="h-8 w-8" aria-hidden /> {text}
  </div>
)
export const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div role="alert" className="mx-auto mt-16 flex max-w-sm flex-col items-center gap-3 text-center">
    <AlertTriangle className="h-8 w-8 text-rose-500" aria-hidden />
    <p className="text-sm">Не удалось загрузить данные. Проверьте соединение и повторите попытку.</p>
    <button onClick={onRetry} className="btn"><RotateCw className="h-4 w-4" /> Повторить</button>
  </div>
)
export const Crumbs = ({ items }: { items: { label: string; to?: string }[] }) => (
  <nav aria-label="Хлебные крошки" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
    <Link to="/" className="rounded hover:text-indigo-600 dark:hover:text-indigo-400">Главная</Link>
    {items.map((it, i) => (
      <span key={i} className="flex items-center gap-1">
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        {it.to ? <Link to={it.to} className="rounded hover:text-indigo-600 dark:hover:text-indigo-400">{it.label}</Link> : <span aria-current="page" className="text-slate-900 dark:text-slate-100">{it.label}</span>}
      </span>
    ))}
  </nav>
)
export function Seg<T extends string | number>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <div role="group" className="inline-flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
      {options.map(([v, l]) => (
        <button key={String(v)} aria-pressed={v === value} onClick={() => onChange(v)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150 ${v === value ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-300' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'}`}>{l}</button>
      ))}
    </div>
  )
}
export const Bar = ({ value, tone = 'indigo', label }: { value: number; tone?: 'indigo' | 'green' | 'red'; label?: string }) => (
  <div className="flex items-center gap-2" role="meter" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
      <div className={`h-full rounded-full transition-all duration-200 ${tone === 'green' ? 'bg-emerald-500' : tone === 'red' ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: pct(Math.min(1, value), 0) }} />
    </div>
    <span className="w-9 text-right text-xs tabular-nums text-slate-500 dark:text-slate-400">{pct(value, 0)}</span>
  </div>
)
export const Avatar = ({ name, hue, size = 40 }: { name: string; hue: number; size?: number }) => (
  <div aria-hidden className="grid shrink-0 place-items-center rounded-full font-semibold text-white" style={{ width: size, height: size, background: `hsl(${hue} 55% 48%)`, fontSize: size / 2.5 }}>{name[0]}</div>
)
export const Thumb = ({ hue, className = 'h-16 w-12' }: { hue: number; className?: string }) => (
  <div aria-hidden className={`${className} shrink-0 rounded-lg`} style={{ background: `linear-gradient(160deg, hsl(${hue} 60% 55%), hsl(${(hue + 60) % 360} 55% 35%))` }} />
)

/** Единая тема ECharts: цвета, оси, tooltip. Форматирование чисел передаётся через fmt/pct из utils. */
export function Chart({ option, h = 280 }: { option: any; h?: number }) {
  const { dark } = useTheme()
  const tx = dark ? '#94a3b8' : '#64748b', ln = dark ? '#1e293b' : '#e2e8f0'
  const ax = (a: any): any => (a ? (Array.isArray(a) ? a : [a]).map((x: any) => ({ ...x, axisLabel: { color: tx, ...x.axisLabel }, axisLine: { lineStyle: { color: ln } }, splitLine: { lineStyle: { color: ln }, ...x.splitLine }, nameTextStyle: { color: tx } })) : undefined)
  const o = {
    color: ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa'],
    textStyle: { fontFamily: 'Inter, system-ui, sans-serif', color: tx },
    grid: { left: 8, right: 12, top: 40, bottom: 8, containLabel: true },
    ...option,
    legend: option.legend === false ? undefined : { top: 0, textStyle: { color: tx }, ...option.legend },
    tooltip: { trigger: 'axis', backgroundColor: dark ? '#0f172a' : '#fff', borderColor: ln, textStyle: { color: dark ? '#e2e8f0' : '#0f172a', fontSize: 12 }, ...option.tooltip },
    xAxis: ax(option.xAxis), yAxis: ax(option.yAxis),
  }
  return <ReactECharts option={o} notMerge style={{ height: h }} opts={{ renderer: 'canvas' }} />
}
