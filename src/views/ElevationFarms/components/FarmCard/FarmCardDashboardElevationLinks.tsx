import React, {  } from 'react'
import { Flex, Text, SummitButton } from 'uikit'
import { elevationToUrl, elevationUtils } from 'config/constants'

interface Props {
  symbol: string
}

const FarmCardDashboardElevationLinks: React.FC<Props> = ({ symbol }) => {

  
  
  return (
    <Flex flexDirection='column' width='100%' gap='8px' mt='4px' alignItems='center' justifyContent='center'>
      <Text bold monospace small>OPEN {symbol} FARM AT ELEVATION:</Text>
      <Flex width='100%' gap='12px' flexWrap='wrap' alignItems='center' justifyContent='space-around'>
        { elevationUtils.all.map((elev) => {
          const tabTarget = `/${elevationToUrl[elev]}/${symbol.toLowerCase()}`
          return (
            <SummitButton
              key={elev}
              onClick={() => null}
              summitPalette={elev}
              as="a"
              height='24px'
              width='150px'
              padding='0px'
              href={tabTarget}
            >
              {elev}
            </SummitButton>
          )
        })}
      </Flex>
    </Flex>
  )
}

export default React.memo(FarmCardDashboardElevationLinks)
