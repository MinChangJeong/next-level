import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { growthService } from '../services/growthService'
import { useToast } from '../components/common/Toast'
import Button from '../components/common/Button'
import { BackButton, PageHeader, PageTitle } from '../components/common/Card'

type Step = 'failure' | 'growth' | 'letter' | 'done'

const questions = [
  '"준비하는 과정에서 내가 가졌던 고집이나 편견이 깨졌던 순간이 있었나요?"',
  '"포기하고 싶던 순간, 나를 다시 일으켜 세운 건 무엇이었나요?"',
  '"동료와의 소통에서 가장 힘들었던 순간은 언제였나요?"',
]

export default function GrowthZonePage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [step, setStep] = useState<Step>('failure')
  const [failureText, setFailureText] = useState('')
  const [growthText, setGrowthText] = useState('')
  const [slowLetter, setSlowLetter] = useState('')
  const [currentQ] = useState(Math.floor(Math.random() * questions.length))
  const [loading, setLoading] = useState(false)
  const [disappearing, setDisappearing] = useState(false)

  const handleFailureNext = () => {
    if (!failureText.trim()) {
      showToast('실패 문구를 입력해주세요.', 'error')
      return
    }
    setDisappearing(true)
    setTimeout(() => {
      setDisappearing(false)
      setStep('growth')
    }, 800)
  }

  const handleGrowthNext = () => {
    if (!growthText.trim()) {
      showToast('성장 문구를 입력해주세요.', 'error')
      return
    }
    setStep('letter')
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      await growthService.complete(failureText, growthText, slowLetter)
      setStep('done')
    } catch (err: any) {
      showToast(err.response?.data?.message ?? '오류가 발생했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page>
      <PageHeader>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
        <PageTitle>성장 ZONE</PageTitle>
      </PageHeader>

      <Content>
        {step === 'failure' && (
          <StepCard>
            <StepBadge>사색 질문</StepBadge>
            <Question>{questions[currentQ]}</Question>
            <Divider />
            <StepTitle>실패와 마주하기</StepTitle>
            <StepDesc>과거의 실패나 어려움을 솔직하게 적어보세요.<br />작성 후 화면에서 사라집니다.</StepDesc>
            <Textarea
              placeholder="준비 과정에서 겪은 실패나 어려움을 적어보세요..."
              value={failureText}
              onChange={e => setFailureText(e.target.value)}
              rows={5}
              $disappearing={disappearing}
            />
            <Button fullWidth onClick={handleFailureNext}>
              날려보내기 ✈️
            </Button>
          </StepCard>
        )}

        {step === 'growth' && (
          <StepCard>
            <StepBadge>성장 문구</StepBadge>
            <StepTitle>그래서 나는 성장했다</StepTitle>
            <StepDesc>그 경험이 나를 어떻게 성장시켰는지 기록해주세요.</StepDesc>
            <Textarea
              placeholder="그 경험을 통해 나는..."
              value={growthText}
              onChange={e => setGrowthText(e.target.value)}
              rows={5}
              $disappearing={false}
            />
            <Button fullWidth onClick={handleGrowthNext}>
              다음 →
            </Button>
          </StepCard>
        )}

        {step === 'letter' && (
          <StepCard>
            <StepBadge>느린 편지함</StepBadge>
            <StepTitle>미래의 나에게</StepTitle>
            <StepDesc>1년 후의 나에게 보내는 편지를 써보세요. (선택)</StepDesc>
            <Textarea
              placeholder="사랑하는 미래의 나에게..."
              value={slowLetter}
              onChange={e => setSlowLetter(e.target.value)}
              rows={6}
              $disappearing={false}
            />
            <Button fullWidth loading={loading} onClick={handleComplete}>
              성장존 완료 🌱
            </Button>
            <Button fullWidth variant="ghost" onClick={handleComplete}>
              편지 건너뛰기
            </Button>
          </StepCard>
        )}

        {step === 'done' && (
          <DoneCard>
            <DoneEmoji>🌱</DoneEmoji>
            <DoneTitle>성장존 완료!</DoneTitle>
            <DoneDesc>
              "꿈을 원대하게" 미션을 달성했습니다.<br />
              당신의 성장 이야기가 기록되었습니다.
            </DoneDesc>
            <Button fullWidth onClick={() => navigate('/missions')}>
              미션 확인하기
            </Button>
          </DoneCard>
        )}
      </Content>
    </Page>
  )
}

const fadeOut = keyframes`
  to { opacity: 0; transform: translateY(-20px); }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`

const Page = styled.div`
  min-height: 100dvh;
  max-width: 430px;
  margin: 0 auto;
  background: #F5F6F8;
`

const Content = styled.div`
  padding: 20px;
`

const StepCard = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${fadeIn} 0.4s ease;
`

const StepBadge = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
`

const Question = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;
  font-style: italic;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #F2F4F6;
`

const StepTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`

const StepDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`

const Textarea = styled.textarea<{ $disappearing: boolean }>`
  width: 100%;
  padding: 14px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  resize: none;
  outline: none;
  line-height: 1.6;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
  animation: ${({ $disappearing }) => ($disappearing ? fadeOut : 'none')} 0.7s ease forwards;
`

const DoneCard = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease;
`

const DoneEmoji = styled.div`
  font-size: 72px;
`

const DoneTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`

const DoneDesc = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`
