# Brand Analytics — Instagram showcase dashboard

React 18 · TypeScript · Vite · Tailwind · ECharts (echarts-for-react) · TanStack Query · React Router · lucide-react

## Запуск
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production-сборка в dist/
npm run typecheck  # проверка типов
```
Нужен Node.js 18+.

## Данные
Демо-данные детерминированно генерируются в `src/data/mock.ts` (seed фиксирован, 12 брендов, 2 исключены, 26 недель динамики, Reels, тренды, комментарии).
Чтобы подключить реальный API — замените функцию в `src/hooks/useData.ts`.

## Структура
`components/` UI-кит и графики · `pages/` 6 экранов · `hooks/` данные, фильтры, тема · `utils/` форматтеры и метрики · `types/` типы
