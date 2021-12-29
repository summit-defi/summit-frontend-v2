import React from 'react'
import styled from 'styled-components'
import { Flex, HighlightedText, Text } from 'uikit'
import { useSelectedElevation, useTotalValue } from 'state/hooks'
import { useUserTotalValue } from 'hooks/useUserTotalValue'
import { getBalanceNumber } from 'utils'
import CardValue from 'views/Home/components/CardValue'
import { Elevation } from 'config/constants/types'

const BackgroundedFlex = styled(Flex)`
  /* background-color: ${({ theme }) => theme.colors.background};
  max-width: 950px;
  margin: 36px auto;
  padding: 18px 18px;
  border-radius: 4px;
  box-shadow: 2px 2px 12px -4px rgba(25, 19, 38, 0.4), 2px 2px 8px rgba(25, 19, 38, 0.2); */

  height: 50px;
`

const StyledHighlightedText = styled(HighlightedText)<{ fontSize: string; letterSpacing: string }>`
  letter-spacing: ${({ letterSpacing }) => letterSpacing};
  font-weight: 900;
  font-size: ${({ fontSize }) => fontSize};
  text-shadow: none;
`

const ElevationAndUserVolumes: React.FC = () => {
  const elevation = useSelectedElevation()
  const elevationTotalValue = useTotalValue(elevation)
  const userTotalValue = useUserTotalValue(elevation)
  const rawUserStakedBalanceValue = getBalanceNumber(userTotalValue)
  return (
    <BackgroundedFlex flexDirection="column" alignItems="center" justifyContent="center" mb='32px'>
      <Flex justifyContent="center" alignItems="center" mt="0px">
        <StyledHighlightedText fontSize="13px" letterSpacing="2px">
          {elevation} TVL:
        </StyledHighlightedText>
        <CardValue
          value={elevationTotalValue.toNumber()}
          prefix="$"
          decimals={2}
          fontSize="24px"
          elevation={elevation}
        />
      </Flex>
      <Flex justifyContent="center" alignItems="center" mt="0px">
        <StyledHighlightedText fontSize="13px" letterSpacing="2px">
          DEPOSITED:
        </StyledHighlightedText>
        <CardValue
          value={rawUserStakedBalanceValue}
          prefix="$"
          decimals={2}
          fontSize="26px"
          elevation={elevation}
        />
      </Flex>
    </BackgroundedFlex>
  )
}

export default React.memo(ElevationAndUserVolumes)
