import React from 'react'
import { Flex, Text, SummitButton } from 'uikit'
import { elevationToUrl, elevationUtils } from 'config/constants'
import { Link } from 'react-router-dom'

interface Props {
  symbol: string
  getUrl?: string
}

const FarmCardDashboardElevationLinks: React.FC<Props> = ({ symbol, getUrl }) => {
  
  return (
    <Flex flexDirection='column' width='100%' gap='8px' mt='4px' alignItems='center' justifyContent='center'>
      <Text bold monospace small>OPEN {symbol} FARM AT:</Text>
      <Flex width='100%' gap='12px' flexWrap='wrap' alignItems='center' justifyContent='space-around'>
        { elevationUtils.all.map((elev) => {
          const tabTarget = `/${elevationToUrl[elev]}/${symbol.toLowerCase()}`
          return (
            <SummitButton
              key={elev}
              summitPalette={elev}
              as={Link}
              replace
              height='24px'
              width='160px'
              padding='0px'
              to={tabTarget}
            >
              THE {elev}
            </SummitButton>
          )
        })}
      </Flex>
      {/* { getUrl != null && <ExternalLinkButton summitPalette={Elevation.OASIS} href={getUrl}>
        Get {symbol}
      </ExternalLinkButton> } */}
    </Flex>
  )
}

export default React.memo(FarmCardDashboardElevationLinks)
