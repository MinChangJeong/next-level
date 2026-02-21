import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import BottomNav from '../components/common/BottomNav'
import { PageContainer } from '../components/common/Card'

interface Zone {
  id: string
  name: string
  desc: string
  isGrowth?: boolean
  isEvent?: boolean
  illustration: string
}

const floors: { floor: string; label: string; zones: Zone[] }[] = [
  {
    floor: '2F',
    label: '러닝 센터 2F',
    zones: [
      { id: 'GROWTH', name: '성장존', desc: '꿈을 원대하게', isGrowth: true, isEvent: true, illustration: '🌱' },
    ],
  },
  {
    floor: '1F',
    label: '러닝 센터',
    zones: [
      { id: '101', name: '101호', desc: '러닝 센터 1관', illustration: '🎯' },
      { id: '102', name: '102호', desc: '러닝 센터 2관', illustration: '🚀' },
    ],
  },
  {
    floor: 'B1F',
    label: '이노베이션 센터',
    zones: [
      { id: 'HALL', name: '손복남 홀', desc: '메인 전시관', illustration: '🏛️' },
      { id: 'L01', name: 'L01 도전존', desc: '도전과 혁신의 공간', isEvent: true, illustration: '⚡' },
      { id: 'L02', name: 'L02 창의존', desc: '창의와 아이디어 공간', isEvent: true, illustration: '💡' },
    ],
  },
]

export default function MainPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleZoneClick = (zone: Zone) => {
    if (zone.isGrowth) {
      navigate('/growth-zone')
    } else if (zone.isEvent) {
      // 이벤트 존은 별도 이벤트 존 안내
      navigate(`/zone/${zone.id}`)
    } else {
      navigate(`/zone/${zone.id}`)
    }
  }

  return (
    <PageContainer>
      <Header>
        <HeaderTop>
          <TitleArea>
            <AppTitle>하고잡이</AppTitle>
            <EventLabel>OnlyOne Fair 2024</EventLabel>
          </TitleArea>
          <PointBadge onClick={() => navigate('/qr')}>
            🪙 {user?.totalPoints}p
          </PointBadge>
        </HeaderTop>
        <WelcomeRow>
          <WelcomeText>{user?.name}님, 안녕하세요 👋</WelcomeText>
        </WelcomeRow>
      </Header>

      <MapContainer>
        <MapTitle>공간 맵</MapTitle>
        <MapSubtitle>참여하고 싶은 공간을 선택하세요</MapSubtitle>

        {floors.map(floorInfo => (
          <FloorSection key={floorInfo.floor}>
            <FloorHeader>
              <FloorBadge>{floorInfo.floor}</FloorBadge>
              <FloorLabel>{floorInfo.label}</FloorLabel>
            </FloorHeader>
            <ZoneGrid $count={floorInfo.zones.length}>
              {floorInfo.zones.map(zone => (
                <ZoneCard
                  key={zone.id}
                  onClick={() => handleZoneClick(zone)}
                  $isEvent={zone.isEvent}
                >
                  <ZoneIllustration>{zone.illustration}</ZoneIllustration>
                  <ZoneNameLabel>{zone.name}</ZoneNameLabel>
                  <ZoneDesc>{zone.desc}</ZoneDesc>
                  {zone.isEvent && <EventTag>이벤트</EventTag>}
                </ZoneCard>
              ))}
            </ZoneGrid>
          </FloorSection>
        ))}

        <CTAButton onClick={() => navigate('/booths')}>
          참여하러 가기
        </CTAButton>
      </MapContainer>

      <BottomNav />
    </PageContainer>
  )
}

const Header = styled.div`
  background: #fff;
  padding: 20px 20px 16px;
  border-bottom: 1px solid #F2F4F6;
`

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
`

const TitleArea = styled.div``

const AppTitle = styled.h1`
  font-size: 22px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
`

const EventLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.disabled};
  margin-top: 2px;
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
  white-space: nowrap;
`

const WelcomeRow = styled.div``

const WelcomeText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const MapContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const MapTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: -12px;
`

const MapSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const FloorSection = styled.div``

const FloorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`

const FloorBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.text.primary};
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 4px;
`

const FloorLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const ZoneGrid = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: ${({ $count }) => $count === 1 ? '1fr' : $count === 2 ? '1fr 1fr' : 'repeat(3, 1fr)'};
  gap: 10px;
`

const ZoneCard = styled.div<{ $isEvent?: boolean }>`
  position: relative;
  background: #fff;
  border-radius: 14px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  border: 1.5px solid ${({ $isEvent }) => $isEvent ? '#EDE9FE' : '#F2F4F6'};
  transition: all 0.15s ease;
  min-height: 120px;

  &:active {
    transform: scale(0.97);
    box-shadow: 0 2px 12px rgba(79, 70, 229, 0.1);
  }
`

const ZoneIllustration = styled.span`
  font-size: 36px;
  line-height: 1;
  margin-bottom: 2px;
`

const ZoneNameLabel = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
`

const ZoneDesc = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`

const EventTag = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #EDE9FE;
  color: #7C3AED;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
`

const CTAButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${({ theme }) => theme.colors.text.primary};
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: opacity 0.15s;
  margin-top: 4px;

  &:active {
    opacity: 0.85;
  }
`
