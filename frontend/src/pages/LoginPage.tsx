import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import { useToast } from '../components/common/Toast'
import Button from '../components/common/Button'

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
      <LogoArea>
        <LogoEmoji>🥚</LogoEmoji>
        <AppName>하고잡이</AppName>
        <SubTitle>OnlyOne Fair 2024</SubTitle>
      </LogoArea>

      <Form onSubmit={handleSubmit}>
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

        <BottomArea>
          <Button type="submit" fullWidth loading={loading}>
            내 안의 가능성을 깨우러 가기
          </Button>
        </BottomArea>
      </Form>
    </Page>
  )
}

const Page = styled.div`
  min-height: 100dvh;
  max-width: 430px;
  margin: 0 auto;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 0 24px;
`

const LogoArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
  padding-bottom: 48px;
`

const LogoEmoji = styled.div`
  font-size: 72px;
  margin-bottom: 16px;
  animation: pulse 2s ease infinite;

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`

const AppName = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`

const SubTitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 40px;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Input = styled.input`
  height: 52px;
  padding: 0 16px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.surface};
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    background: #fff;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`

const BottomArea = styled.div`
  margin-top: 8px;
`
