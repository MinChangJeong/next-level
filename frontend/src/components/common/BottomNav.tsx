import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'

const tabs = [
  { path: '/main', label: '홈', icon: '🏠' },
  { path: '/booths', label: '부스', icon: '🎪' },
  { path: '/missions', label: '미션', icon: '🥚' },
  { path: '/shop', label: '상점', icon: '🛒' },
  { path: '/qr', label: 'QR', icon: '📱' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Nav>
      {tabs.map(tab => {
        const active = location.pathname === tab.path
        return (
          <NavItem key={tab.path} $active={active} onClick={() => navigate(tab.path)}>
            <NavIcon>{tab.icon}</NavIcon>
            <NavLabel $active={active}>{tab.label}</NavLabel>
          </NavItem>
        )
      })}
    </Nav>
  )
}

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  background: #fff;
  border-top: 1px solid #F2F4F6;
  display: flex;
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  z-index: 100;
`

const NavItem = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  opacity: ${({ $active }) => ($active ? 1 : 0.45)};
  transition: opacity 0.15s;
`

const NavIcon = styled.span`
  font-size: 22px;
  line-height: 1;
`

const NavLabel = styled.span<{ $active: boolean }>`
  font-size: 10px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.text.secondary)};
`
