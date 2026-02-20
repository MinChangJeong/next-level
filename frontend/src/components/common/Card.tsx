import styled from 'styled-components'

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
`

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 16px;
`

export const PageContainer = styled.div`
  min-height: 100dvh;
  max-width: 430px;
  margin: 0 auto;
  background: #F5F6F8;
  padding-bottom: 80px;
`

export const PageHeader = styled.header`
  background: #fff;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #F2F4F6;
  position: sticky;
  top: 0;
  z-index: 50;
`

export const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
  line-height: 1;
`

export const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`

export const Section = styled.section`
  padding: 20px 20px 0;
`

export default Card
