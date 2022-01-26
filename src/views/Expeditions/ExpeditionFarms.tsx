import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { HighlightedText, Text, Flex } from 'uikit'
import {
  useExpeditionInfo,
  useElevationTotem,
  useElevationLocked,
  useIsElevationLockedUntilRollover,
  useExpeditionDivider,
  useExpeditionPotTotalValue,
  useExpeditionDisbursedValue,
  useExpeditionLoaded,
  useExpeditionFetching,
  useExpeditionEntered,
} from 'state/hooks'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import ExpeditionCard from './components/ExpeditionCard'
import ExpeditionTotems from './components/ExpeditionTotems'
import { Elevation } from 'config/constants/types'
import PageLoader from 'components/PageLoader'
import UpcomingExpeditionCard from './components/UpcomingExpeditionCard'
import ElevationFarmingExplanation from 'views/ElevationFarms/components/ElevationIntroduction'
import { getSummitLpSymbol } from 'config/constants'
import CardValue from 'views/Home/components/CardValue'
import ExpiredExpedition from './components/ExpiredExpedition'
import ExpeditionEntryFlow from './components/ExpeditionEntryFlow'

const StyledPage = styled(Page)`
  padding-top: 48px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 64px;
    margin-top: -40px;
    padding-bottom: 64px;
  }
`


const StyledHighlightedText = styled(HighlightedText)<{ fontSize: string; letterSpacing: string }>`
letter-spacing: ${({ letterSpacing }) => letterSpacing};
font-weight: 900;
font-size: ${({ fontSize }) => fontSize};
text-shadow: none;
`

const ExpeditionFarms: React.FC = () => {
  useExpeditionFetching()
  const expeditionEntered = useExpeditionEntered()
  const { expeditionLoaded } = useExpeditionLoaded()

  return (
    <StyledPage>
      <ExpeditionTotems/>

      { !expeditionLoaded && <PageLoader fill loadingText='Loading Expedition ...' /> }

      <ExpeditionEntryFlow/>

      {/* { expeditionLoaded &&
        <>
          { !expeditionEntered && <ExpeditionEntryFlow />}
        </>
      } */}
      {/* <ExpeditionInfo/> */}
      {/* {totem != null && (
        <FlexLayout>
            <ExpeditionCard
              expedition={activeExpedition}
              expeditionLocked={expeditionLocked}
              summitAllowance={summitAllowance}
              summitLpAllowance={summitLpAllowance}
              summitBalance={summitBalance}
              summitLpBalance={summitLpBalance}
            />
        </FlexLayout>
      )} */}
    </StyledPage>
  )
}

export default ExpeditionFarms
