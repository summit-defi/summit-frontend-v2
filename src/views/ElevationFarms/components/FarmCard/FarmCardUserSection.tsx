import React from 'react'
import styled from 'styled-components'
import { Flex } from 'uikit'
import { Elevation } from 'config/constants/types'
import FarmCardTokenSection from './FarmCardTokenSection'
import FarmCardUserInteractionSection from './FarmCardUserInteractionSection'
import { useSelectedElevation } from 'state/hooks'

const ExpandableSection = styled(Flex)<{ isExpanded: boolean, elevation?: Elevation }>`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 300ms;
  overflow: hidden;
  padding-left: 24px;
  padding-right: 24px;
  max-height: ${({ isExpanded, elevation }) => (isExpanded ? (elevation == null ? '171px' : '500px') : '0px')};
  opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
`

const BottomPadding = styled.div`
  width: 100px;
  height: 24px;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin-bottom: 12px;
  width: 100%;
`
interface Props {
  isExpanded: boolean
  symbol: string
}

const FarmCardUserSection: React.FC<Props> = ({ isExpanded, symbol }) => {
  const elevation = useSelectedElevation()

  return (
    <ExpandableSection isExpanded={isExpanded} elevation={elevation}>
      <Divider />
      <FarmCardTokenSection
        symbol={symbol}
      />
      { elevation != null && 
        <>
          <Divider/>
          <FarmCardUserInteractionSection
            symbol={symbol}
          />
          <BottomPadding/>
        </>
      }
    </ExpandableSection>
  )
}

export default React.memo(FarmCardUserSection)
