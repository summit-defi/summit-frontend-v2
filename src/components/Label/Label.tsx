import React from 'react'
import styled from 'styled-components'

interface LabelProps {
  text?: string
  live?: boolean
}

const Label: React.FC<LabelProps> = ({ text, live = true }) => <StyledLabel live={live}>{text}</StyledLabel>

const StyledLabel = styled.div<{ live: boolean }>`
  color: ${({ live, theme }) => theme.colors[live ? 'primary' : 'textDisabled']};
  font-size: 14px;
`

export default Label
