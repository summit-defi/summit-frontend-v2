import React from 'react'
import styled from 'styled-components'
import { useExpeditionFetching } from 'state/hooks'
import Page from 'components/layout/Page'
import ExpeditionTotems from './components/ExpeditionTotems'
import PageLoader from 'components/PageLoader'
import ExpeditionEntryFlow from './components/ExpeditionEntryFlow'
import { useEnteredExpedition, useExpeditionLoaded } from 'state/hooksNew'
import ExpeditionCard from './components/ExpeditionCard'

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
  const expeditionEntered = useEnteredExpedition()
  const { expeditionLoaded } = useExpeditionLoaded()

  return (
    <StyledPage>
      <ExpeditionTotems/>

      { !expeditionLoaded && <PageLoader loadingText='Loading Expedition ...' /> }

      { expeditionLoaded &&
        <>
          { !expeditionEntered && <ExpeditionEntryFlow />}
          <ExpeditionCard/>
        </>
      }
      {/* <ExpeditionInfo/> */}
      {/* {totem != null && (
      )} */}
    </StyledPage>
  )
}

export default ExpeditionFarms
