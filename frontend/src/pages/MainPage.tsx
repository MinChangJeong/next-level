import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import BottomNav from '../components/common/BottomNav'
import { PageContainer } from '../components/common/Card'

interface Zone {
  id: string
  name: string
  emoji: string
  desc: string
  isGrowth?: boolean
}

const floors: { floor: string; name: string; zones: Zone[] }[] = [
  {
    floor: 'B1F',
    name: '이노베이션 센터',
    zones: [
      { id: 'HALL', name: '손복남 홀', emoji: '🏛️', desc: '메인 전시관' },
      { id: 'L01', name: 'L01 도전존', emoji: '⚡', desc: '도전과 혁신의 공간' },
      { id: 'L02', name: 'L02 창의존', emoji: '💡', desc: '창의와 아이디어 공간' },
    ],
  },
  {
    floor: '1F',
    name: '러닝 센터',
    zones: [
      { id: '101', name: '101호', emoji: '🎯', desc: '러닝 센터 1관' },
      { id: '102', name: '102호', emoji: '🚀', desc: '러닝 센터 2관' },
    ],
  },
  {
    floor: '2F',
    name: '러닝 센터 2F',
    zones: [
      { id: 'GROWTH', name: '성장존', emoji: '🌱', desc: '꿈을 원대하게', isGrowth: true },
    ],
  },
]

export default function MainPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleZoneClick = (zoneId: string, isGrowth?: boolean) => {
    if (isGrowth) {
      navigate('/growth-zone')
    } else {
      navigate(`/zone/${zoneId}`)
    }
  }

  return (
    <PageContainer>
      {/* Header */}
      <Header>
        <HeaderLeft>
          <WelcomeText>안녕하세요</WelcomeText>
          <UserName>{user?.name}님 👋</UserName>
        </HeaderLeft>
        <PointBadge onClick={() => navigate('/qr')}>
          <span>🪙 {user?.totalPoints}p</span>
        </PointBadge>
      </Header>

      {/* 공간 맵 */}
      <Content>
        <SectionTitle>공간 맵</SectionTitle>

        {floors.map(floorInfo => (
          <FloorSection key={floorInfo.floor}>
            <FloorBadge>{floorInfo.floor}</FloorBadge>
            <FloorName>{floorInfo.name}</FloorName>
            <ZoneList>
              {floorInfo.zones.map(zone => (
                <ZoneCard key={zone.id} onClick={() => handleZoneClick(zone.id, zone.isGrowth)}>
                  <ZoneEmoji>{zone.emoji}</ZoneEmoji>
                  <ZoneInfo>
                    <ZoneName>{zone.name}</ZoneName>
                    <ZoneDesc>{zone.desc}</ZoneDesc>
                  </ZoneInfo>
                  <ArrowIcon>›</ArrowIcon>
                </ZoneCard>
              ))}
            </ZoneList>
          </FloorSection>
        ))}

        {/* 이벤트 존 */}
        <EventBanner onClick={() => navigate('/photobooth')}>
          <EventEmoji>📸</EventEmoji>
          <EventInfo>
            <EventTitle>포토부스 & AI 포토부스</EventTitle>
            <EventDesc>추억을 남겨보세요 · 각 10p</EventDesc>
          </EventInfo>
          <ArrowIcon>›</ArrowIcon>
        </EventBanner>
      </Content>

      <BottomNav />
    </PageContainer>
  )
}

const Header = styled.div`
  background: #fff;
  padding: 20px 20px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid #F2F4F6;
`

const HeaderLeft = styled.div``

const WelcomeText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const UserName = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`

const PointBadge = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
`

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`

const FloorSection = styled.div``

const FloorBadge = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 6px;
`

const FloorName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 10px;
`

const ZoneList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ZoneCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border: 1px solid #F2F4F6;
  transition: all 0.15s ease;

  &:active {
    background: ${({ theme }) => theme.colors.surface};
    transform: scale(0.99);
  }
`

const ZoneEmoji = styled.span`
  font-size: 28px;
  flex-shrink: 0;
`

const ZoneInfo = styled.div`
  flex: 1;
`

const ZoneName = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`

const ZoneDesc = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 2px;
`

const ArrowIcon = styled.span`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text.disabled};
  font-weight: 300;
`

const EventBanner = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.15s;

  &:active { transform: scale(0.98); }

  ${ArrowIcon} { color: rgba(255,255,255,0.6); }
`

const EventEmoji = styled.span`
  font-size: 32px;
`

const EventInfo = styled.div`
  flex: 1;
`

const EventTitle = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: #fff;
`

const EventDesc = styled.p`
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  margin-top: 2px;
`
