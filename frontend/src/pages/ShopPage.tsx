import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { gachaService } from '../services/gachaService'
import type { GachaResult } from '../services/gachaService'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/common/Toast'
import Button from '../components/common/Button'
import BottomSheet from '../components/common/BottomSheet'
import BottomNav from '../components/common/BottomNav'
import { PageContainer } from '../components/common/Card'
import apiClient from '../services/api'

interface ShopItem {
  id: string
  name: string
  desc: string
  cost: number
  gradient: string
  emoji: string
  type: 'photo' | 'ai' | 'gacha'
}

const shopItems: ShopItem[] = [
  {
    id: 'photo',
    name: '포토부스',
    desc: '오늘의 추억을 사진으로 남겨보세요.',
    cost: 10,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    emoji: '📸',
    type: 'photo',
  },
  {
    id: 'ai',
    name: 'AI 포토부스 (올네)',
    desc: 'AI로 특별한 사진을 만들어보세요.',
    cost: 10,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    emoji: '🤖',
    type: 'ai',
  },
  {
    id: 'gacha',
    name: '가챠머신',
    desc: '랜덤 굿즈를 뽑아보세요! (인당 2회)',
    cost: 40,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    emoji: '🎰',
    type: 'gacha',
  },
]

export default function ShopPage() {
  const { user, updateUser } = useAuth()
  const { showToast } = useToast()
  const [, setGachaLoading] = useState(false)
  const [gachaResult, setGachaResult] = useState<GachaResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)

  const handlePhotoBooth = async (type: 'photo' | 'ai') => {
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

  const handleGacha = async () => {
    if ((user?.totalPoints ?? 0) < 40) {
      showToast('포인트가 부족합니다. (필요: 40p)', 'error')
      return
    }
    if (attemptCount >= 2) {
      showToast('가챠는 최대 2회까지 가능합니다.', 'error')
      return
    }
    setGachaLoading(true)
    setSpinning(true)
    try {
      const res = await gachaService.attempt()
      setGachaResult(res)
      setAttemptCount(res.attemptNumber)
      if (user) {
        updateUser({ ...user, totalPoints: res.remainingPoints })
      }
      setTimeout(() => {
        setSpinning(false)
        setShowResult(true)
      }, 1800)
    } catch (err: any) {
      setSpinning(false)
      showToast(err.response?.data?.message ?? '오류가 발생했습니다.', 'error')
    } finally {
      setGachaLoading(false)
    }
  }

  const handleItemClick = (item: ShopItem) => {
    if (item.type === 'gacha') {
      handleGacha()
    } else {
      handlePhotoBooth(item.type)
    }
  }

  return (
    <PageContainer>
      <Header>
        <Title>상점</Title>
        <PointBadge>🪙 {user?.totalPoints ?? 0}p</PointBadge>
      </Header>

      <Content>
        <SectionDesc>포인트를 사용하여 다양한 경험을 즐겨보세요!</SectionDesc>

        <ItemList>
          {shopItems.map(item => (
            <ShopCard key={item.id} $gradient={item.gradient} onClick={() => handleItemClick(item)}>
              <CardOverlay />
              <CardInner>
                <CardTop>
                  <ItemEmoji>{spinning && item.type === 'gacha' ? '🌀' : item.emoji}</ItemEmoji>
                  <PriceBadge>₩ {item.cost}p</PriceBadge>
                </CardTop>
                <ItemName>{item.name}</ItemName>
                <ItemDesc>{item.desc}</ItemDesc>
                {item.type === 'gacha' && attemptCount > 0 && (
                  <AttemptBadge>{attemptCount}/2회 사용</AttemptBadge>
                )}
              </CardInner>
            </ShopCard>
          ))}
        </ItemList>

        <InfoBox>
          <InfoTitle>안내</InfoTitle>
          <InfoItem>포토부스: 1회 10포인트</InfoItem>
          <InfoItem>AI 포토부스: 1회 10포인트</InfoItem>
          <InfoItem>가챠머신: 1회 40포인트 (인당 최대 2회)</InfoItem>
        </InfoBox>
      </Content>

      {/* 가챠 결과 바텀시트 */}
      <BottomSheet
        open={showResult}
        onClose={() => setShowResult(false)}
        title="🎉 당첨!"
      >
        {gachaResult && (
          <ResultContent>
            <ResultEmoji>🎁</ResultEmoji>
            <ResultGoodsName>{gachaResult.goodsName}</ResultGoodsName>
            <ResultInfo>현장에서 굿즈를 수령하세요!</ResultInfo>
            <RemainPoints>남은 포인트: {gachaResult.remainingPoints}p</RemainPoints>
            <Button fullWidth onClick={() => setShowResult(false)}>
              확인
            </Button>
          </ResultContent>
        )}
      </BottomSheet>

      <BottomNav />
    </PageContainer>
  )
}

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  30% { transform: translateY(-12px); }
  60% { transform: translateY(-4px); }
`

const Header = styled.div`
  background: #fff;
  padding: 20px 20px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #F2F4F6;
`

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`

const PointBadge = styled.span`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
`

const Content = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const SectionDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ShopCard = styled.div<{ $gradient: string }>`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s;
  background: ${({ $gradient }) => $gradient};

  &:active {
    transform: scale(0.98);
  }
`

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
`

const CardInner = styled.div`
  position: relative;
  z-index: 1;
  padding: 20px;
`

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`

const ItemEmoji = styled.span`
  font-size: 36px;
`

const PriceBadge = styled.span`
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 20px;
`

const ItemName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
`

const ItemDesc = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
`

const AttemptBadge = styled.span`
  display: inline-block;
  margin-top: 8px;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
`

const InfoBox = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const InfoTitle = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`

const InfoItem = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding-left: 8px;
  &::before {
    content: '•';
    margin-right: 6px;
  }
`

const ResultContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
`

const ResultEmoji = styled.div`
  font-size: 80px;
  animation: ${bounce} 0.6s ease;
`

const ResultGoodsName = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`

const ResultInfo = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const RemainPoints = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`
