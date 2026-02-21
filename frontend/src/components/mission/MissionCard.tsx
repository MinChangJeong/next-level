import styled from 'styled-components'
import type { Mission } from '../../services/missionService'

interface MissionCardProps {
  mission: Mission
}

export default function MissionCard({ mission }: MissionCardProps) {
  const progressPct = mission.target > 0 ? Math.min((mission.progress / mission.target) * 100, 100) : 0

  if (!mission.isUnlocked) {
    return (
      <Card $locked>
        <IconCircle $completed={false} $locked>
          <IconText>🔒</IconText>
        </IconCircle>
        <CardContent>
          <TitleRow>
            <Title $locked>???</Title>
          </TitleRow>
          <Desc $locked>조건을 달성하면 미션이 공개됩니다</Desc>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card $locked={false}>
      <IconCircle $completed={mission.isCompleted} $locked={false}>
        <IconText>{mission.isCompleted ? '✓' : `${mission.progress}/${mission.target}`}</IconText>
      </IconCircle>
      <CardContent>
        <TitleRow>
          <Title $locked={false}>{mission.title}</Title>
          {mission.isCompleted && <CompletedBadge>완료</CompletedBadge>}
        </TitleRow>
        <Desc $locked={false}>{mission.description}</Desc>
        {!mission.isCompleted && (
          <ProgressArea>
            <ProgressBarOuter>
              <ProgressBarInner $pct={progressPct} />
            </ProgressBarOuter>
            <ProgressLabel>{mission.progress}/{mission.target}</ProgressLabel>
          </ProgressArea>
        )}
      </CardContent>
    </Card>
  )
}

const Card = styled.div<{ $locked: boolean }>`
  background: ${({ $locked }) => $locked ? '#F8FAFC' : '#fff'};
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  border: 1px solid ${({ $locked }) => $locked ? '#E2E8F0' : '#F2F4F6'};
  box-shadow: ${({ $locked }) => $locked ? 'none' : '0 1px 3px rgba(0,0,0,0.04)'};
  opacity: ${({ $locked }) => $locked ? 0.6 : 1};
`

const IconCircle = styled.div<{ $completed: boolean; $locked: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $completed, $locked }) =>
    $locked ? '#E2E8F0'
    : $completed ? '#DCFCE7'
    : '#EEF2FF'};
`

const IconText = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`

const CardContent = styled.div`
  flex: 1;
  min-width: 0;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`

const Title = styled.h3<{ $locked: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${({ $locked, theme }) => $locked ? theme.colors.text.disabled : theme.colors.text.primary};
`

const CompletedBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #16A34A;
  background: #DCFCE7;
  padding: 2px 8px;
  border-radius: 20px;
`

const Desc = styled.p<{ $locked: boolean }>`
  font-size: 13px;
  color: ${({ $locked, theme }) => $locked ? theme.colors.text.disabled : theme.colors.text.secondary};
  line-height: 1.5;
  margin-bottom: 8px;
`

const ProgressArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ProgressBarOuter = styled.div`
  flex: 1;
  height: 5px;
  background: #E2E8F0;
  border-radius: 3px;
  overflow: hidden;
`

const ProgressBarInner = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 3px;
  transition: width 0.5s ease;
`

const ProgressLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;
`
