import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { ThemeProvider } from './hooks/useTheme'
import { FiltersProvider } from './hooks/useFilters'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <ThemeProvider><FiltersProvider><BrowserRouter><App /></BrowserRouter></FiltersProvider></ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
