import styled, { keyframes } from 'styled-components'
import type { Mission } from '../../services/missionService'

interface MissionCardProps {
  mission: Mission
}

export default function MissionCard({ mission }: MissionCardProps) {
  const progressPct = mission.target > 0 ? Math.min((mission.progress / mission.target) * 100, 100) : 0

  if (!mission.isUnlocked) {
    return (
      <Card $locked>
        <LockIcon>🔒</LockIcon>
        <LockedInfo>
          <LockTitle>???</LockTitle>
          <LockHint>조건을 달성하면 미션이 공개됩니다</LockHint>
        </LockedInfo>
      </Card>
    )
  }

  return (
    <Card $locked={false} $completed={mission.isCompleted}>
      <MissionHeader>
        <MissionTitle $completed={mission.isCompleted}>
          {mission.isCompleted && <DoneIcon>✅</DoneIcon>}
          {mission.title}
        </MissionTitle>
        <Badge $completed={mission.isCompleted}>
          {mission.isCompleted ? '완료' : `${mission.progress}/${mission.target}`}
        </Badge>
      </MissionHeader>
      <MissionDesc>{mission.description}</MissionDesc>
      {!mission.isCompleted && (
        <ProgressBar>
          <ProgressFill $pct={progressPct} />
        </ProgressBar>
      )}
    </Card>
  )
}

const unlock = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`

const Card = styled.div<{ $locked: boolean; $completed?: boolean }>`
  background: ${({ $locked, $completed }) =>
    $locked ? '#F5F6F8'
    : $completed ? '#F0FDF4'
    : '#fff'};
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: ${({ $locked }) => ($locked ? 'center' : 'flex-start')};
  gap: 12px;
  flex-direction: ${({ $locked }) => ($locked ? 'row' : 'column')};
  border: 1px solid ${({ $completed }) => ($completed ? '#86EFAC' : '#F2F4F6')};
  animation: ${({ $locked }) => ($locked ? 'none' : unlock)} 0.3s ease;
`

const LockIcon = styled.span`
  font-size: 24px;
  flex-shrink: 0;
`

const LockedInfo = styled.div`
  flex: 1;
`

const LockTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #8B95A1;
  margin-bottom: 2px;
`

const LockHint = styled.p`
  font-size: 12px;
  color: #B0BAC6;
`

const MissionHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const DoneIcon = styled.span`
  margin-right: 4px;
`

const MissionTitle = styled.h3<{ $completed: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ $completed, theme }) => ($completed ? '#16A34A' : theme.colors.text.primary)};
`

const Badge = styled.span<{ $completed: boolean }>`
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
  background: ${({ $completed, theme }) => ($completed ? '#DCFCE7' : theme.colors.surface)};
  color: ${({ $completed, theme }) => ($completed ? '#16A34A' : theme.colors.text.secondary)};
  white-space: nowrap;
`

const MissionDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #F2F4F6;
  border-radius: 2px;
  overflow: hidden;
`

const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 2px;
  transition: width 0.5s ease;
`
