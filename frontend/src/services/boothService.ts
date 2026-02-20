import apiClient from './api'

export interface Booth {
  boothId: string
  name: string
  shortDescription: string
  imageUrl: string | null
  zone: string
  floor: string
  visitorCount: number
  visited: boolean
}

export interface BoothDetail extends Booth {
  longDescription: string
  onlyoneValue: string
  evaluated: boolean
}

export interface Comment {
  commentId: number
  authorName: string
  suggestion: string
  expectedEffect: string
  createdAt: string
}

export const boothService = {
  getAll: async (): Promise<Booth[]> => {
    const res = await apiClient.get('/booths')
    return res.data.data
  },

  getByZone: async (zoneId: string): Promise<Booth[]> => {
    const res = await apiClient.get(`/booths/zone/${zoneId}`)
    return res.data.data
  },

  getDetail: async (boothId: string): Promise<BoothDetail> => {
    const res = await apiClient.get(`/booths/${boothId}`)
    return res.data.data
  },

  getComments: async (boothId: string): Promise<Comment[]> => {
    const res = await apiClient.get(`/booths/${boothId}/comments`)
    return res.data.data
  },

  addComment: async (boothId: string, suggestion: string, expectedEffect: string): Promise<Comment> => {
    const res = await apiClient.post(`/booths/${boothId}/comments`, { suggestion, expectedEffect })
    return res.data.data
  },
}
