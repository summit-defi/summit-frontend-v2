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
import { useFilteredPartitionedFarms } from 'hooks/useElevationFarms'
import Divider from './components/Divider'

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
  const userTokenInfos = useUserTokens()
  const farmsLoaded = useFarmsLoaded()
  const summitPrice = useSummitPrice()
  const web3 = useWeb3()
  const elevationTab = useElevationFarmsTab()

  const [stakedFarms, unstakedFarms] = useFilteredPartitionedFarms()

  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
      dispatch(fetchTokensUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh, web3])

  const farmsList = useCallback(
    (farmsToDisplay) => farmsToDisplay.map((farm) => (
      <FarmCard
        key={farm.symbol}
        farm={farm}
        elevationTab={elevationTab}
        tokenInfo={userTokenInfos[farm.symbol]}
        summitPrice={summitPrice}
        ethereum={ethereum}
        account={account}
      />
    )),
    [account, userTokenInfos, summitPrice, elevationTab, ethereum],
  )

  return (
    <Page>
      <TotemHeader />
      <FarmFilterRow />

      {farmsLoaded ?
        <div>
          {(stakedFarms.length + unstakedFarms.length) === 0 && (
            <NoFarmsFlex justifyContent="center" mt="56px">
              <Text bold monospace fontSize="16px">
                No elevation farms found
              </Text>
            </NoFarmsFlex>
          )}
          <FlexLayout>
            <Route path={`${path}/`}>
              { stakedFarms.length > 0 && 
                <>
                  <Text margin='0px auto 6px 24px' fontSize='12px' bold monospace>YOUR FARMS</Text>
                  <Flex flexDirection='column' width='100%'>
                    {farmsList(stakedFarms)}
                  </Flex>
                </>
              }

              { stakedFarms.length > 0 && <Text margin='12px auto 6px 24px' fontSize='12px' bold monospace>ALL FARMS</Text> }
              <Flex flexDirection='column' width='100%'>
                {farmsList(unstakedFarms)}
              </Flex>
            </Route>
          </FlexLayout>
        </div> :
        <PageLoader fill={false} loadingText='Loading Farms...'/>
      }
    </Page>
  )
}

export default ElevationFarms
