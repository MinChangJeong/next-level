import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { boothService } from '../services/boothService'
import type { Booth } from '../services/boothService'
import BoothCard from '../components/booth/BoothCard'
import BottomNav from '../components/common/BottomNav'
import { PageContainer } from '../components/common/Card'

const floors = ['B1F', '1F']

export default function BoothsPage() {
  const [booths, setBooths] = useState<Booth[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFloor, setActiveFloor] = useState<string | null>(null)

  useEffect(() => {
    boothService.getAll()
      .then(setBooths)
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeFloor
    ? booths.filter(b => b.floor === activeFloor)
    : booths

  return (
    <PageContainer>
      <Header>
        <Title>부스 목록</Title>
        <Tabs>
          <Tab $active={!activeFloor} onClick={() => setActiveFloor(null)}>전체</Tab>
          {floors.map(f => (
            <Tab key={f} $active={activeFloor === f} onClick={() => setActiveFloor(f)}>{f}</Tab>
          ))}
        </Tabs>
      </Header>

      <Content>
        {loading ? (
          <LoadingText>불러오는 중...</LoadingText>
        ) : (
          <>
            <StatusRow>
              <StatusItem>
                <StatusCount>{filtered.length}</StatusCount>
                <StatusLabel>전체</StatusLabel>
              </StatusItem>
              <StatusDivider />
              <StatusItem>
                <StatusCount $color="#16A34A">{filtered.filter(b => b.visited).length}</StatusCount>
                <StatusLabel>방문완료</StatusLabel>
              </StatusItem>
              <StatusDivider />
              <StatusItem>
                <StatusCount $color="#EF4444">{filtered.filter(b => !b.visited).length}</StatusCount>
                <StatusLabel>미방문</StatusLabel>
              </StatusItem>
            </StatusRow>
            <BoothList>
              {filtered.map(booth => (
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

const Header = styled.div`
  background: #fff;
  padding: 16px 20px 0;
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid #F2F4F6;
`

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  padding-bottom: 12px;
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.surface)};
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.text.secondary)};
  border: none;
  cursor: pointer;
  transition: all 0.15s;
`

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
