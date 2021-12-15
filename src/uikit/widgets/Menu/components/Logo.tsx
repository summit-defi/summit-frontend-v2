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
  background-color: ${({ theme }) => theme.colors.background};
  padding: 6px 16px;
  border-radius: 50px;
  .desktop-icon {
    width: 230px;
    display: block;
  }
  box-shadow: 3px 3px 6px black;
  transition: transform 0.2s;

  ${pressableMixin}
`

const Logo: React.FC<Props> = ({ isDark, href, elevation }) => {
  return (
    <Flex>
      <StyledLink as="a" href={href} aria-label="Summit home page">
        <LogoWithText isDark={isDark} className="desktop-icon" elevation={elevation} />
      </StyledLink>
    </Flex>
  )
}

export default React.memo(Logo, (prev, next) => prev.isDark === next.isDark && prev.elevation === next.elevation)
