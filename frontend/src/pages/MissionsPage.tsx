import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { missionService } from '../services/missionService'
import type { Mission } from '../services/missionService'
import EggProgress from '../components/mission/EggProgress'
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
      <Header>
        <Title>미션</Title>
        <SubTitle>5가지 역량을 달성하며 하고잡이로 성장하세요</SubTitle>
      </Header>

      {loading ? (
        <LoadingText>불러오는 중...</LoadingText>
      ) : (
        <>
          <EggProgress completed={completed} />
          <MissionList>
            {missions.map(m => (
              <MissionCard key={m.missionId} mission={m} />
            ))}
          </MissionList>
        </>
      )}

      <BottomNav />
    </PageContainer>
  )
}

const Header = styled.div`
  background: #fff;
  padding: 20px 20px 16px;
  border-bottom: 1px solid #F2F4F6;
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

const MissionList = styled.div`
  padding: 0 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const LoadingText = styled.p`
  text-align: center;
  padding: 60px;
  color: ${({ theme }) => theme.colors.text.secondary};
`
