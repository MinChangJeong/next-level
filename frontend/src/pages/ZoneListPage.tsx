import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { boothService } from '../services/boothService'
import type { Booth } from '../services/boothService'
import BoothCard from '../components/booth/BoothCard'
import BottomNav from '../components/common/BottomNav'
import { PageContainer, PageHeader, BackButton, PageTitle } from '../components/common/Card'

const zoneNames: Record<string, string> = {
  HALL: '손복남 홀',
  L01: 'L01 도전존',
  L02: 'L02 창의존',
  '101': '101호',
  '102': '102호',
}

export default function ZoneListPage() {
  const { zoneId = '' } = useParams()
  const navigate = useNavigate()
  const [booths, setBooths] = useState<Booth[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    boothService.getByZone(zoneId)
      .then(setBooths)
      .finally(() => setLoading(false))
  }, [zoneId])

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
        <PageTitle>{zoneNames[zoneId] ?? zoneId}</PageTitle>
      </PageHeader>

      <Content>
        {loading ? (
          <LoadingText>불러오는 중...</LoadingText>
        ) : booths.length === 0 ? (
          <EmptyText>이 존에는 부스가 없습니다.</EmptyText>
        ) : (
          <>
            <CountText>{booths.length}개 부스</CountText>
            <Grid>
              {booths.map(booth => (
                <BoothCard key={booth.boothId} booth={booth} />
              ))}
            </Grid>
          </>
        )}
      </Content>

      <BottomNav />
    </PageContainer>
  )
}

const Content = styled.div`
  padding: 16px 16px 0;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

const CountText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 12px;
`

const LoadingText = styled.p`
  text-align: center;
  padding: 60px 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const EmptyText = styled.p`
  text-align: center;
  padding: 60px 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`
