import { useQuery } from '@tanstack/react-query'
import { DATA } from '../data/mock'
import type { Data } from '../types'

// Замените на fetch('/api/...') при подключении реального бэкенда
const load = () => new Promise<Data>(res => setTimeout(() => res(DATA), 450))
export const useData = () => useQuery({ queryKey: ['data'], queryFn: load, staleTime: Infinity })
export const useBrandData = (id?: string) => {
  const q = useData()
  const brand = q.data?.brands.find(b => b.id === id)
  return { ...q, brand, reels: q.data?.reels.filter(r => r.brandId === id) ?? [], comments: q.data?.comments.filter(c => c.brandId === id) ?? [] }
}
