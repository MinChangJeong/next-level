import apiClient from './api'

export const growthService = {
  complete: async (failureText: string, growthText: string, slowLetter: string): Promise<void> => {
    await apiClient.post('/growth-zone/complete', { failureText, growthText, slowLetter })
  },

  getStatus: async (): Promise<boolean> => {
    const res = await apiClient.get('/growth-zone/status')
    return res.data.data
  },
}
