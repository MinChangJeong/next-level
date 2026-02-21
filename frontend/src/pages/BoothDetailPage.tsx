import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { boothService } from '../services/boothService'
import type { BoothDetail, Comment } from '../services/boothService'
import { useToast } from '../components/common/Toast'
import Button from '../components/common/Button'
import BottomSheet from '../components/common/BottomSheet'
import { BackButton, PageHeader, PageTitle } from '../components/common/Card'

export default function BoothDetailPage() {
  const { boothId = '' } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [booth, setBooth] = useState<BoothDetail | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [showCommentSheet, setShowCommentSheet] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [expectedEffect, setExpectedEffect] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      boothService.getDetail(boothId),
      boothService.getComments(boothId),
    ]).then(([boothData, commentsData]) => {
      setBooth(boothData)
      setComments(commentsData)
    }).finally(() => setLoading(false))
  }, [boothId])

  const handleSubmitComment = async () => {
    if (!suggestion.trim() || !expectedEffect.trim()) {
      showToast('제안 사항과 기대 효과를 모두 입력해주세요.', 'error')
      return
    }
    setSubmitting(true)
    try {
      const newComment = await boothService.addComment(boothId, suggestion, expectedEffect)
      setComments(prev => [newComment, ...prev])
      setSuggestion('')
      setExpectedEffect('')
      setShowCommentSheet(false)
      showToast('제안이 등록되었습니다!', 'success')
    } catch (err: any) {
      showToast(err.response?.data?.message ?? '오류가 발생했습니다.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !booth) {
    return <LoadingPage>불러오는 중...</LoadingPage>
  }

  return (
    <Page>
      <PageHeader>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
        <PageTitle>부스 상세</PageTitle>
      </PageHeader>

      <Content>
        {/* 기본 정보 카드 */}
        <InfoCard>
          <CardAccent />
          <CardBody>
            <BoothName>{booth.name}</BoothName>
            <ShortDesc>{booth.shortDescription}</ShortDesc>
            <MetaRow>
              <MetaBadge>📍 {booth.zone} · {booth.floor}</MetaBadge>
              <MetaBadge>👥 {booth.visitorCount}명 방문</MetaBadge>
            </MetaRow>
          </CardBody>
        </InfoCard>

        {/* 상세 설명 카드 */}
        <DetailCard>
          <CardAccent $color="linear-gradient(135deg, #4ECDC4, #2ECC71)" />
          <CardBody>
            <SectionLabel>아이디어 상세</SectionLabel>
            <DescText>{booth.longDescription}</DescText>
          </CardBody>
        </DetailCard>

        {/* ONLYONE 가치 */}
        {booth.onlyoneValue && (
          <ValueCard>
            <CardAccent $color="linear-gradient(135deg, #FDCB6E, #F39C12)" />
            <CardBody>
              <ValueLabel>ONLYONE적 가치</ValueLabel>
              <ValueText>{booth.onlyoneValue}</ValueText>
            </CardBody>
          </ValueCard>
        )}

        {/* 평가 버튼 */}
        {booth.visited && !booth.evaluated && (
          <Button fullWidth onClick={() => navigate(`/evaluate/${boothId}`)}>
            이 부스 평가하기
          </Button>
        )}

        {/* 제안 섹션 */}
        <SuggestionCard>
          <SuggestionHeader>
            <SectionLabel>아이디어 제안 ({comments.length})</SectionLabel>
            <AddButton onClick={() => setShowCommentSheet(true)}>+ 제안하기</AddButton>
          </SuggestionHeader>
          <ProposalHint>해당 제안은 부스에 전달됩니다</ProposalHint>

          {comments.length === 0 ? (
            <EmptyComment>첫 번째 제안을 남겨보세요!</EmptyComment>
          ) : (
            <CommentList>
              {comments.map(c => (
                <CommentCard key={c.commentId}>
                  <CommentAccent />
                  <CommentBody>
                    <CommentAuthor>{c.authorName}</CommentAuthor>
                    <CommentText>{c.suggestion}</CommentText>
                    <CommentEffect>기대효과: {c.expectedEffect}</CommentEffect>
                  </CommentBody>
                </CommentCard>
              ))}
            </CommentList>
          )}
        </SuggestionCard>
      </Content>

      <BottomSheet
        open={showCommentSheet}
        onClose={() => setShowCommentSheet(false)}
        title="아이디어 제안하기"
      >
        <SheetForm>
          <SheetLabel>제안 사항 ({suggestion.length}/150)</SheetLabel>
          <SheetTextarea
            placeholder="이 아이디어를 어떻게 발전시킬 수 있을까요? (최대 150자)"
            value={suggestion}
            onChange={e => setSuggestion(e.target.value.slice(0, 150))}
            rows={4}
          />
          <SheetLabel>기대 효과 ({expectedEffect.length}/50)</SheetLabel>
          <SheetInput
            placeholder="기대 효과를 입력해주세요 (최대 50자)"
            value={expectedEffect}
            onChange={e => setExpectedEffect(e.target.value.slice(0, 50))}
          />
          <HintText>해당 제안은 부스에 전달됩니다</HintText>
          <Button fullWidth loading={submitting} onClick={handleSubmitComment}>
            제안 등록하기
          </Button>
        </SheetForm>
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

const LoadingPage = styled.div`
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8B95A1;
`

const Content = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 40px;
`

const InfoCard = styled.div`
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`

const CardAccent = styled.div<{ $color?: string }>`
  width: 5px;
  flex-shrink: 0;
  background: ${({ $color }) => $color ?? 'linear-gradient(135deg, #6C5CE7, #A29BFE)'};
`

const CardBody = styled.div`
  flex: 1;
  padding: 18px 16px;
`

const BoothName = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 6px;
`

const ShortDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 12px;
  line-height: 1.5;
`

const MetaRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const MetaBadge = styled.span`
  font-size: 12px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 4px 10px;
  border-radius: 20px;
`

const DetailCard = styled.div`
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`

const SectionLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const DescText = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;
`

const ValueCard = styled.div`
  background: #FFFBEB;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  border: 1px solid #FDE68A;
`

const ValueLabel = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: #92400E;
  margin-bottom: 6px;
`

const ValueText = styled.p`
  font-size: 15px;
  color: #78350F;
  line-height: 1.5;
`

const SuggestionCard = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 18px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`

const SuggestionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`

const AddButton = styled.button`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
`

const ProposalHint = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.disabled};
  margin-bottom: 12px;
`

const EmptyComment = styled.p`
  text-align: center;
  padding: 20px 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const CommentCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 10px;
  overflow: hidden;
  display: flex;
`

const CommentAccent = styled.div`
  width: 3px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #74B9FF, #0984E3);
`

const CommentBody = styled.div`
  flex: 1;
  padding: 10px 12px;
`

const CommentAuthor = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 4px;
`

const CommentText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
  line-height: 1.4;
`

const CommentEffect = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
`

const SheetForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const SheetLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`

const SheetTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
  resize: none;
  outline: none;
  line-height: 1.5;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`

const SheetInput = styled.input`
  width: 100%;
  height: 46px;
  padding: 0 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
  outline: none;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`

const HintText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.disabled};
`
