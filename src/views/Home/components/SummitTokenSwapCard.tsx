import React from 'react'
import styled from 'styled-components'
import { Flex, Card, CardBody, HighlightedText } from 'uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import UnlockButton from 'components/UnlockButton'
import V1SummitWalletBalance from './V1SummitWalletBalance'
import SummitButton from 'uikit/components/Button/SummitButton'
import { useTokenSwapV1Summit } from 'hooks/useTokenSwapV1Summit'

const StyledFarmStakingCard = styled(Card)`
  min-height: 376px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`

const Actions = styled(Flex)`
  justify-content: center;
  margin-top: 24px;
  display: flex;
  flex: 1;
  align-items: flex-end;
`

const SummitTokenSwapCard = () => {
  const { account } = useWallet()

  const {
    onApprove,
    onTokenSwap,
    swapPending,
    approvePending,
    v1SummitApproved,
    v1SummitBalance,
    anythingToSwap,
  } = useTokenSwapV1Summit()

  const handleSwapButtonPressed = () => {
    if (swapPending || approvePending || !anythingToSwap) return
    if (v1SummitApproved) {
      onTokenSwap()
    } else {
      onApprove()
    }
  }

  return (
    <StyledFarmStakingCard>
      <CardBody style={{height: '100%', display: 'flex', flex: '1', flexDirection: 'column'}}>
        <HighlightedText header mb="24px">
          SUMMIT TOKEN SWAP
        </HighlightedText>

        <Flex justifyContent="space-between" alignItems="center">
          <Label>V1 SUMMIT in Wallet</Label>
          <V1SummitWalletBalance v1SummitBalance={ v1SummitBalance } />
        </Flex>
        <SummitButton
            isLoading={swapPending || approvePending}
            disabled={!anythingToSwap}
            onClick={handleSwapButtonPressed}
          >
            { v1SummitApproved ?
              <>
                SWAP ALL V1 SUMMIT
                <br />
                FOR V2 SUMMIT
              </> :
              <>APPROVE V1 SUMMIT SWAP</>
            }
        </SummitButton>

        <Actions>
          {!account &&
            <UnlockButton/>
          }
        </Actions>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default SummitTokenSwapCard
