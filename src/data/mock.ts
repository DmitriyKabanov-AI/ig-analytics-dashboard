import type { Brand, Reel, Trend, Comment, Data, TrendType, TrendStatus, Sentiment } from '../types'
import { median } from '../utils/format'

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const r = rng(2026)
const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)]
const BASE = new Date('2026-11-09').getTime(), DAY = 864e5
const iso = (daysAgo: number) => new Date(BASE - daysAgo * DAY).toISOString().slice(0, 10)
const wk = (i: number) => { const d = new Date(BASE - (25 - i) * 7 * DAY); return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}` }

const NAMES: [string, string, boolean][] = [
  ['Сладкий Дом', 'sladkiy.dom', false], ['Кофейня Зерно', 'zerno.coffee', false], ['Пельмень Про', 'pelmen.pro', false],
  ['FitLab', 'fitlab.ru', false], ['Мяу Корм', 'myau.korm', false], ['Дом Света', 'dom.sveta', true],
  ['Ягода', 'yagoda.drinks', false], ['Тёплый Хлеб', 'teply.hleb', false], ['Сок&Co', 'sok.and.co', false],
  ['Бургерная №1', 'burger.one', true], ['Лавка Чая', 'lavka.chaya', false], ['VeloCity', 'velocity.bike', false],
]
const TOV: Record<string, string[]> = {
  ироничный: ['«Мы не говорим, что это лучший кофе. Просто другого вы уже не захотите»', '«Диета начинается в понедельник. Какого месяца — не уточняем»', '«Да, это снова мы. Нет, мы не извиняемся»'],
  дружелюбный: ['«Заходите, мы вам рады — серьёзно, даже без заказа»', '«Спасибо, что вы с нами. Это правда много значит»', '«Пишите в директ, поможем подобрать»'],
  экспертный: ['«Разбираем состав: что на самом деле значат E-добавки»', '«3 признака того, что тесто подошло»', '«Сравнили 5 методов заварки по вкусу и стоимости»'],
  мемный: ['«Когда на кассе спрашивают “а сахар?”»', '«POV: ты открыл холодильник в 3 ночи»', '«Тот самый момент, когда скидка закончилась вчера»'],
  минималистичный: ['«Просто хлеб. Просто хорошо.»', '«Свет. Форма. Тишина.»', '«Меньше — значит лучше»'],
}
const FM = ['Reels', 'Фото', 'Карусели', 'Сторис']
const CAP = ['Сахара нет, а где?', 'Утро начинается не с кофе', 'Как мы это придумали', 'Один день за кулисами', 'Сравнили цены: удивились сами', 'Бабушкин рецепт, но быстрее', 'Не по плану, зато вкусно', 'POV: пятница, 18:00', 'Новинка, которую вы просили', 'Ответ на ваш комментарий']
const RTAGS = ['мем', 'тренд', 'сахара нет, а где', 'без надписей', 'перл']
const RNOTES = ['залетел', 'колоритно', 'не про бренд, но выигрышно']
const ANNO = ['Стабильный контент, сильная вовлечённость в Reels. Лучшие результаты — на самоиронии.', 'Растущий аккаунт: подписчики прибавляют, но охваты нестабильны. Нужен регулярный формат.', 'Редкие, но точные публикации. Высокий ER при скромной аудитории.', 'Много мемов и трендов, TOV местами теряется. Следить за соответствием бренду.']

const reels: Reel[] = []
const brands: Brand[] = NAMES.map(([name, handle, excluded], bi) => {
  const id = `b${bi + 1}`, f0 = 20000 + r() * 380000, g = 0.05 + r() * 0.35, vb = f0 * (0.15 + r() * 0.5)
  const series = Array.from({ length: 26 }, (_, i) => {
    const spike = i === 25 && r() < 0.4 ? 2.4 : i === 25 && r() < 0.3 ? 0.4 : 1
    return { week: wk(i), followers: Math.round(f0 * (1 + (g * i) / 26 + (r() - 0.5) * 0.01)), views: Math.round(vb * (0.7 + r() * 0.6) * spike), er: 0.025 + r() * 0.04 + (r() - 0.5) * 0.01 }
  })
  for (let k = 0; k < 8; k++) {
    const v = Math.round(vb * (0.25 + r() * 0.7) * (r() < 0.15 ? 4 + r() * 4 : 1)), q = () => 0.015 + r() * 0.05
    reels.push({
      id: `r${reels.length + 1}`, brandId: id, date: iso(Math.floor(r() * 60)), caption: pick(CAP), url: `https://instagram.com/${handle}`, hue: Math.floor(r() * 360),
      views: v, likes: Math.round(v * q() * 1.6), comments: Math.round(v * q() * 0.12), shares: Math.round(v * q() * 0.3), saves: Math.round(v * q() * 0.4),
      avgWatchSec: +(4 + r() * 14).toFixed(1), tags: Array.from(new Set([pick(RTAGS), pick(RTAGS)])), note: r() < 0.35 ? pick(RNOTES) : undefined,
    })
  }
  const tags = Object.keys(TOV).sort(() => r() - 0.5).slice(0, 3)
  const fm = FM.map(() => 0.1 + r()), s = fm.reduce((a, b) => a + b, 0)
  const ages = [0.04, 0.3, 0.38, 0.18, 0.1].map(x => x * (0.8 + r() * 0.4)), as = ages.reduce((a, b) => a + b, 0), m = 0.25 + r() * 0.4
  return {
    id, name, handle, url: `https://instagram.com/${handle}`, updatedAt: iso(Math.floor(r() * 4)), excluded, hue: Math.floor(r() * 360),
    followers: series[25].followers, er: series.slice(-8).reduce((a, p) => a + p.er, 0) / 8, medianViews: 0, postsPerWeek: +(2 + r() * 6).toFixed(1),
    note: ANNO[bi % ANNO.length], series,
    audience: {
      age: ['13–17', '18–24', '25–34', '35–44', '45+'].map((label, i) => ({ label, v: ages[i] / as })), male: m, female: 1 - m,
      geo: ([['Москва', 0.32], ['Санкт-Петербург', 0.18], ['Екатеринбург', 0.08], ['Казань', 0.07], ['Другие', 0.35]] as [string, number][]).map(([label, v]) => ({ label, v })),
      source: 'по данным платформы на 10.11',
    },
    tov: tags.map(tag => ({ tag, confidence: +(0.55 + r() * 0.4).toFixed(2), quotes: TOV[tag] })),
    formats: FM.map((n, i) => ({ name: n, value: +((fm[i] / s) * 100).toFixed(1) })),
    heat: Array.from({ length: 7 }, (_, d) => Array.from({ length: 24 }, (_, h) => Math.round(Math.max(0, 10 * Math.exp(-((h - (d > 4 ? 12 : 19)) ** 2) / 20) * (0.5 + r()) + r() * 2)))),
  }
})
brands.forEach(b => (b.medianViews = Math.round(median(reels.filter(x => x.brandId === b.id).map(x => x.views)))))

const TR: [string, TrendType][] = [['«Сахара нет, а где?»', 'фраза'], ['Звук «Опа, привет»', 'звук'], ['Формат «Сравни цены»', 'формат'], ['Мем «Кот в пиджаке»', 'визуальный мем'], ['Фраза «Не по плану»', 'фраза'], ['Звук «Лето 2.0»', 'звук'], ['Формат «Один день из жизни»', 'формат'], ['Мем «Бабушкин рецепт»', 'визуальный мем']]
const ST: TrendStatus[] = ['растёт', 'растёт', 'плато', 'сдувается', 'растёт', 'плато', 'растёт', 'сдувается']
const trends: Trend[] = TR.map(([name, type], i) => {
  const status = ST[i], base = 0.03 + r() * 0.02
  return {
    id: `t${i + 1}`, name, type, status, reelIds: Array.from({ length: 3 }, () => pick(reels).id), volume: Math.round(40 + r() * 400),
    growth: status === 'растёт' ? 0.3 + r() * 1.5 : status === 'плато' ? r() * 0.1 : -(0.1 + r() * 0.4),
    er: base * (0.8 + r() * 1.6), baselineEr: base, fit: Math.round(30 + r() * 70), risk: Math.round(10 + r() * 80), firstSeen: iso(10 + Math.floor(r() * 80)),
  }
})

const CT: Record<string, [string[], Sentiment]> = {
  'просят рецепт': [['Дайте рецепт, пожалуйста!', 'А состав можно?', 'Рецепт в закрепе?'], 'нейтрал'],
  'шутят про сахар': [['Сахара нет, а где?)', 'Сахар где-то в соседнем ролике', 'Сладкий контент без сладкого'], 'позитив'],
  'не поняли': [['Я не поняла, к чему это', 'Что тут происходит?', 'Это реклама?'], 'негатив'],
  хвалят: [['Лучший контент!', 'Обожаю ваши ролики', 'Спасибо, улыбнуло'], 'позитив'],
}
const AN = ['Аудитория реагирует на самоиронию — стоит повторить.', 'Риск: тема быстро приедается.', 'Reels «залетел» из-за формата, не из-за продукта.', 'TOV просел: слишком много мемов подряд.']
const comments: Comment[] = Array.from({ length: 48 }, (_, i) => {
  const an = r() < 0.22, topic = pick(Object.keys(CT)), rl = pick(reels)
  return {
    id: `c${i + 1}`, brandId: rl.brandId, reelId: r() < 0.7 ? rl.id : undefined, author: an ? 'analyst' : 'user', date: iso(Math.floor(r() * 30)),
    text: an ? pick(AN) : pick(CT[topic][0]), topic: an ? 'наблюдение' : topic, sentiment: an ? 'нейтрал' : r() < 0.85 ? CT[topic][1] : pick(['позитив', 'нейтрал', 'негатив'] as Sentiment[]),
  }
})
export const DATA: Data = { brands, reels, trends, comments }
