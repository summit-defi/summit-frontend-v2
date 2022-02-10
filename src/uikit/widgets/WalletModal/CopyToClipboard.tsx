import React, { useState } from 'react'
import styled from 'styled-components'
import { Text } from '../../components/Text/Text'
import { CopyIcon } from '../../components/Svg'
import { darken } from 'polished'
import { pressableMixin } from 'uikit/util/styledMixins'

interface Props {
  toCopy: string
}

const StyledCopyIcon = styled(CopyIcon)`
  fill: ${({ theme }) => darken(0.2, theme.colors.OASIS)};
  filter: drop-shadow(1px 1px 2px ${({ theme }) => theme.colors.OASIS});
`

const StyleButton = styled(Text).attrs({ role: 'button' })`
  position: relative;
  display: flex;
  align-items: center;
  color: ${({ theme }) => darken(0.2, theme.colors.OASIS)};

  ${pressableMixin}
`

const Tooltip = styled.div<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? 'block' : 'none')};
  position: absolute;
  bottom: -22px;
  right: 0;
  left: 0;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 8px;
  opacity: 0.7;
`

const CopyToClipboard: React.FC<Props> = ({ toCopy, children, ...props }) => {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

  return (
    <StyleButton
      small
      bold
      onClick={() => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(toCopy)
          setIsTooltipDisplayed(true)
          setTimeout(() => {
            setIsTooltipDisplayed(false)
          }, 1000)
        }
      }}
      {...props}
    >
      {children}
      <StyledCopyIcon width="20px" color="primary" ml="8px" />
      <Tooltip isTooltipDisplayed={isTooltipDisplayed}>Copied</Tooltip>
    </StyleButton>
  )
}

export default CopyToClipboard
