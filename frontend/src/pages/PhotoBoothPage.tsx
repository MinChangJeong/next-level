import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/common/Toast'
import Button from '../components/common/Button'
import { BackButton, PageHeader, PageTitle } from '../components/common/Card'
import apiClient from '../services/api'

export default function PhotoBoothPage() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const { showToast } = useToast()

  const handleEnter = async (type: 'photo' | 'ai') => {
    if ((user?.totalPoints ?? 0) < 10) {
      showToast('포인트가 부족합니다. (필요: 10p)', 'error')
      return
    }
    try {
      const res = await apiClient.post('/points/deduct', { amount: 10 })
      if (user) {
        updateUser({ ...user, totalPoints: res.data.data.totalPoints })
      }
      showToast(
        type === 'photo' ? '📸 포토부스에 입장했습니다!' : '🤖 AI 포토부스에 입장했습니다!',
        'success'
      )
    } catch (err: any) {
      showToast(err.response?.data?.message ?? '오류가 발생했습니다.', 'error')
    }
  }

  return (
    <Page>
      <PageHeader>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
        <PageTitle>포토부스</PageTitle>
      </PageHeader>

      <Content>
        <PointDisplay>현재 포인트: <strong>{user?.totalPoints ?? 0}p</strong></PointDisplay>

        <BoothCard>
          <BoothEmoji>📸</BoothEmoji>
          <BoothName>포토부스</BoothName>
          <BoothDesc>오늘의 추억을 사진으로 남겨보세요.</BoothDesc>
          <BoothCost>10 포인트</BoothCost>
          <Button fullWidth onClick={() => handleEnter('photo')}>
            입장하기 (-10p)
          </Button>
        </BoothCard>

        <BoothCard>
          <BoothEmoji>🤖</BoothEmoji>
          <BoothName>AI 포토부스 (올네)</BoothName>
          <BoothDesc>AI로 특별한 사진을 만들어보세요.</BoothDesc>
          <BoothCost>10 포인트</BoothCost>
          <Button fullWidth onClick={() => handleEnter('ai')}>
            입장하기 (-10p)
          </Button>
        </BoothCard>
      </Content>
    </Page>
  )
}

const Page = styled.div`
  min-height: 100dvh;
  max-width: 430px;
  margin: 0 auto;
  background: #F5F6F8;
`

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const PointDisplay = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`

const BoothCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`

const BoothEmoji = styled.span`
  font-size: 56px;
`

const BoothName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`

const BoothDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`

const BoothCost = styled.span`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 20px;
`
