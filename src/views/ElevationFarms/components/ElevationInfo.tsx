import React from 'react'
import { elevationUtils } from 'config/constants/types'
import { Flex, HighlightedText, ExternalLinkButton } from 'uikit'
import { useSelectedElevation } from 'state/hooks'

const ElevationInfo: React.FC = () => {
  const elevation = useSelectedElevation()
  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <HighlightedText summitPalette={elevation} monospace>
        {elevationUtils.subHeader(elevation)}
      </HighlightedText>
      <ExternalLinkButton mt="12px" summitPalette={elevation} href={elevationUtils.helpLink(elevation)}>
        FARMING AT THE {elevation}
      </ExternalLinkButton>
    </Flex>
  )
}

export default React.memo(ElevationInfo)
