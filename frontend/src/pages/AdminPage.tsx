import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import apiClient from '../services/api'
import { BackButton, PageHeader, PageTitle } from '../components/common/Card'

interface Dashboard {
  totalUsers: number
  totalBooths: number
  totalVisits: number
  totalEvaluations: number
}

interface RankingItem {
  boothId: string
  voteCount: number
}

interface GoodsItem {
  goodsId: string
  name: string
  totalStock: number
  remainingStock: number
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [ranking, setRanking] = useState<RankingItem[]>([])
  const [goods, setGoods] = useState<GoodsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiClient.get('/admin/dashboard').then(r => r.data.data),
      apiClient.get('/admin/booths/ranking').then(r => r.data.data),
      apiClient.get('/admin/goods/stock').then(r => r.data.data),
    ]).then(([dash, rank, goodsList]) => {
      setDashboard(dash)
      setRanking(rank)
      setGoods(goodsList)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <Page>
      <PageHeader>
        <BackButton onClick={() => navigate('/main')}>←</BackButton>
        <PageTitle>관리자 대시보드</PageTitle>
      </PageHeader>

      {loading ? (
        <LoadingText>불러오는 중...</LoadingText>
      ) : (
        <Content>
          {/* 통계 카드 */}
          <SectionTitle>전체 통계</SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatValue>{dashboard?.totalUsers ?? 0}</StatValue>
              <StatLabel>전체 사용자</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{dashboard?.totalBooths ?? 0}</StatValue>
              <StatLabel>전체 부스</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{dashboard?.totalVisits ?? 0}</StatValue>
              <StatLabel>총 방문 수</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{dashboard?.totalEvaluations ?? 0}</StatValue>
              <StatLabel>총 평가 수</StatLabel>
            </StatCard>
          </StatsGrid>

          {/* 1등 부스 랭킹 */}
          <SectionTitle>부스 랭킹</SectionTitle>
          <Card>
            {ranking.length === 0 ? (
              <EmptyText>아직 평가 데이터가 없습니다.</EmptyText>
            ) : (
              ranking.map((item, idx) => (
                <RankRow key={item.boothId}>
                  <Rank>#{idx + 1}</Rank>
                  <RankBoothId>{item.boothId}</RankBoothId>
                  <RankVotes>{item.voteCount}표</RankVotes>
                </RankRow>
              ))
            )}
          </Card>

          {/* 굿즈 재고 */}
          <SectionTitle>굿즈 재고</SectionTitle>
          <Card>
            {goods.map(g => (
              <GoodsRow key={g.goodsId}>
                <GoodsName>{g.name}</GoodsName>
                <StockInfo>
                  <Stock $low={g.remainingStock < 30}>
                    {g.remainingStock}/{g.totalStock}
                  </Stock>
                  <StockBar>
                    <StockFill $pct={g.totalStock > 0 ? (g.remainingStock / g.totalStock) * 100 : 0} />
                  </StockBar>
                </StockInfo>
              </GoodsRow>
            ))}
          </Card>
        </Content>
      )}
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
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 32px;
`

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: 4px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`

const StatCard = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  text-align: center;
`

const StatValue = styled.p`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`

const StatLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;
`

const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const EmptyText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  padding: 16px 0;
`

const RankRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const Rank = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  width: 28px;
`

const RankBoothId = styled.span`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
`

const RankVotes = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const GoodsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const GoodsName = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
`

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Stock = styled.span<{ $low: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $low }) => ($low ? '#EF4444' : '#16A34A')};
  white-space: nowrap;
`

const StockBar = styled.div`
  width: 60px;
  height: 4px;
  background: #F2F4F6;
  border-radius: 2px;
  overflow: hidden;
`

const StockFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $pct }) => ($pct < 20 ? '#EF4444' : '#00C471')};
  border-radius: 2px;
`

const LoadingText = styled.p`
  text-align: center;
  padding: 60px;
  color: ${({ theme }) => theme.colors.text.secondary};
`
