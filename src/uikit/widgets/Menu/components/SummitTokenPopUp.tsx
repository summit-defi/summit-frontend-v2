import React from 'react'
import { Text } from 'uikit/components/Text/Text'
import Flex from 'uikit/components/Box/Flex'
import ExternalLinkButton from 'uikit/components/Link/ExternalLinkButton'
import { BN_ZERO, getLinks } from 'config/constants'
import { linearGradient } from 'polished'
import styled from 'styled-components'
import { getFormattedBigNumber, getSummitTokenAddress } from 'utils'
import { useTotalSummitSupply, useBurnedSummitBalance } from 'hooks/useTokenBalance'
import { useEverestSummitLocked } from 'state/hooksNew'
import BigNumber from 'bignumber.js'

const InnerCard = styled.div<{ thin?: boolean }>`
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.selectorBackground};
  padding: 12px;
  height: 90px;
  width: ${({ thin }) => thin ? 140 : 160}px;
  align-items: flex-start;
  justify-content: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const AccountDot = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 22px;
  margin-right: 12px;
  background: ${linearGradient({
    colorStops: [
      '#154463',
      '#017B88',
      '#90B7B4',
    ],
    toDirection: '120deg',
  })};
`

interface Props {
  summitPriceUsd?: number
}

const SummitTokenPopUp: React.FC<Props> = ({ summitPriceUsd }) => {
  const { exchange, liquidity, summitTokenLink } = getLinks()
  const summitTokenAddress = getSummitTokenAddress()
  const totalSupply = useTotalSummitSupply()
  const burnedBalance = useBurnedSummitBalance()
  const everestSummitLocked = useEverestSummitLocked()
  const populatedSummitTokenLink = (summitTokenLink || '').replace('0xSUMMIT', summitTokenAddress)
  const populatedExchangeLink = (exchange || '').replace('0xSUMMIT', summitTokenAddress)
  const populatedLiquidityLink = (liquidity || '').replace('0xSUMMIT', summitTokenAddress)
  const marketCap = (summitPriceUsd ? new BigNumber(summitPriceUsd) : BN_ZERO).times(totalSupply ? totalSupply.minus(burnedBalance || BN_ZERO) : BN_ZERO)


  return (
    <Flex flexDirection='column' alignItems='center' justifyContent='center' gap='12px' minWidth='300px'>
      <Text bold monospace>SUMMIT Token</Text>
      <Flex gap='12px'>
        <InnerCard thin>
          <Text monospace mb='-12px'>Price</Text>
          <Text
              fontSize="20px"
              bold
              monospace
            >
              ${summitPriceUsd ? summitPriceUsd.toFixed(3) : 'XX.XX'}
            </Text>
        </InnerCard>
        <InnerCard>
          <ExternalLinkButton href={populatedExchangeLink}>BUY SUMMIT</ExternalLinkButton>
          <ExternalLinkButton href={populatedLiquidityLink}>ADD LIQUIDITY</ExternalLinkButton>
          <ExternalLinkButton href={populatedSummitTokenLink}>SUMMIT CHART</ExternalLinkButton>
        </InnerCard>
      </Flex>
      <Flex gap='12px'>
        <InnerCard thin>
          <Text monospace mb='-12px'>Market Cap</Text>
          <Text
              fontSize="20px"
              bold
              monospace
            >
              ${getFormattedBigNumber(marketCap)}
            </Text>
        </InnerCard>
        <InnerCard>
        <Text monospace mb='-12px'>Supply</Text>
          <Text
              fontSize="20px"
              bold
              monospace
            >
              {getFormattedBigNumber(totalSupply, 2)}
          </Text>
        </InnerCard>
      </Flex>

    </Flex>
  )
}

export default React.memo(SummitTokenPopUp)
