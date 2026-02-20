import apiClient from './api'

export interface Mission {
  missionId: string
  title: string
  description: string
  isUnlocked: boolean
  isCompleted: boolean
  progress: number
  target: number
  unlockedAt: string | null
  completedAt: string | null
}

export const missionService = {
  getAll: async (): Promise<Mission[]> => {
    const res = await apiClient.get('/missions')
    return res.data.data
  },

  complete: async (missionId: string): Promise<void> => {
    await apiClient.post(`/missions/${missionId}/complete`)
  },
}
