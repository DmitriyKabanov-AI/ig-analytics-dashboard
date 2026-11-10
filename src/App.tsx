import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import Overview from './pages/Overview'
import Brands from './pages/Brands'
import BrandDetail from './pages/BrandDetail'
import Reels from './pages/Reels'
import Trends from './pages/Trends'
import Comments from './pages/Comments'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="brands" element={<Brands />} />
        <Route path="brands/:id" element={<BrandDetail />} />
        <Route path="reels" element={<Reels />} />
        <Route path="trends" element={<Trends />} />
        <Route path="comments" element={<Comments />} />
        <Route path="*" element={<Overview />} />
      </Route>
    </Routes>
  )
}
