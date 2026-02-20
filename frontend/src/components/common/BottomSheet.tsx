import { type ReactNode, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <>
      <Overlay onClick={onClose} />
      <Sheet>
        <Handle />
        {title && <SheetTitle>{title}</SheetTitle>}
        <SheetContent>{children}</SheetContent>
      </Sheet>
    </>
  )
}

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`
const slideUp = keyframes`from { transform: translateY(100%); } to { transform: translateY(0); }`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
  animation: ${fadeIn} 0.2s ease;
`

const Sheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding: 12px 20px calc(20px + env(safe-area-inset-bottom));
  z-index: 201;
  animation: ${slideUp} 0.3s ease;
  max-height: 90dvh;
  overflow-y: auto;
`

const Handle = styled.div`
  width: 36px;
  height: 4px;
  background: #D1D6DB;
  border-radius: 2px;
  margin: 0 auto 16px;
`

const SheetTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 20px;
`

const SheetContent = styled.div``
