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
          <EmptyState>
            <EmptyIcon>🔍</EmptyIcon>
            <EmptyText>이 존에는 부스가 없습니다.</EmptyText>
          </EmptyState>
        ) : (
          <>
            <StatusRow>
              <StatusItem>
                <StatusCount>{booths.length}</StatusCount>
                <StatusLabel>전체</StatusLabel>
              </StatusItem>
              <StatusDivider />
              <StatusItem>
                <StatusCount $color="#16A34A">{booths.filter(b => b.visited).length}</StatusCount>
                <StatusLabel>방문완료</StatusLabel>
              </StatusItem>
              <StatusDivider />
              <StatusItem>
                <StatusCount $color="#EF4444">{booths.filter(b => !b.visited).length}</StatusCount>
                <StatusLabel>미방문</StatusLabel>
              </StatusItem>
            </StatusRow>
            <BoothList>
              {booths.map(booth => (
                <BoothCard key={booth.boothId} booth={booth} />
              ))}
            </BoothList>
          </>
        )}
      </Content>

      <BottomNav />
    </PageContainer>
  )
}

const Content = styled.div`
  padding: 16px;
`

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: #fff;
  border-radius: 14px;
  padding: 14px 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`

const StatusItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`

const StatusCount = styled.span<{ $color?: string }>`
  font-size: 20px;
  font-weight: 700;
  color: ${({ $color, theme }) => $color ?? theme.colors.text.primary};
`

const StatusLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const StatusDivider = styled.div`
  width: 1px;
  height: 28px;
  background: #E2E8F0;
`

const BoothList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const LoadingText = styled.p`
  text-align: center;
  padding: 60px 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 60px 0;
`

const EmptyIcon = styled.span`
  font-size: 40px;
`

const EmptyText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`
