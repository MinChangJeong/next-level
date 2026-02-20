import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { evaluationService } from '../services/evaluationService'
import type { EvaluationPayload } from '../services/evaluationService'
import { useToast } from '../components/common/Toast'
import Button from '../components/common/Button'
import BottomSheet from '../components/common/BottomSheet'
import { BackButton, PageHeader, PageTitle } from '../components/common/Card'

const criteria = [
  { key: 'scoreFirst', label: '최초', desc: '업계 최초의 시도인가?' },
  { key: 'scoreBest', label: '최고', desc: '최고 수준의 품질인가?' },
  { key: 'scoreDiff', label: '차별화', desc: '기존과 얼마나 다른가?' },
  { key: 'scoreNo1', label: '일등', desc: '시장에서 1등이 될 수 있는가?' },
  { key: 'scoreGap', label: '초격차', desc: '경쟁사와 압도적 차이가 있는가?' },
  { key: 'scoreGlobal', label: '글로벌', desc: '세계 시장에서 통할 수 있는가?' },
] as const

type CriterionKey = typeof criteria[number]['key']

export default function EvaluatePage() {
  const { boothId = '' } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [scores, setScores] = useState<Record<CriterionKey, number>>({
    scoreFirst: 0, scoreBest: 0, scoreDiff: 0,
    scoreNo1: 0, scoreGap: 0, scoreGlobal: 0,
  })
  const [loading, setLoading] = useState(false)
  const [showReviewSheet, setShowReviewSheet] = useState(false)
  const [review, setReview] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)

  const allScored = Object.values(scores).every(v => v > 0)
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)

  const setScore = (key: CriterionKey, score: number) => {
    setScores(prev => ({ ...prev, [key]: score }))
  }

  const handleSubmitEval = async () => {
    if (!allScored) {
      showToast('모든 항목을 평가해주세요.', 'error')
      return
    }
    setLoading(true)
    try {
      await evaluationService.submit(boothId, scores as EvaluationPayload)
      showToast('평가가 완료되었습니다!', 'success')
      setShowReviewSheet(true)
    } catch (err: any) {
      showToast(err.response?.data?.message ?? '오류가 발생했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (review.trim().length < 30) {
      showToast('리뷰는 최소 30자 이상 작성해주세요.', 'error')
      return
    }
    setReviewLoading(true)
    try {
      await evaluationService.submitReview(boothId, review)
      showToast('리뷰가 등록되었습니다!', 'success')
      navigate(-1)
    } catch (err: any) {
      showToast(err.response?.data?.message ?? '오류가 발생했습니다.', 'error')
    } finally {
      setReviewLoading(false)
    }
  }

  return (
    <Page>
      <PageHeader>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
        <PageTitle>부스 평가</PageTitle>
      </PageHeader>

      <Content>
        <ScoreHeader>
          <TotalLabel>총점</TotalLabel>
          <TotalScore>{totalScore}</TotalScore>
          <TotalMax>/30</TotalMax>
        </ScoreHeader>

        {criteria.map(({ key, label, desc }) => (
          <CriterionCard key={key}>
            <CriterionInfo>
              <CriterionLabel>{label}</CriterionLabel>
              <CriterionDesc>{desc}</CriterionDesc>
            </CriterionInfo>
            <EggRow>
              {[1, 2, 3, 4, 5].map(n => (
                <EggBtn
                  key={n}
                  $active={scores[key] >= n}
                  onClick={() => setScore(key, n)}
                >
                  {scores[key] >= n ? '🥚' : '🩶'}
                </EggBtn>
              ))}
            </EggRow>
          </CriterionCard>
        ))}

        <Button
          fullWidth
          loading={loading}
          disabled={!allScored}
          onClick={handleSubmitEval}
        >
          평가 완료 ({totalScore}/30)
        </Button>
      </Content>

      <BottomSheet
        open={showReviewSheet}
        onClose={() => { setShowReviewSheet(false); navigate(-1) }}
        title="리뷰 작성하기 (선택)"
      >
        <ReviewForm>
          <ReviewHint>진정성 있는 리뷰를 남기면 미션 달성에 도움이 됩니다!</ReviewHint>
          <ReviewTextarea
            placeholder="이 부스에 대한 솔직한 감상을 남겨주세요. (최소 30자)"
            value={review}
            onChange={e => setReview(e.target.value)}
            rows={5}
          />
          <CharCount $enough={review.length >= 30}>
            {review.length}자 {review.length >= 30 ? '✓' : `(${30 - review.length}자 더 필요)`}
          </CharCount>
          <Button fullWidth loading={reviewLoading} onClick={handleSubmitReview} disabled={review.length < 30}>
            리뷰 등록하기
          </Button>
          <Button fullWidth variant="ghost" onClick={() => { setShowReviewSheet(false); navigate(-1) }}>
            건너뛰기
          </Button>
        </ReviewForm>
      </BottomSheet>
    </Page>
  )
}

const Page = styled.div`
  min-height: 100dvh;
  max-width: 430px;
  margin: 0 auto;
  background: #F5F6F8;
`

const Content = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 32px;
`

const ScoreHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  padding: 20px 0;
  background: #fff;
  border-radius: 16px;
`

const TotalLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const TotalScore = styled.span`
  font-size: 40px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`

const TotalMax = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const CriterionCard = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const CriterionInfo = styled.div`
  flex: 1;
`

const CriterionLabel = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`

const CriterionDesc = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const EggRow = styled.div`
  display: flex;
  gap: 6px;
`

const tap = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.85); }
`

const EggBtn = styled.button<{ $active: boolean }>`
  font-size: 26px;
  background: none;
  border: none;
  cursor: pointer;
  line-height: 1;
  padding: 2px;
  transition: all 0.1s;

  &:active { animation: ${tap} 0.2s ease; }
`

const ReviewForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ReviewHint = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.surface};
  padding: 10px 14px;
  border-radius: 10px;
`

const ReviewTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
  resize: none;
  outline: none;
  line-height: 1.6;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`

const CharCount = styled.p<{ $enough: boolean }>`
  font-size: 13px;
  color: ${({ $enough, theme }) => ($enough ? '#16A34A' : theme.colors.text.secondary)};
  text-align: right;
`
