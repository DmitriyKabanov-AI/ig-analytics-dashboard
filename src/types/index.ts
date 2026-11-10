export interface Point { week: string; followers: number; views: number; er: number }
export interface TovTag { tag: string; confidence: number; quotes: string[] }
export interface Brand {
  id: string; name: string; handle: string; url: string; updatedAt: string; excluded: boolean; hue: number
  followers: number; er: number; medianViews: number; postsPerWeek: number; note: string
  audience: { age: { label: string; v: number }[]; male: number; female: number; geo: { label: string; v: number }[]; source: string }
  tov: TovTag[]; formats: { name: string; value: number }[]; series: Point[]; heat: number[][]
}
export interface Reel {
  id: string; brandId: string; date: string; caption: string; url: string; hue: number
  views: number; likes: number; comments: number; shares: number; saves: number; avgWatchSec: number
  tags: string[]; note?: string
}
export type TrendType = 'фраза' | 'звук' | 'формат' | 'визуальный мем'
export type TrendStatus = 'растёт' | 'плато' | 'сдувается'
export interface Trend {
  id: string; name: string; type: TrendType; reelIds: string[]; volume: number; growth: number
  er: number; baselineEr: number; fit: number; risk: number; firstSeen: string; status: TrendStatus
}
export type Sentiment = 'позитив' | 'нейтрал' | 'негатив'
export interface Comment {
  id: string; brandId: string; reelId?: string; author: 'analyst' | 'user'; text: string
  sentiment: Sentiment; topic: string; date: string
}
export interface Data { brands: Brand[]; reels: Reel[]; trends: Trend[]; comments: Comment[] }
