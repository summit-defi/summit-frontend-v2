import React, { useEffect, useCallback } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { Text, Flex } from 'uikit'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useElevationLocked, useElevationTotem, useFarms, useFarmsLoaded, useSummitPrice } from 'state/hooks'
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
import { farmId, getFarmType } from 'utils/farmId'

const NoFarmsFlex = styled(Flex)`
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  max-width: 350px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 2px 2px 12px -4px rgba(25, 19, 38, 0.4), 2px 2px 8px rgba(25, 19, 38, 0.2);
`

export interface ElevationFarms {
  elevation: Elevation
}

const ElevationFarms: React.FC<ElevationFarms> = (props) => {
  const { path } = useRouteMatch()
  const farmsLP = useFarms()
  const farmsLoaded = useFarmsLoaded()
  const summitPrice = useSummitPrice()
  const web3 = useWeb3()
  const { farmType, liveFarms } = useFarmType()
  const { elevation } = props
  const locked = useElevationLocked(elevation)
  const userTotem = useElevationTotem(elevation)

  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      console.log('Call from ElevationFarms')
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh, web3])

  const filterAllFarms = useCallback(
    (farmsToFilter) =>
      farmsToFilter.filter(
        (farm) =>
          farm.elevation === elevation &&
          liveFarms === ((farm.allocation || 0) > 0 && farm.live) &&
          (farmType === FarmType.All || getFarmType(farm) === farmType),
      ),
    [farmType, liveFarms, elevation],
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
    (farmsToDisplay, removed: boolean) => farmsToDisplay.map((farm) => (
      <FarmCard
        key={farmId(farm)}
        farm={farm}
        removed={removed}
        summitPrice={summitPrice}
        ethereum={ethereum}
        account={account}
        elevation={elevation}
        elevationLocked={locked}
      />
    )),
    [account, summitPrice, ethereum, elevation, locked],
  )

  return (
    <Page>
      <ElevationAndUserVolumes/>
      <TotemHeader userTotem={userTotem} account={account} />
      {!locked && userTotem != null && !farmsLoaded && <PageLoader fill={false} />}
      {!locked && userTotem != null && farmsLoaded && (
        <div>
          {farms.length === 0 && (
            <NoFarmsFlex justifyContent="center" mt="56px">
              <Text bold monospace fontSize="16px">
                No elevation farms found
              </Text>
            </NoFarmsFlex>
          )}
          <FlexLayout>
            <Route path={`${path}/`}>{farmsList(farms, false)}</Route>
          </FlexLayout>
        </div>
      )}
    </Page>
  )
}

export default ElevationFarms
