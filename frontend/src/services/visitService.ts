import apiClient from './api'

export interface QrData {
  qrToken: string
  employeeId: string
  expiresAt: number
}

export interface VisitRecord {
  visitId: number
  boothId: string
  boothName: string
  pointsEarned: number
  visitedAt: string
}

export const visitService = {
  getMyQr: async (): Promise<QrData> => {
    const res = await apiClient.get('/qr/my')
    return res.data.data
  },

  scan: async (qrToken: string, boothId: string): Promise<VisitRecord> => {
    const res = await apiClient.post('/visits/scan', { qrToken, boothId })
    return res.data.data
  },

  getMyVisits: async (): Promise<VisitRecord[]> => {
    const res = await apiClient.get('/visits/my')
    return res.data.data
  },

  getLatestVisit: async (): Promise<VisitRecord | null> => {
    const res = await apiClient.get('/visits/my/latest')
    return res.data.data
  },
}
