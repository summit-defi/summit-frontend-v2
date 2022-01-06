import React, { useEffect, useCallback } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { Text, Flex } from 'uikit'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useElevationFarmsTab, useElevationLocked, useElevationsLocked, useElevationTotem, useElevationTotems, useFarms, useFarmsLoaded, useSummitPrice, useUserTokens } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { Elevation } from 'config/constants/types'
import FarmCard from './components/FarmCard/FarmCard'
import useWeb3 from 'hooks/useWeb3'
import { partition } from 'lodash'
import styled from 'styled-components'
import TotemHeader from './components/TotemHeader'
import PageLoader from 'components/PageLoader'
import { useFarmType } from 'hooks/useFarmType'
import { FarmType } from 'state/types'
import ElevationAndUserVolumes from './components/ElevationAndUserVolumes'
import { getFarmType } from 'utils/farmId'
import { fetchTokensUserDataAsync } from 'state/tokens'
import FarmFilterRow from './components/FarmFilterRow'

const NoFarmsFlex = styled(Flex)`
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  max-width: 350px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 2px 2px 12px -4px rgba(25, 19, 38, 0.4), 2px 2px 8px rgba(25, 19, 38, 0.2);
`

const ElevationFarms: React.FC = () => {
  const { path } = useRouteMatch()
  const farmsLP = useFarms()
  const userTokenInfos = useUserTokens()
  const farmsLoaded = useFarmsLoaded()
  const summitPrice = useSummitPrice()
  const web3 = useWeb3()
  const elevationTab = useElevationFarmsTab()
  const { farmType, liveFarms } = useFarmType()

  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
      dispatch(fetchTokensUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh, web3])

  const filterAllFarms = useCallback(
    (farmsToFilter) =>
      farmsToFilter.filter(
        (farm) =>
          liveFarms === ((farm.allocation || 0) > 0) &&
          (farmType === FarmType.All || getFarmType(farm) === farmType),
      ),
    [farmType, liveFarms],
  )

  const filteredFarms = filterAllFarms(farmsLP)

  const [stakedFarms, unstakedFarms] = partition(filteredFarms, (farm) =>
    (!account || !farm.userData)
      ? false
      : farm.userData.stakedBalance?.isGreaterThan(0) ||
        farm.userData.claimable?.isGreaterThan(0) ||
        farm.userData.vestingReward?.isGreaterThan(0),
  )

  const farms = stakedFarms.concat(unstakedFarms)

  const farmsList = useCallback(
    (farmsToDisplay, userTokens, removed: boolean) => farmsToDisplay.map((farm) => (
      <FarmCard
        key={farm.symbol}
        farm={farm}
        elevationTab={elevationTab}
        tokenInfo={userTokens[farm.symbol]}
        removed={removed}
        summitPrice={summitPrice}
        ethereum={ethereum}
        account={account}
      />
    )),
    [account, summitPrice, elevationTab, ethereum],
  )

  return (
    <Page>
      <TotemHeader account={account} />
      {/* TODO: Overview + Elevation Selector */}
      {/* TODO: Totem header */}
      {/* TODO: Pass overview / elevation to farm cards */}
      {/* TODO: Overview staked breakdown */}

      {/* TODO: Farm options row */}
      <FarmFilterRow />

      {farmsLoaded ?
        <div>
          {farms.length === 0 && (
            <NoFarmsFlex justifyContent="center" mt="56px">
              <Text bold monospace fontSize="16px">
                No elevation farms found
              </Text>
            </NoFarmsFlex>
          )}
          <FlexLayout>
            <Route path={`${path}/`}>{farmsList(farms, userTokenInfos, false)}</Route>
          </FlexLayout>
        </div> :
        <PageLoader fill={false} />
      }
    </Page>
  )
}

export default ElevationFarms
