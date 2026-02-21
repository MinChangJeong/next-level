import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import { useToast } from '../components/common/Toast'

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!employeeId.trim() || !name.trim()) {
      showToast('사번과 이름을 입력해주세요.', 'error')
      return
    }
    setLoading(true)
    try {
      const data = await authService.login(employeeId.trim(), name.trim())
      login(data.token, {
        employeeId: data.employeeId,
        name: data.name,
        totalPoints: data.totalPoints,
        missionsCompleted: data.missionsCompleted,
        role: data.role,
      })
      navigate('/intro', { replace: true })
    } catch {
      showToast('등록되지 않은 사번이거나 이름이 일치하지 않습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page>
      <Background />
      <ContentArea>
        <TitleSection>
          <PageTitle>하고잡이</PageTitle>
          <PageDesc>OnlyOne Fair에 오신 것을 환영합니다.<br />로그인하여 참여해주세요.</PageDesc>
        </TitleSection>

        <CardWrapper>
          <GlowRing />
          <LoginCard onSubmit={handleSubmit}>
            <CardBadge>
              <BadgeIcon>🥚</BadgeIcon>
              <BadgeText>OnlyOne Fair 2024</BadgeText>
            </CardBadge>

            <LogoEmoji>🥚</LogoEmoji>

            <InputGroup>
              <Label>사번</Label>
              <Input
                type="text"
                placeholder="사번을 입력하세요"
                value={employeeId}
                onChange={e => setEmployeeId(e.target.value)}
                autoComplete="off"
              />
            </InputGroup>

            <InputGroup>
              <Label>이름</Label>
              <Input
                type="text"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="off"
              />
            </InputGroup>

            <LoginButton type="submit" disabled={loading}>
              {loading ? '로그인 중...' : '내 안의 가능성을 깨우러 가기'}
            </LoginButton>
          </LoginCard>
        </CardWrapper>
      </ContentArea>
    </Page>
  )
}

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
`

const Page = styled.div`
  min-height: 100dvh;
  max-width: 430px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #EEF2FF 0%, #E0E7FF 40%, #C7D2FE 100%);
`

const Background = styled.div`
  position: absolute;
  inset: 0;
  &::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(129, 140, 248, 0.3) 0%, transparent 70%);
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: ${pulse} 4s ease infinite;
  }
`

const ContentArea = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 0 24px;
`

const TitleSection = styled.div`
  padding-top: 60px;
  margin-bottom: 32px;
`

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #1E1B4B;
  margin-bottom: 8px;
`

const PageDesc = styled.p`
  font-size: 14px;
  color: #6366F1;
  line-height: 1.5;
`

const CardWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`

const GlowRing = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(165, 180, 252, 0.4) 0%, transparent 70%);
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
`

const LoginCard = styled.form`
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 28px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1), 0 2px 8px rgba(0, 0, 0, 0.04);
`

const CardBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: -4px;
`

const BadgeIcon = styled.span`
  font-size: 14px;
`

const BadgeText = styled.span`
  font-size: 12px;
  color: #8B8FA3;
`

const LogoEmoji = styled.div`
  font-size: 56px;
  margin: 4px 0 8px;
  animation: ${float} 3s ease infinite;
`

const InputGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #4B5563;
  padding-left: 2px;
`

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1.5px solid #E5E7EB;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  color: #1F2937;
  background: rgba(255, 255, 255, 0.8);
  outline: none;
  transition: all 0.15s;

  &:focus {
    border-color: #818CF8;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.15);
  }

  &::placeholder {
    color: #9CA3AF;
  }
`

const LoginButton = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 4px;
  background: #4F46E5;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
