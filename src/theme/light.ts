import { DefaultTheme } from 'styled-components'
import { light as lightAlert } from '../uikit/components/Alert/theme'
import { light as lightCard } from '../uikit/components/Card/theme'
import { light as lightRadio } from '../uikit/components/Radio/theme'
import { light as lightToggle } from '../uikit/components/Toggle/theme'
import { light as lightTooltip } from '../uikit/components/Tooltip/theme'
import { light as lightNav } from '../uikit/widgets/Menu/theme'
import { light as lightModal } from '../uikit/widgets/Modal/theme'
import base from './base'
import { lightColors } from './colors'

const lightTheme: DefaultTheme = {
  ...base,
  isDark: false,
  alert: lightAlert,
  colors: lightColors,
  card: lightCard,
  toggle: lightToggle,
  nav: lightNav,
  modal: lightModal,
  radio: lightRadio,
  tooltip: lightTooltip,
}

export default lightTheme
