import React from 'react'
import styled from 'styled-components'
import { HighlightedText } from 'uikit'
import {
  useExpeditionLoaded,
  useExpeditionFetching,
  useExpeditionEntered,
} from 'state/hooks'
import Page from 'components/layout/Page'
import ExpeditionTotems from './components/ExpeditionTotems'
import PageLoader from 'components/PageLoader'
import ExpeditionEntryFlow from './components/ExpeditionEntryFlow'

const StyledPage = styled(Page)`
  padding-top: 48px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 80px;
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
