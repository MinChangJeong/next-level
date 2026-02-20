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

      {/* 부스 이미지 */}
      <ImageArea>
        {booth.imageUrl
          ? <img src={booth.imageUrl} alt={booth.name} />
          : <ImagePlaceholder>🎪</ImagePlaceholder>
        }
      </ImageArea>

      <Content>
        {/* 기본 정보 */}
        <InfoCard>
          <BoothName>{booth.name}</BoothName>
          <ShortDesc>{booth.shortDescription}</ShortDesc>
          <MetaRow>
            <MetaBadge>📍 {booth.zone} · {booth.floor}</MetaBadge>
            <MetaBadge>👥 {booth.visitorCount}명 방문</MetaBadge>
          </MetaRow>
        </InfoCard>

        {/* 상세 설명 */}
        <DescCard>
          <SectionLabel>아이디어 상세</SectionLabel>
          <DescText>{booth.longDescription}</DescText>
        </DescCard>

        {/* ONLYONE 가치 */}
        {booth.onlyoneValue && (
          <ValueCard>
            <ValueLabel>⭐ ONLYONE적 가치</ValueLabel>
            <ValueText>{booth.onlyoneValue}</ValueText>
          </ValueCard>
        )}

        {/* 평가 버튼 */}
        {booth.visited && !booth.evaluated && (
          <Button fullWidth onClick={() => navigate(`/evaluate/${boothId}`)}>
            이 부스 평가하기
          </Button>
        )}

        {/* 제안 섹션 */}
        <CommentSection>
          <CommentHeader>
            <SectionLabel>아이디어 제안 ({comments.length})</SectionLabel>
            <AddButton onClick={() => setShowCommentSheet(true)}>+ 제안하기</AddButton>
          </CommentHeader>
          <ProposalHint>💌 해당 제안은 부스에 전달됩니다</ProposalHint>

          {comments.length === 0 ? (
            <EmptyComment>첫 번째 제안을 남겨보세요!</EmptyComment>
          ) : (
            comments.map(c => (
              <CommentCard key={c.commentId}>
                <CommentAuthor>{c.authorName}</CommentAuthor>
                <CommentText>💡 {c.suggestion}</CommentText>
                <CommentEffect>✨ {c.expectedEffect}</CommentEffect>
              </CommentCard>
            ))
          )}
        </CommentSection>
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
          <HintText>💌 해당 제안은 부스에 전달됩니다</HintText>
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

const ImageArea = styled.div`
  height: 220px;
  background: #E8EAED;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img { width: 100%; height: 100%; object-fit: cover; }
`

const ImagePlaceholder = styled.span`
  font-size: 60px;
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
  border-radius: 16px;
  padding: 20px;
`

const BoothName = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`

const ShortDesc = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 12px;
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

const DescCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
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
  border-radius: 16px;
  padding: 16px 20px;
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

const CommentSection = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
`

const CommentHeader = styled.div`
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

const CommentCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 8px;
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
