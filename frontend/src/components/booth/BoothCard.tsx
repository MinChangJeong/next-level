import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import type { Booth } from '../../services/boothService'

interface BoothCardProps {
  booth: Booth
}

export default function BoothCard({ booth }: BoothCardProps) {
  const navigate = useNavigate()

  return (
    <Card onClick={() => navigate(`/booth/${booth.boothId}`)} $visited={booth.visited}>
      <ImageBox>
        {booth.imageUrl ? (
          <img src={booth.imageUrl} alt={booth.name} />
        ) : (
          <PlaceholderIcon>🎪</PlaceholderIcon>
        )}
        {booth.visited && <VisitedBadge>✓ 방문완료</VisitedBadge>}
      </ImageBox>
      <Info>
        <Name $visited={booth.visited}>{booth.name}</Name>
        <Desc>{booth.shortDescription}</Desc>
        <Footer>
          <VisitorCount>👥 {booth.visitorCount}명</VisitorCount>
          <ZoneBadge>{booth.zone}</ZoneBadge>
        </Footer>
      </Info>
    </Card>
  )
}

const Card = styled.div<{ $visited: boolean }>`
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #F2F4F6;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  opacity: ${({ $visited }) => ($visited ? 0.7 : 1)};

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
`

const ImageBox = styled.div`
  position: relative;
  height: 120px;
  background: #F5F6F8;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const PlaceholderIcon = styled.span`
  font-size: 40px;
`

const VisitedBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #00C471;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
`

const Info = styled.div`
  padding: 12px 14px;
`

const Name = styled.h3<{ $visited: boolean }>`
  font-size: 15px;
  font-weight: 700;
  color: ${({ $visited, theme }) => ($visited ? theme.colors.text.secondary : theme.colors.text.primary)};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Desc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const VisitorCount = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const ZoneBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  padding: 2px 8px;
  border-radius: 20px;
`
