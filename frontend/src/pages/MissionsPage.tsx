import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { missionService } from '../services/missionService'
import type { Mission } from '../services/missionService'
import MissionCard from '../components/mission/MissionCard'
import BottomNav from '../components/common/BottomNav'
import { PageContainer } from '../components/common/Card'

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    missionService.getAll()
      .then(setMissions)
      .finally(() => setLoading(false))
  }, [])

  const completed = missions.filter(m => m.isCompleted).length

  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroBg />
        <HeroContent>
          <HeroEgg>{completed >= 5 ? '🐥' : '🥚'}</HeroEgg>
          <HeroTitle>OnlyOne Fair 미션</HeroTitle>
          <HeroDesc>
            아래 미션을 달성하며 하고잡이로 성장하세요.{'\n'}
            5가지 역량을 모두 달성하면 하고잡이가 탄생합니다!
          </HeroDesc>
          <ProgressRow>
            <ProgressLabel>미션 달성</ProgressLabel>
            <ProgressBarOuter>
              <ProgressBarInner $pct={missions.length > 0 ? (completed / missions.length) * 100 : 0} />
            </ProgressBarOuter>
            <ProgressCount>{completed}/{missions.length}</ProgressCount>
          </ProgressRow>
        </HeroContent>
      </HeroSection>

      {loading ? (
        <LoadingText>불러오는 중...</LoadingText>
      ) : (
        <MissionList>
          {missions.map(m => (
            <MissionCard key={m.missionId} mission={m} />
          ))}
        </MissionList>
      )}

      <BottomNav />
    </PageContainer>
  )
}

const HeroSection = styled.div`
  position: relative;
  overflow: hidden;
`

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #C084FC 0%, #818CF8 50%, #60A5FA 100%);
`

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  padding: 32px 20px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

const HeroEgg = styled.div`
  font-size: 64px;
  margin-bottom: 4px;
`

const HeroTitle = styled.h1`
  font-size: 22px;
  font-weight: 800;
  color: #fff;
`

const HeroDesc = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  line-height: 1.5;
  white-space: pre-line;
`

const ProgressRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  padding: 0 4px;
`

const ProgressLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
`

const ProgressBarOuter = styled.div`
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 3px;
  overflow: hidden;
`

const ProgressBarInner = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: #fff;
  border-radius: 3px;
  transition: width 0.5s ease;
`

const ProgressCount = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
`

const MissionList = styled.div`
  padding: 16px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const LoadingText = styled.p`
  text-align: center;
  padding: 60px;
  color: ${({ theme }) => theme.colors.text.secondary};
`
