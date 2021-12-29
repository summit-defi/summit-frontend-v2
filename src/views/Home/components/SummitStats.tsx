import React from 'react'
import { Card, CardBody, Flex, HighlightedText, Text } from 'uikit'
import BigNumber from 'bignumber.js/bignumber'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSummitSupply, useBurnedSummitBalance } from 'hooks/useTokenBalance'
import CardValue from './CardValue'
import { useSummitPrice } from '../../../state/hooks'
import { Elevation } from 'config/constants/types'
import { useSummitPerSecond } from 'utils'
import SummitSupplyDoughnut from './SummitSupplyDoughnut'
import SummitEmissionDoughnut from './SummitEmissionDoughnut'

const StyledSummitStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const SummitStats = () => {
  const totalSupply = useTotalSummitSupply()
  const burnedBalance = useBurnedSummitBalance()
  const summitPrice = useSummitPrice()
  const farm = useSummitPerSecond()
  const treasury = farm.times(200).div(1000)
  const totalSummitPerSecond = farm.plus(treasury)
  const farmPerc = farm.div(totalSummitPerSecond).times(100).toNumber()
  const treasuryPerc = treasury.div(totalSummitPerSecond).times(100).toNumber()
  const circSupply = totalSupply ? totalSupply.minus(burnedBalance) : new BigNumber(0)
  const summitSupply = getBalanceNumber(circSupply)
  const burnedSupply = getBalanceNumber(burnedBalance)
  const marketCap = (summitPrice || new BigNumber(0)).times(circSupply)

  return (
    <StyledSummitStats>
      <CardBody>
        <HighlightedText header mb="24px">
          SUMMIT STATS
        </HighlightedText>
        <Row>
          <Text fontSize="14px">Circulating SUMMIT Supply</Text>
          {summitSupply && <CardValue fontSize="14px" value={summitSupply} decimals={0} elevation={Elevation.OASIS} />}
        </Row>
        <Row>
          <Text fontSize="14px">Market Cap</Text>
          <CardValue
            fontSize="14px"
            value={getBalanceNumber(marketCap)}
            decimals={0}
            prefix="$"
            elevation={Elevation.OASIS}
          />
        </Row>
        <Row>
          <Text fontSize="14px">Total SUMMIT Burned</Text>
          <CardValue fontSize="14px" value={getBalanceNumber(burnedBalance)} decimals={0} elevation={Elevation.OASIS} />
        </Row>
        <Row>
          <Text fontSize="14px">SUMMIT minted per second</Text>
          <Text bold italic fontSize="14px">
            {totalSummitPerSecond.div(new BigNumber(10).pow(18)).toString()}
          </Text>
        </Row>
        <Flex width="100%" justifyContent="space-around" mt="36px">
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <Text textAlign="center" bold monospace>
              SUMMIT Emission
              <br />
              Breakdown
            </Text>
            <SummitEmissionDoughnut
              poolEmission={farmPerc}
              treasuryEmission={treasuryPerc}
            />
          </Flex>
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <Text textAlign="center" bold monospace>
              SUMMIT Supply
              <br />
              Breakdown
            </Text>
            <SummitSupplyDoughnut circSupply={summitSupply} burnedSupply={burnedSupply} />
          </Flex>
        </Flex>
      </CardBody>
    </StyledSummitStats>
  )
}

export default SummitStats
