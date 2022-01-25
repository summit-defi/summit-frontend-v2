import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useWeb3 from 'hooks/useWeb3'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import Page from 'components/layout/Page'
import { UserEverestCard, EverestStatsCard } from './components'
import styled from 'styled-components'
import { ElevationPuck, Flex, Text } from 'uikit'
import FlexLayout from 'components/layout/Flex'
import { fetchUserEpochsAsync } from 'state/glacier'
import useRefresh from 'hooks/useRefresh'
import PageLoader from 'components/PageLoader'
import { useEverestDataLoaded } from 'state/hooks'

const HeaderCardsWrapper = styled(Flex)`
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap: 32px;
    margin: 124px auto 0px auto;
    max-width: 850px;
    position: relative;
`

const Everest: React.FC = () => {
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const { account } = useWallet()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchUserEpochsAsync(account))
    }
  }, [account, dispatch, fastRefresh, web3])

  const everestDataLoaded = useEverestDataLoaded()



  return (
    <Page>
      <HeaderCardsWrapper>
        <ElevationPuck elevation='EVEREST'/>
      </HeaderCardsWrapper>
      <FlexLayout>
        { everestDataLoaded ?
          <Flex gap='24px' width='100%' flexWrap='wrap' alignItems='flex-start' justifyContent='center'>
            <UserEverestCard/>
            <EverestStatsCard/>
          </Flex> :
          <PageLoader fill loadingText='Loading Everest Data...'/>
        }
      </FlexLayout>
    </Page>
  )
}

export default Everest
