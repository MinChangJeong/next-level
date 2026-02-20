import styled, { keyframes, css } from 'styled-components'

interface EggProgressProps {
  completed: number  // 0~5
}

// 알이 깨져가는 SVG (단계별)
function EggSvg({ stage }: { stage: number }) {
  const cracks = [
    [],
    // 1단계: 약간 금
    [{ x1: 50, y1: 30, x2: 55, y2: 40 }],
    // 2단계: 금 확대
    [{ x1: 50, y1: 30, x2: 55, y2: 40 }, { x1: 55, y1: 40, x2: 48, y2: 52 }, { x1: 55, y1: 40, x2: 62, y2: 50 }],
    // 3단계: 반쯤 깨짐
    [{ x1: 50, y1: 25, x2: 55, y2: 40 }, { x1: 55, y1: 40, x2: 45, y2: 55 }, { x1: 55, y1: 40, x2: 65, y2: 52 },
     { x1: 45, y1: 55, x2: 38, y2: 65 }, { x1: 65, y1: 52, x2: 70, y2: 62 }],
    // 4단계: 거의 깨짐
    [{ x1: 50, y1: 25, x2: 55, y2: 40 }, { x1: 55, y1: 40, x2: 40, y2: 58 }, { x1: 55, y1: 40, x2: 68, y2: 55 },
     { x1: 40, y1: 58, x2: 32, y2: 70 }, { x1: 68, y1: 55, x2: 75, y2: 68 }, { x1: 40, y1: 58, x2: 50, y2: 72 }],
  ]

  const currentCracks = stage < 5 ? (cracks[stage] || []) : []

  return (
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      {stage < 5 ? (
        <>
          <ellipse cx="50" cy="65" rx="35" ry="45"
            fill="#FFF8E1" stroke="#FFD54F" strokeWidth="2" />
          {currentCracks.map((c, i) => (
            <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke="#FF8F00" strokeWidth="1.5" strokeLinecap="round" />
          ))}
          {stage > 0 && (
            <text x="50" y="68" textAnchor="middle" fontSize="24">🐣</text>
          )}
        </>
      ) : (
        // 5단계: 완전 깨짐 - 하고잡이 탄생
        <>
          <text x="50" y="75" textAnchor="middle" fontSize="56">🐥</text>
          <text x="50" y="108" textAnchor="middle" fontSize="9" fill="#F59E0B" fontWeight="bold">하고잡이!</text>
        </>
      )}
    </svg>
  )
}

export default function EggProgress({ completed }: EggProgressProps) {
  return (
    <Container>
      <EggWrapper $stage={completed}>
        <EggSvg stage={completed} />
      </EggWrapper>
      <ProgressText>
        <Count>{completed}</Count>
        <Total>/5 미션 달성</Total>
      </ProgressText>
      <StepRow>
        {Array.from({ length: 5 }, (_, i) => (
          <Step key={i} $done={i < completed} />
        ))}
      </StepRow>
    </Container>
  )
}

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0 16px;
`

const EggWrapper = styled.div<{ $stage: number }>`
  width: 120px;
  height: 144px;
  ${({ $stage }) => $stage === 5 && css`animation: ${pulse} 1.5s ease infinite;`}
`

const ProgressText = styled.div`
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin-top: 8px;
`

const Count = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`

const Total = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const StepRow = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 12px;
`

const Step = styled.div<{ $done: boolean }>`
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background: ${({ $done, theme }) => ($done ? theme.colors.primary : '#E2E8F0')};
  transition: background 0.3s ease;
`
