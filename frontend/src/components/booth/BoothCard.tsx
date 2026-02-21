import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import type { Booth } from '../../services/boothService'

interface BoothCardProps {
  booth: Booth
}

const accentColors = [
  'linear-gradient(135deg, #FF6B6B, #EE5A24)',
  'linear-gradient(135deg, #4ECDC4, #2ECC71)',
  'linear-gradient(135deg, #6C5CE7, #A29BFE)',
  'linear-gradient(135deg, #FDCB6E, #F39C12)',
  'linear-gradient(135deg, #74B9FF, #0984E3)',
  'linear-gradient(135deg, #FD79A8, #E84393)',
  'linear-gradient(135deg, #55EFC4, #00B894)',
  'linear-gradient(135deg, #FAB1A0, #E17055)',
]

function getAccentColor(boothId: string): string {
  let hash = 0
  for (let i = 0; i < boothId.length; i++) {
    hash = boothId.charCodeAt(i) + ((hash << 5) - hash)
  }
  return accentColors[Math.abs(hash) % accentColors.length]
}

export default function BoothCard({ booth }: BoothCardProps) {
  const navigate = useNavigate()

  return (
    <Card onClick={() => navigate(`/booth/${booth.boothId}`)} $visited={booth.visited}>
      <AccentBar style={{ background: getAccentColor(booth.boothId) }} />
      <CardContent>
        <TopRow>
          <Name $visited={booth.visited}>{booth.name}</Name>
          {booth.visited && <VisitedBadge>방문완료</VisitedBadge>}
        </TopRow>
        <Desc>{booth.shortDescription}</Desc>
        <BottomRow>
          <MetaItem>📍 {booth.zone}</MetaItem>
          <MetaItem>👥 {booth.visitorCount}명</MetaItem>
          <FloorBadge>{booth.floor}</FloorBadge>
        </BottomRow>
      </CardContent>
    </Card>
  )
}

const Card = styled.div<{ $visited: boolean }>`
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  cursor: pointer;
  transition: all 0.15s ease;
  opacity: ${({ $visited }) => ($visited ? 0.75 : 1)};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`

const AccentBar = styled.div`
  width: 5px;
  flex-shrink: 0;
  border-radius: 14px 0 0 14px;
`

const CardContent = styled.div`
  flex: 1;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const Name = styled.h3<{ $visited: boolean }>`
  font-size: 15px;
  font-weight: 700;
  color: ${({ $visited, theme }) => ($visited ? theme.colors.text.secondary : theme.colors.text.primary)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`

const VisitedBadge = styled.span`
  flex-shrink: 0;
  background: #DCFCE7;
  color: #16A34A;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
`

const Desc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
`

const MetaItem = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.disabled};
`

const FloorBadge = styled.span`
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  padding: 2px 8px;
  border-radius: 20px;
`
