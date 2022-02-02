import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Elevation } from 'config/constants/types'
import FarmCardTokenSection from './FarmCardTokenSection'
import FarmCardUserInteractionSection from './FarmCardUserInteractionSection'
import { useSelectedElevation } from 'state/hooks'
import useVisibility from 'hooks/useVisibility'

const ExpandableSection = styled.div<{ isExpanded: boolean, elevation?: Elevation }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 300ms;
  overflow: hidden;
  padding-left: 24px;
  padding-right: 24px;
  max-height: ${({ isExpanded, elevation }) => (isExpanded ? (elevation == null ? '250px' : '600px') : '0px')};
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
  const [isVisible, currentElement] = useVisibility<HTMLDivElement>()
  const elevation = useSelectedElevation()
  const [currentElev, setCurrentElev] = useState(elevation)

  useEffect(
    () => {
      if (currentElement && currentElev !== elevation && isVisible) {
        setCurrentElev(elevation)
        currentElement.current.scrollIntoView({
          block: 'center',
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [elevation, isVisible, currentElement]
  )



  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    setExpanded(isExpanded)
  }, [isExpanded, setExpanded])

  return (
    <ExpandableSection ref={currentElement} isExpanded={expanded} elevation={elevation}>
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
