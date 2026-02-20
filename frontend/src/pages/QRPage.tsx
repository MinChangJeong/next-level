import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { QRCodeSVG } from 'qrcode.react'
import { visitService } from '../services/visitService'
import { useAuth } from '../contexts/AuthContext'
import BottomNav from '../components/common/BottomNav'

export default function QRPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [qrToken, setQrToken] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(600)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastVisitTime = useRef<number>(Date.now())

  const fetchQr = async () => {
    setLoading(true)
    try {
      const data = await visitService.getMyQr()
      setQrToken(data.qrToken)
      setExpiresAt(data.expiresAt)
      lastVisitTime.current = Date.now()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQr()
  }, [])

  // 카운트다운
  useEffect(() => {
    if (!expiresAt) return
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
      setTimeLeft(remaining)
      if (remaining === 0) {
        fetchQr() // 만료 시 재발급
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [expiresAt])

  // 폴링: 방문 감지 시 평가 페이지로 이동
  useEffect(() => {
    pollRef.current = setInterval(async () => {
      try {
        const latest = await visitService.getLatestVisit()
        if (latest && new Date(latest.visitedAt).getTime() > lastVisitTime.current) {
          clearInterval(pollRef.current!)
          navigate(`/evaluate/${latest.boothId}`)
        }
      } catch {}
    }, 2000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [navigate])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <Page>
      <Header>
        <Title>내 QR 코드</Title>
        <SubTitle>부스 운영자에게 QR을 보여주세요</SubTitle>
      </Header>

      <QrArea>
        {loading ? (
          <LoadingSpinner />
        ) : qrToken ? (
          <>
            <QrBox>
              <QRCodeSVG
                value={qrToken}
                size={220}
                level="M"
                includeMargin
              />
            </QrBox>
            <UserInfo>
              <UserName>{user?.name}</UserName>
              <UserId>{user?.employeeId}</UserId>
            </UserInfo>
            <Timer>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} 후 갱신
            </Timer>
          </>
        ) : (
          <ErrorText>QR을 불러올 수 없습니다</ErrorText>
        )}
      </QrArea>

      <HintCard>
        <HintText>📡 스캔을 기다리는 중...</HintText>
        <HintDesc>부스 운영자가 QR을 스캔하면 자동으로 평가 페이지로 이동합니다</HintDesc>
      </HintCard>

      <BottomNav />
    </Page>
  )
}

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(79, 70, 229, 0); }
`

const Page = styled.div`
  min-height: 100dvh;
  max-width: 430px;
  margin: 0 auto;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
`

const Header = styled.div`
  padding: 24px 24px 16px;
  text-align: center;
`

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`

const SubTitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const QrArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 16px;
`

const QrBox = styled.div`
  padding: 16px;
  border-radius: 20px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  animation: ${pulse} 2s ease infinite;
`

const UserInfo = styled.div`
  text-align: center;
`

const UserName = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`

const UserId = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const Timer = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-variant-numeric: tabular-nums;
`

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid #F2F4F6;
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
`

const HintCard = styled.div`
  margin: 0 24px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 14px;
  padding: 16px;
  text-align: center;
`

const HintText = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`

const HintDesc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
`
