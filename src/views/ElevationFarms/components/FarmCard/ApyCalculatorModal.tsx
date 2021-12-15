import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Modal, Text, LinkExternal, Flex } from 'uikit'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { calculateSummitEarnedPerThousandDollars, apyModalRoi } from 'utils/compoundApyHelpers'
import { Address } from 'config/constants/types'

interface ApyCalculatorModalProps {
  onDismiss?: () => void
  symbol?: string
  summitPrice?: BigNumber
  apy?: BigNumber
  getUrl?: string
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, auto);
  margin-bottom: 24px;
`

const GridItem = styled.div`
  margin-bottom: '10px';
`

const Description = styled(Text)`
  max-width: 320px;
  margin-bottom: 28px;
`

const ApyCalculatorModal: React.FC<ApyCalculatorModalProps> = ({ onDismiss, symbol, summitPrice, apy, getUrl }) => {
  const farmApy = apy.times(new BigNumber(100)).toNumber()
  const oneThousandDollarsWorthOfSummit = 1000 / summitPrice.toNumber()

  const summitEarnedPerThousand1D = calculateSummitEarnedPerThousandDollars({ numberOfDays: 1, farmApy, summitPrice })
  const summitEarnedPerThousand7D = calculateSummitEarnedPerThousandDollars({ numberOfDays: 7, farmApy, summitPrice })
  const summitEarnedPerThousand30D = calculateSummitEarnedPerThousandDollars({ numberOfDays: 30, farmApy, summitPrice })
  const summitEarnedPerThousand365D = calculateSummitEarnedPerThousandDollars({
    numberOfDays: 365,
    farmApy,
    summitPrice,
  })

  return (
    <Modal title="ROI" onDismiss={onDismiss}>
      <Grid>
        <GridItem>
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase" mb="20px">
            Timeframe
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase" mb="20px">
            ROI
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase" mb="20px">
            SUMMIT per $1000
          </Text>
        </GridItem>
        {/* 1 day row */}
        <GridItem>
          <Text monospace>1d</Text>
        </GridItem>
        <GridItem>
          <Text monospace>
            {apyModalRoi({ amountEarned: summitEarnedPerThousand1D, amountInvested: oneThousandDollarsWorthOfSummit })}%
          </Text>
        </GridItem>
        <GridItem>
          <Text monospace>{summitEarnedPerThousand1D}</Text>
        </GridItem>
        {/* 7 day row */}
        <GridItem>
          <Text monospace>7d</Text>
        </GridItem>
        <GridItem>
          <Text monospace>
            {apyModalRoi({ amountEarned: summitEarnedPerThousand7D, amountInvested: oneThousandDollarsWorthOfSummit })}%
          </Text>
        </GridItem>
        <GridItem>
          <Text monospace>{summitEarnedPerThousand7D}</Text>
        </GridItem>
        {/* 30 day row */}
        <GridItem>
          <Text monospace>30d</Text>
        </GridItem>
        <GridItem>
          <Text monospace>
            {apyModalRoi({ amountEarned: summitEarnedPerThousand30D, amountInvested: oneThousandDollarsWorthOfSummit })}
            %
          </Text>
        </GridItem>
        <GridItem>
          <Text monospace>{summitEarnedPerThousand30D}</Text>
        </GridItem>
        {/* 365 day / APY row */}
        <GridItem>
          <Text monospace>365d(APY)</Text>
        </GridItem>
        <GridItem>
          <Text monospace>
            {apyModalRoi({
              amountEarned: summitEarnedPerThousand365D,
              amountInvested: oneThousandDollarsWorthOfSummit,
            })}
            %
          </Text>
        </GridItem>
        <GridItem>
          <Text monospace>{summitEarnedPerThousand365D}</Text>
        </GridItem>
      </Grid>
      <Flex justifyContent="center">
        <Description fontSize="12px" color="textSubtle">
          Calculated based on current rates. Compounding once daily. Rates are estimates provided for your convenience
          only, and by no means represent guaranteed returns.
        </Description>
      </Flex>
      {getUrl != null ||
        (getUrl != null && (
          <Flex justifyContent="center">
            <LinkExternal href={getUrl || getUrl}>Get {symbol}</LinkExternal>
          </Flex>
        ))}
    </Modal>
  )
}

export default ApyCalculatorModal
