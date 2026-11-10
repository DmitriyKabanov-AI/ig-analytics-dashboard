import { createContext, useContext, useState, ReactNode } from 'react'
interface F { q: string; setQ: (s: string) => void; showExcluded: boolean; setShowExcluded: (b: boolean) => void }
const Ctx = createContext<F>({ q: '', setQ: () => {}, showExcluded: true, setShowExcluded: () => {} })
export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [q, setQ] = useState(''), [showExcluded, setShowExcluded] = useState(true)
  return <Ctx.Provider value={{ q, setQ, showExcluded, setShowExcluded }}>{children}</Ctx.Provider>
}
export const useFilters = () => useContext(Ctx)
