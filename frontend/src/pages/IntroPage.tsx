import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/common/Button'

export default function IntroPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleStart = () => {
    navigate('/main', { replace: true })
  }

  return (
    <Page>
      <VideoArea>
        <VideoPlaceholder>
          <BigEmoji>🥚</BigEmoji>
          <VideoText>OnlyOne Fair 2024</VideoText>
        </VideoPlaceholder>
        <Overlay>
          <Question>"당신 안의 가능성을,<br/>이제 꺼낼 시간입니다."</Question>
        </Overlay>
      </VideoArea>

      <BottomArea>
        <Greeting>안녕하세요, <strong>{user?.name}</strong>님!</Greeting>
        <Description>
          5가지 미션을 달성하고<br />
          <Highlight>하고잡이</Highlight>로 성장하세요
        </Description>
        <Button fullWidth onClick={handleStart}>
          하고잡이의 여정을 시작하다
        </Button>
      </BottomArea>
    </Page>
  )
}

const fadeIn = keyframes`from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); }`

const Page = styled.div`
  min-height: 100dvh;
  max-width: 430px;
  margin: 0 auto;
  background: #0F172A;
  display: flex;
  flex-direction: column;
`

const VideoArea = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const VideoPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`

const BigEmoji = styled.div`
  font-size: 100px;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
`

const VideoText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.05em;
`

const Overlay = styled.div`
  position: absolute;
  bottom: 40px;
  left: 24px;
  right: 24px;
`

const Question = styled.p`
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  line-height: 1.5;
  animation: ${fadeIn} 1s ease;
`

const BottomArea = styled.div`
  background: #fff;
  border-radius: 24px 24px 0 0;
  padding: 28px 24px calc(24px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${fadeIn} 0.5s ease 0.3s both;
`

const Greeting = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const Description = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.5;
`

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
`
