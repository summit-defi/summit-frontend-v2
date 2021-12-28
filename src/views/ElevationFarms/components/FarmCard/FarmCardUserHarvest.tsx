import React, { useEffect } from 'react'
import { Flex, Text, HighlightedText } from 'uikit'
import { Elevation } from 'config/constants/types'
import { getBalanceNumber } from 'utils'
import CardValue from 'views/Home/components/CardValue'
import { useClaimPool } from 'hooks/useHarvest'
import SummitButton from 'uikit/components/Button/SummitButton'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

interface Props {
  farmToken: string
  earnedReward: BigNumber
  elevation: Elevation
  disabled: boolean
  setPending: (boolean) => void
}

const MobileVerticalFlex = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
`
const MobileHorizontalFlex = styled(Flex)`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.invNav} {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 24px;
    margin-bottom: 12px;
    width: 100%;
  }
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin-bottom: 12px;
  width: 100%;
`

const FarmCardUserHarvest: React.FC<Props> = ({ farmToken, earnedReward, elevation, setPending }) => {
  const rawEarned = getBalanceNumber(earnedReward)
  const earnLabel = 'SUMMIT'

  // HARVEST BUTTON
  const { onHarvest, pending: harvestPending } = useClaimPool(farmToken, elevation)
  const nothingToClaim = !earnedReward || earnedReward.isEqualTo(0)

  useEffect(() => {
    setPending(harvestPending)
  }, [harvestPending, setPending])

  return (
    <>
      <MobileVerticalFlex width="100%" mb="16px" mt="12px">
        <MobileHorizontalFlex>
          <Text fontSize="14px">Harvest:</Text>
          <Flex>
            <CardValue value={rawEarned} decimals={2} elevation={elevation} fontSize="28px" />
            <HighlightedText bold monospace ml="8px" elevation={elevation}>
              {earnLabel}
            </HighlightedText>
          </Flex>
        </MobileHorizontalFlex>

        <Flex flexDirection="column">
          <SummitButton
            elevation={elevation}
            isLoading={harvestPending}
            disabled={nothingToClaim}
            mr="8px"
            onClick={onHarvest}
          >
            HARVEST
          </SummitButton>
        </Flex>
      </MobileVerticalFlex>
      <Divider />
    </>
  )
}

export default FarmCardUserHarvest
