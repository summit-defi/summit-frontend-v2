import React from 'react'
import Page from 'components/layout/Page'
import BetaTokenCard from './BetaTokenCard'
import styled from 'styled-components'
import { ElevationPuck, Flex, Text } from 'uikit'
import { getPriceableTokens, TokenSymbol } from 'config/constants'
import BetaRoundRollovers from './BetaRoundRollovers'

const BetaTokens = {
  [TokenSymbol.CAKE]: true,
  [TokenSymbol.USDC]: true,
  [TokenSymbol.BIFI]: true,
  [TokenSymbol.GS0]: true,
  [TokenSymbol.GS1]: true,
  [TokenSymbol.GS2]: true,
  [TokenSymbol.GS3]: true,
  [TokenSymbol.GS4]: true,
  [TokenSymbol.GS5]: true,
}

const TokenMintAmounts = {
  [TokenSymbol.CAKE]: 500,
  [TokenSymbol.USDC]: 1000,
  [TokenSymbol.BIFI]: 5,
  [TokenSymbol.GS0]: 2,
  [TokenSymbol.GS1]: 10,
  [TokenSymbol.GS2]: 50,
  [TokenSymbol.GS3]: 500,
  [TokenSymbol.GS4]: 1000,
  [TokenSymbol.GS5]: 20000,
}

const InfoCard = styled(Flex)`
  position: relative;
  z-index: 10;
  padding: 16px;
  padding-top: 124px;
  margin: 124px auto 32px auto;
  max-width: 650px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`

const BetaTokensList: React.FC = () => {
  const priceableTokens = getPriceableTokens()
  const betaTokens = Object.values(priceableTokens).filter((token) => BetaTokens[token.symbol] === true)

  return (
    <Page>
      <InfoCard>
        <ElevationPuck elevation='BASE'>
          <Text bold fontSize='24px' color='#CB0000'>
            BETA
          </Text>
        </ElevationPuck>
        <Text bold monospace small textAlign='center'>
          BETA test tokens and round rollovers are available below.
          <br/>
          The beta uses temporary values for many constants. Dont take the values as set in stone.
          <br/>
          <br/>
          The CAKE token is used as the SUMMIT V1 token
          <br/>
          for the purposes of testing the V1 to V2 SUMMIT swap.
          <br/>
        </Text>
      </InfoCard>
      <BetaRoundRollovers/>
      {betaTokens.map((betaToken) => (
        <BetaTokenCard
          key={betaToken.symbol}
          token={betaToken}
          mintAmount={TokenMintAmounts[betaToken.symbol]}
        />
      ))}
    </Page>
  )
}

export default BetaTokensList
