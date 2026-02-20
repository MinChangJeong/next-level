import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { gachaService } from '../services/gachaService'
import type { GachaResult } from '../services/gachaService'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/common/Toast'
import Button from '../components/common/Button'
import BottomSheet from '../components/common/BottomSheet'
import BottomNav from '../components/common/BottomNav'

export default function GachaPage() {
  const { user, updateUser } = useAuth()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GachaResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [attemptCount, setAttemptCount] = useState<number>(0)

  const canAttempt = (user?.totalPoints ?? 0) >= 40 && attemptCount < 2

  const handleAttempt = async () => {
    if (!canAttempt) return
    setLoading(true)
    setSpinning(true)
    try {
      const res = await gachaService.attempt()
      setResult(res)
      setAttemptCount(res.attemptNumber)
      // 포인트 업데이트
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
      setLoading(false)
    }
  }

  return (
    <Page>
      <Header>
        <Title>가챠</Title>
        <PointBadge>🪙 {user?.totalPoints ?? 0}p</PointBadge>
      </Header>

      <MachineArea>
        <MachineEmoji $spinning={spinning}>
          {spinning ? '🌀' : '🎰'}
        </MachineEmoji>
        <MachineName>하고잡이 가챠머신</MachineName>
        <MachineDesc>
          40포인트로 랜덤 굿즈를 뽑아보세요!<br />
          인당 최대 2회 도전 가능
        </MachineDesc>
        <AttemptInfo>
          {attemptCount > 0 && (
            <AttemptBadge>{attemptCount}/2회 도전</AttemptBadge>
          )}
        </AttemptInfo>
      </MachineArea>

      <BottomArea>
        {attemptCount >= 2 ? (
          <CompletedText>🎊 가챠를 모두 완료했습니다!</CompletedText>
        ) : (user?.totalPoints ?? 0) < 40 ? (
          <NotEnoughText>포인트가 부족합니다 (필요: 40p)</NotEnoughText>
        ) : null}
        <Button
          fullWidth
          loading={loading}
          disabled={!canAttempt}
          onClick={handleAttempt}
        >
          {spinning ? '뽑는 중...' : '도전하기 (-40p)'}
        </Button>
      </BottomArea>

      {/* 결과 바텀시트 */}
      <BottomSheet
        open={showResult}
        onClose={() => setShowResult(false)}
        title="🎉 당첨!"
      >
        {result && (
          <ResultContent>
            <ResultEmoji>🎁</ResultEmoji>
            <ResultGoodsName>{result.goodsName}</ResultGoodsName>
            <ResultInfo>현장에서 굿즈를 수령하세요!</ResultInfo>
            <RemainPoints>남은 포인트: {result.remainingPoints}p</RemainPoints>
            <Button fullWidth onClick={() => setShowResult(false)}>
              확인
            </Button>
          </ResultContent>
        )}
      </BottomSheet>

      <BottomNav />
    </Page>
  )
}

const spin = keyframes`
  from { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  to { transform: rotate(360deg) scale(1); }
`

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  30% { transform: translateY(-20px); }
  60% { transform: translateY(-8px); }
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

const MachineArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  gap: 12px;
`

const MachineEmoji = styled.div<{ $spinning: boolean }>`
  font-size: 100px;
  line-height: 1;
  animation: ${({ $spinning }) => ($spinning ? spin : bounce)}
    ${({ $spinning }) => ($spinning ? '0.5s' : '3s')}
    ${({ $spinning }) => ($spinning ? 'linear infinite' : 'ease infinite')};
`

const MachineName = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`

const MachineDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  line-height: 1.6;
`

const AttemptInfo = styled.div`
  height: 28px;
  display: flex;
  align-items: center;
`

const AttemptBadge = styled.span`
  background: #FEF9C3;
  color: #92400E;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
`

const BottomArea = styled.div`
  padding: 0 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const CompletedText = styled.p`
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: #16A34A;
`

const NotEnoughText = styled.p`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
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
