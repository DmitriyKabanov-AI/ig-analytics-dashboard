import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Building2, Clapperboard, Flame, MessageSquare, Search, Sun, Moon, PanelLeftClose, PanelLeftOpen, BarChart3 } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useFilters } from '../hooks/useFilters'

const NAV = [
  { to: '/', label: 'Обзор', icon: LayoutDashboard }, { to: '/brands', label: 'Бренды', icon: Building2 },
  { to: '/reels', label: 'Reels', icon: Clapperboard }, { to: '/trends', label: 'Тренды', icon: Flame },
  { to: '/comments', label: 'Комментарии', icon: MessageSquare },
]
export function Layout() {
  const [open, setOpen] = useState(true)
  const { dark, toggle } = useTheme()
  const { q, setQ, showExcluded, setShowExcluded } = useFilters()
  const link = ({ isActive }: { isActive: boolean }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${isActive ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`
  return (
    <div className="flex min-h-screen">
      <aside className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-slate-200 bg-white p-3 transition-[width] duration-200 dark:border-slate-800 dark:bg-slate-900 md:flex ${open ? 'w-56' : 'w-16'}`}>
        <div className="mb-4 flex items-center gap-2 px-2 py-2 font-semibold"><BarChart3 className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden />{open && 'Brand Analytics'}</div>
        <nav aria-label="Основная навигация" className="space-y-1">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={link} title={n.label}>
              <n.icon className="h-4 w-4 shrink-0" aria-hidden />{open && n.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={() => setOpen(o => !o)} aria-label={open ? 'Свернуть меню' : 'Развернуть меню'} className="btn mt-auto self-start">
          {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </button>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 md:px-8">
          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Поиск по брендам и Reels" aria-label="Поиск" className="input w-full pl-9" />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <input type="checkbox" checked={showExcluded} onChange={e => setShowExcluded(e.target.checked)} className="h-4 w-4 accent-indigo-600" /> Исключённые
          </label>
          <button onClick={toggle} aria-label="Переключить тему" className="btn">{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
        </header>
        <main className="mx-auto max-w-[1400px] px-4 py-6 pb-24 md:px-8 md:pb-10"><Outlet /></main>
      </div>
      <nav aria-label="Мобильная навигация" className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900 md:hidden">
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'} aria-label={n.label} className={({ isActive }) => `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] ${isActive ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-500'}`}>
            <n.icon className="h-5 w-5" aria-hidden />{n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
