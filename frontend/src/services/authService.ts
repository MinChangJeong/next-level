import apiClient from './api'

export interface LoginResponse {
  token: string
  employeeId: string
  name: string
  totalPoints: number
  missionsCompleted: number
  role: string
}

export const authService = {
  login: async (employeeId: string, name: string): Promise<LoginResponse> => {
    const res = await apiClient.post('/auth/login', { employeeId, name })
    return res.data.data
  },

  getMe: async () => {
    const res = await apiClient.get('/users/me')
    return res.data.data
  },
}
