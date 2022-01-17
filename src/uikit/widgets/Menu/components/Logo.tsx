import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Flex from '../../../components/Box/Flex'
import { LogoIcon as LogoWithText } from '../icons'
import { Elevation } from 'config/constants/types'
import { pressableMixin } from 'uikit/util/styledMixins'

interface Props {
  isDark: boolean
  href: string
  elevation: Elevation | null
}

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 6px 0px;
  .desktop-icon {
    width: 177px;
    display: block;
  }
  transition: transform 0.2s;

  ${pressableMixin}
`

const Logo: React.FC<Props> = ({ isDark, href, elevation }) => {
  return (
    <StyledLink as="a" href={href} aria-label="Summit home page">
      <LogoWithText isDark={isDark} className="desktop-icon" elevation={elevation} />
    </StyledLink>
  )
}

export default React.memo(Logo, (prev, next) => prev.isDark === next.isDark && prev.elevation === next.elevation)
