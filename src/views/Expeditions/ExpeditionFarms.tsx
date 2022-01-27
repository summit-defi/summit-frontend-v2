import React from 'react'
import styled from 'styled-components'
import {
  useExpeditionFetching,
  useExpeditionEntered,
} from 'state/hooks'
import Page from 'components/layout/Page'
import ExpeditionTotems from './components/ExpeditionTotems'
import PageLoader from 'components/PageLoader'
import ExpeditionEntryFlow from './components/ExpeditionEntryFlow'
import { useExpeditionLoaded } from 'state/hooksNew'

const StyledPage = styled(Page)`
  padding-top: 48px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 80px;
    margin-top: -40px;
    padding-bottom: 64px;
  }
`

const ExpeditionFarms: React.FC = () => {
  useExpeditionFetching()
  const expeditionEntered = useExpeditionEntered()
  const { expeditionLoaded } = useExpeditionLoaded()

  return (
    <StyledPage>
      <ExpeditionTotems/>

      { !expeditionLoaded && <PageLoader loadingText='Loading Expedition ...' /> }

      { expeditionLoaded &&
        <>
          { !expeditionEntered && <ExpeditionEntryFlow />}
        </>
      }
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
