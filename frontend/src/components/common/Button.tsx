import type { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  loading = false,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? '...' : children}
    </StyledButton>
  )
}

const StyledButton = styled.button<{
  $variant: string
  $size: string
  $fullWidth: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ $size }) =>
    $size === 'lg'
      ? 'padding: 16px 24px; font-size: 16px; height: 52px;'
      : $size === 'md'
      ? 'padding: 12px 20px; font-size: 15px; height: 44px;'
      : 'padding: 8px 16px; font-size: 13px; height: 36px;'}

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? `
        background: ${theme.colors.primary};
        color: #fff;
        &:active { background: ${theme.colors.primaryHover}; transform: scale(0.98); }
        &:disabled { background: ${theme.colors.border}; color: ${theme.colors.text.disabled}; cursor: not-allowed; transform: none; }
      `
      : $variant === 'secondary'
      ? `
        background: ${theme.colors.surface};
        color: ${theme.colors.text.primary};
        border: 1px solid ${theme.colors.border};
        &:active { background: ${theme.colors.border}; }
        &:disabled { opacity: 0.5; cursor: not-allowed; }
      `
      : `
        background: transparent;
        color: ${theme.colors.primary};
        &:active { opacity: 0.7; }
        &:disabled { opacity: 0.5; cursor: not-allowed; }
      `}
`
