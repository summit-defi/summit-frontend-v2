import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useWeb3 from 'hooks/useWeb3'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import Page from 'components/layout/Page'
import EpochsHeaderCard, { FrozenEpochs } from './components'
import styled from 'styled-components'
import { Flex } from 'uikit'
import FlexLayout from 'components/layout/Flex'
import { fetchUserEpochsAsync } from 'state/glacier'
import useRefresh from 'hooks/useRefresh'

const HeaderCardsWrapper = styled(Flex)`
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap: 32px;
    margin: 0px auto 32px auto;
    max-width: 850px;
`

const Glacier: React.FC = () => {
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const { account } = useWallet()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchUserEpochsAsync(account))
    }
  }, [account, dispatch, fastRefresh, web3])


  return (
    <Page>
      <HeaderCardsWrapper>
        <EpochsHeaderCard/>
      </HeaderCardsWrapper>
      <FlexLayout>
        <FrozenEpochs/>
      </FlexLayout>
    </Page>
  )
}

export default Glacier