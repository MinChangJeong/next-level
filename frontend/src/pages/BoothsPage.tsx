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
            <CountText>
              {filtered.filter(b => !b.visited).length}개 미방문 ·{' '}
              {filtered.filter(b => b.visited).length}개 방문완료
            </CountText>
            <Grid>
              {filtered.map(booth => (
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

const CountText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 12px;
`

const LoadingText = styled.p`
  text-align: center;
  padding: 60px 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`
