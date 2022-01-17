import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { HighlightedText, Text, Flex } from 'uikit'
import {
  useExpedition,
  useElevationTotem,
  useElevationLocked,
  useIsElevationLockedUntilRollover,
  useExpeditionDivider,
  useExpeditionPotTotalValue,
  useExpeditionDisbursedValue,
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

const StyledPage = styled(Page)`
  padding-top: 48px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 0px;
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
  const { account } = useWallet()
  const locked = useElevationLocked(Elevation.EXPEDITION)
  const expeditionPotTotalValue = useExpeditionPotTotalValue()
  const expeditionDisbursedValue = useExpeditionDisbursedValue()
  const expeditionLocked = useIsElevationLockedUntilRollover()
  const { expedition, userData } = useExpedition(account)
  const totem = useElevationTotem(Elevation.EXPEDITION)
  const deityDivider = useExpeditionDivider()
  const expeditionsLoaded = true

  return null

  // return (
  //   <StyledPage>
  //     <HighlightedText elevation={Elevation.EXPEDITION} header mb="24px">
  //       THE EXPEDITION
  //     </HighlightedText>

  //     <ExpeditionTotems totem={totem} expedition={activeExpedition} deityDivider={deityDivider} />


  //     { (upcomingExpedition == null && activeExpedition == null) && <>
  //       <StyledHighlightedText fontSize="16px" letterSpacing="2px" mb='8px'>
  //         EXPEDITION TREASURY:
  //       </StyledHighlightedText>
  //       <CardValue
  //         value={expeditionPotTotalValue}
  //         prefix="$"
  //         decimals={2}
  //         fontSize="40px"
  //         gold
  //         elevation={Elevation.OASIS}
  //       />
  //       <StyledHighlightedText fontSize="14px" letterSpacing="2px" mt='8px' mb='0px'>
  //         DISBURSED TO DATE:
  //       </StyledHighlightedText>
  //       <CardValue
  //         value={expeditionDisbursedValue}
  //         prefix="$"
  //         decimals={2}
  //         fontSize="26px"
  //         gold
  //         elevation={Elevation.OASIS}
  //       />
  //       <Text textAlign='center' bold monospace italic mt='8px' fontSize='16px'>
  //           100% of the Expedition Treasury
  //           <br/>
  //           will be given back exclusively to
  //           <br/>
  //           SUMMIT and {getSummitLpSymbol()} holders
  //         </Text>


  //       <Text bold monospace textAlign='center'><br/><br/>. . .<br/><br/></Text>

  //       <ElevationFarmingExplanation />
  //     </>}

  //     {/* <Text bold monospace textAlign='center'><br/><br/>. . .<br/></Text>

  //     <Flex flexDirection='column' justifyContent='flex-start' maxWidth='500px' margin='36px auto'>
  //       <Text bold monospace fontSize='16px'>How Expeditions work:</Text>
  //       <br/>
  //       <Text bold monospace italic>1. Choose your Deity above.</Text>
  //       <br/>
  //       <Text bold monospace italic>2. Deposit your SUMMIT and {getSummitLpSymbol()} to participate. You MUST be deposited at the end of the round for your funds to count.</Text>
  //       <br/>
  //       <Text bold monospace italic>3. The combined USD value of your SUMMIT and {getSummitLpSymbol()} will determine your % of the pot you can win.</Text>
  //     </Flex> */}

  //     {((!locked && totem == null) || !expeditionsLoaded) && <PageLoader fill={false} />}
  //     {/* <ExpeditionInfo/> */}
  //     {totem != null && (
  //       <FlexLayout>
  //         {activeExpedition != null &&
  //           <ExpeditionCard
  //             expedition={activeExpedition}
  //             expeditionLocked={expeditionLocked}
  //             summitAllowance={summitAllowance}
  //             summitLpAllowance={summitLpAllowance}
  //             summitBalance={summitBalance}
  //             summitLpBalance={summitLpBalance}
  //           />
  //         }
  //       </FlexLayout>
  //     )}
  //   </StyledPage>
  // )
}

export default ExpeditionFarms
