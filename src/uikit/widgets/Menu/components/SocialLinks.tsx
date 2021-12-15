import React from 'react'
import { SvgProps } from '../../../components/Svg'
import Flex from '../../../components/Box/Flex'
import Link from '../../../components/Link/Link'
import * as IconModule from '../icons'
import { socials } from '../config'
import { pressableMixin } from 'uikit/util/styledMixins'
import styled from 'styled-components'

const Icons = (IconModule as unknown) as { [key: string]: React.FC<SvgProps> }

const StyledLink = styled(Link)`
  transition: all 200ms;
  ${pressableMixin}
`

const SocialLinks: React.FC = () => (
  <Flex>
    {socials.map((social, index) => {
      const Icon = Icons[social.icon]
      const iconProps = { width: '24px', color: 'textSubtle', style: { cursor: 'pointer' } }
      const mr = index < socials.length - 1 ? '24px' : 0
      return (
        <StyledLink external key={social.label} href={social.href} aria-label={social.label} mr={mr}>
          <Icon {...iconProps} />
        </StyledLink>
      )
    })}
  </Flex>
)

export default React.memo(SocialLinks, () => true)
