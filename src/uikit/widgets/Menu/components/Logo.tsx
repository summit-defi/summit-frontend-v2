import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Flex from '../../../components/Box/Flex'
import { LogoIcon as LogoWithText } from '../icons'
import { SummitPalette } from 'config/constants/types'
import { pressableMixin } from 'uikit/util/styledMixins'

interface Props {
  isDark: boolean
  href: string
  summitPalette: SummitPalette | null
}

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 6px 0px;
  flex-grow: 1;
  flex-shrink: 2;
  max-width: 408px;
  .desktop-icon {
    width: 177px;
    display: block;
  }
  transition: transform 0.2s;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.nav} {
    justify-content: flex-start;
  }

  ${pressableMixin}
`

const Logo: React.FC<Props> = ({ isDark, href, summitPalette }) => {
  return (
    <StyledLink as="a" href={href} aria-label="Summit home page">
      <LogoWithText isDark={isDark} className="desktop-icon" summitPalette={summitPalette} />
    </StyledLink>
  )
}

export default React.memo(Logo, (prev, next) => prev.isDark === next.isDark && prev.summitPalette === next.summitPalette)
