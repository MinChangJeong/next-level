import apiClient from './api'

export interface GachaResult {
  attemptId: number
  attemptNumber: number
  goodsId: string
  goodsName: string
  goodsImageUrl: string | null
  pointsSpent: number
  remainingPoints: number
}

export interface GoodsStock {
  goodsId: string
  name: string
  imageUrl: string | null
  totalStock: number
  remainingStock: number
  unitPrice: number
}

export const gachaService = {
  attempt: async (): Promise<GachaResult> => {
    const res = await apiClient.post('/gacha/attempt')
    return res.data.data
  },

  getHistory: async (): Promise<GachaResult[]> => {
    const res = await apiClient.get('/gacha/history')
    return res.data.data
  },

  getStock: async (): Promise<GoodsStock[]> => {
    const res = await apiClient.get('/gacha/stock')
    return res.data.data
  },
}
