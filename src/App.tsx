import React, { useEffect, Suspense, lazy } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { ResetCSS } from 'uikit'
import BigNumber from 'bignumber.js'
import { useFetchPriceList, useFetchPublicData, useFetchSummitEnabled } from 'state/hooks'
import { elevationUtils } from 'config/constants/types'
import useGetDocumentTitlePrice from './hooks/useGetDocumentTitlePrice'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import PageLoader from './components/PageLoader'
import { fetchFarmUserDataAsync } from 'state/farms'
import useWeb3 from 'hooks/useWeb3'
import { fetchRolloverRewardInNativeTokenAsync, fetchUserTotemsAsync, setActiveAccount } from 'state/summitEcosystem'
import ElevationBackground from 'components/ElevationBackground'
import styled from 'styled-components'
import ExpeditionBackground from 'components/ExpeditionBackground'
import { ToastListener } from 'contexts/ToastsContext'
import { useRoundRollovers } from 'hooks/useRoundRollovers'
import PageForcedDarkComponent from 'PageForcedDarkComponent'
import { useFetchExpeditionPotTotalValue } from 'hooks/useFetchExpeditionPotTotalValue'
import { fetchTokensUserDataAsync } from 'state/tokens'

const Home = lazy(() => import('./views/Home'))
const ElevationFarms = lazy(() => import('./views/ElevationFarms'))
const Glacier = lazy(() => import('./views/Glacier'))
const ExpeditionFarms = lazy(() => import('./views/Expeditions'))
const NotFound = lazy(() => import('./views/NotFound'))
const BetaTokens = lazy(() => import('./views/Beta'))

const StyledRouter = styled(Router)`
  position: relative;
`

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  const { account, connect } = useWallet()
  useEffect(() => {
    if (!account && window.localStorage.getItem('connectorId')) {
      connect('injected')
    }
  }, [account, connect])

  const dispatch = useDispatch()
  const web3 = useWeb3()
  useEffect(() => {
    if (account) {
      dispatch(setActiveAccount(account))
      dispatch(fetchFarmUserDataAsync(account))
      dispatch(fetchUserTotemsAsync(account))
      dispatch(fetchTokensUserDataAsync(account))
      dispatch(fetchRolloverRewardInNativeTokenAsync())
    }
  }, [account, dispatch, web3])

  useFetchPublicData()
  useFetchPriceList()
  useGetDocumentTitlePrice()
  useRoundRollovers()
  useFetchSummitEnabled()
  useFetchExpeditionPotTotalValue()

  return (
    <StyledRouter>
      <ResetCSS />
      <GlobalStyle />
      <ElevationBackground />
      <ExpeditionBackground />
      <PageForcedDarkComponent />
      <Menu>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path='/beta' exact>
              <BetaTokens />
            </Route>
            <Route path={['/elevations', '/oasis', '/plains', '/mesa', '/summit']}>
              <ElevationFarms />
            </Route>
            <Route path='/glacier' exact>
              <Glacier />
            </Route>
            <Route path="/expedition">
              <ExpeditionFarms />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Menu>
      <ToastListener />
    </StyledRouter>
  )
}

export default React.memo(App)
