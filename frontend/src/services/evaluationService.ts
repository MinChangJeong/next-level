import apiClient from './api'

export interface EvaluationPayload {
  scoreFirst: number
  scoreBest: number
  scoreDiff: number
  scoreNo1: number
  scoreGap: number
  scoreGlobal: number
}

export interface Review {
  reviewId: number
  boothId: string
  boothName: string
  content: string
  createdAt: string
}

export const evaluationService = {
  submit: async (boothId: string, payload: EvaluationPayload): Promise<void> => {
    await apiClient.post(`/evaluations/${boothId}`, payload)
  },

  submitReview: async (boothId: string, content: string): Promise<Review> => {
    const res = await apiClient.post(`/reviews/${boothId}`, { content })
    return res.data.data
  },

  getMyReviews: async (): Promise<Review[]> => {
    const res = await apiClient.get('/reviews/my')
    return res.data.data
  },
}
