import { Elevation } from 'config/constants/types'
import { Login } from '../WalletModal/types'

export interface LangType {
  code: string
  language: string
}

export interface Profile {
  username?: string
  image?: string
  profileLink: string
  noProfileLink: string
  showPip?: boolean
}

export interface PushedProps {
  isPushed: boolean
  pushNav: (isPushed: boolean) => void
}

export interface NavTheme {
  background: string
  hover: string
}

export interface MenuEntry {
  gap?: boolean
  label?: string
  palette?: string
  icon?: string
  href: string
  external?: boolean
  calloutClass?: string
  initialOpenState?: boolean
  disabled?: boolean
  elevation?: Elevation
  neverHighlight?: boolean
  keyPaths?: string[]
}

export interface PanelProps {
  isDark: boolean
  toggleTheme: () => void
  currentLang: string
  links: Array<MenuEntry>
  additionals: Array<MenuEntry>
}

export interface NavProps extends PanelProps {
  account?: string
  login: Login
  profile?: Profile
  logout: () => void
  summitPriceUsd?: number
}
