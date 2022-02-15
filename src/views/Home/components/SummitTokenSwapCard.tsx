import React, { useMemo, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, Card, CardBody, HighlightedText, Token3DFloating, ChevronRightIcon, Lock } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import UnlockButton from 'components/UnlockButton'
import SummitButton from 'uikit/components/Button/SummitButton'
import { useTokenSwapV1Summit } from 'hooks/useTokenSwapV1Summit'
import { getBalanceNumber, getFullDisplayBalance } from 'utils'
import { isNumber } from 'lodash'
import { BN_ZERO, SummitPalette } from 'config/constants'
import TokenInput from 'components/TokenInput'
import BigNumber from 'bignumber.js'
import { updateSummitSwapMinimized } from 'state/summitEcosystem'
import { useDispatch } from 'react-redux'
import { useSummitTokenSwapUnlocked } from 'hooks/useV1SummitToken'
import { registerToken } from 'utils/wallet'

const StyledFarmStakingCard = styled(Card)`
  min-height: 376px;
`

const Actions = styled(Flex)`
  justify-content: center;
  margin-top: 24px;
  display: flex;
  flex: 1;
  align-items: flex-end;
`

const StyledLock = styled(Lock)`
  transform: rotate(20deg);
  fill: red;
`

const StyledHighlightedText = styled(HighlightedText)<{ fontSize: string; letterSpacing: string }>`
  letter-spacing: ${({ letterSpacing }) => letterSpacing};
  font-weight: 900;
  font-size: ${({ fontSize }) => fontSize};
  text-shadow: none;
`

const GreyToken3DFloating = styled(Token3DFloating)`
  filter: grayscale(1);
`


enum TokenSwapFlowItem {
  Approve,
  Swap,
  Cleanup,
}

const ActiveFlowItemUnderline = styled.div`
    position: absolute;
    width: 100%;
    bottom: -2px;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.text};
`

const flowItemTitle = (flowItem: TokenSwapFlowItem) => {
  switch (flowItem) {
      case TokenSwapFlowItem.Approve:
          return 'APPROVE V1 SUMMIT'
      case TokenSwapFlowItem.Swap:
          return 'SWAP'
      case TokenSwapFlowItem.Cleanup:
          return 'CLEAN UP'
      default: return ''
  }
}


const EntryFlowItem: React.FC<{ flowItem: TokenSwapFlowItem, flowIndex: number, completed: boolean, active: boolean }> = ({ flowItem, flowIndex, completed, active }) => {
  return (
      <Flex gap='6px' alignItems='center' justifyContent='center' position='relative'>
          <Text gold={completed} bold={active || completed} monospace lineHeight='16px'>{completed ? '✔ ' : `${flowIndex}.`}</Text>
          <Text gold={completed} bold={active || completed} monospace textAlign='center' lineHeight='16px'>{ flowItemTitle(flowItem) }</Text>
          { active && <ActiveFlowItemUnderline/>}
      </Flex>
  )
}

const SummitTokenSwapCard = () => {
  const { account } = useWeb3React()
  const dispatch = useDispatch()

  const {
    onApprove,
    onTokenSwap,
    swapPending,
    approvePending,
    v1SummitApproved,
    v1SummitBalance,
    v2SummitAddress,
    v1SummitAddress,
  } = useTokenSwapV1Summit()
  const swapUnlocked = useSummitTokenSwapUnlocked()

  const rawV1SummitBalance = getBalanceNumber(v1SummitBalance)

  const handleMinimizeSwapCard = useCallback(
    () => dispatch(updateSummitSwapMinimized(true)),
    [dispatch]
  )


  const addWatchSummitToken = useCallback(
    () => registerToken(v2SummitAddress, 'SUMMIT', 'SUMMIT', 18),
    [v2SummitAddress]
  )

  const deprecateV1SummitToken = useCallback(
    () => registerToken(v1SummitAddress, 'V1 SUMMIT', 'SUMMITV1', 18),
    [v1SummitAddress]
  )


  // SWAP TOKEN INPUT
  const fullSwapBalance = useMemo(() => {
    return getFullDisplayBalance(v1SummitBalance || BN_ZERO)
  }, [v1SummitBalance])
  const [swapVal, setSwapVal] = useState(fullSwapBalance)
  const [invalidSwap, setInvalidSwapVal] = useState(false)

  const handleApproveButtonPressed = useCallback(() => {
    if (approvePending || v1SummitApproved) return
    onApprove()
  }, [approvePending, v1SummitApproved, onApprove])

  const handleSwapButtonPressed = useCallback(() => {
    if (swapPending || invalidSwap || !swapUnlocked || !v1SummitApproved) return
    onTokenSwap(swapVal)
  }, [swapPending, invalidSwap, swapUnlocked, v1SummitApproved, onTokenSwap, swapVal])

  const validSwapVal = (testVal, swapBalance) => {
    return (
      testVal === '' ||
      (isNumber(parseFloat(testVal)) && parseFloat(testVal) >= 0 && parseFloat(testVal) <= parseFloat(swapBalance))
    )
  }

  const handleChangeSwap = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setSwapVal(e.currentTarget.value)
      setInvalidSwapVal(!validSwapVal(e.currentTarget.value, fullSwapBalance))
    },
    [setSwapVal, fullSwapBalance, setInvalidSwapVal],
  )

  const handleSelectMaxSwap = useCallback(() => {
    setSwapVal(fullSwapBalance)
    setInvalidSwapVal(!validSwapVal(fullSwapBalance, fullSwapBalance))
  }, [fullSwapBalance, setSwapVal, setInvalidSwapVal])
  
  useEffect(
    () => {
      setSwapVal(fullSwapBalance)
      setInvalidSwapVal(!validSwapVal(fullSwapBalance, fullSwapBalance))
    },
    [fullSwapBalance]
  )

  return (
    <StyledFarmStakingCard>
      <CardBody style={{height: '100%', display: 'flex', flex: '1', flexDirection: 'column', gap: '32px'}}>
        <Flex alignItems='center' justifyContent='space-between' ml='-12px' mr='-12px' mt='-12px' mb='12px'>
          <Flex flexDirection='column' alignItems='flex-start' justifyContent='center' mb='-12px'>
            <Text bold monospace letterSpacing="2px">
              SUMMIT TOKEN SWAP:
            </Text>

            <Flex justifyContent='center' alignItems='center'>
              <GreyToken3DFloating width="48px" />

              <Flex mb='12px'>
                <ChevronRightIcon width="24px" mr="-8px" key="a" />
                <ChevronRightIcon width="24px" ml="-8px" key="b" />
              </Flex>
              
              <Token3DFloating width="48px" />
            </Flex>
          </Flex>


          <SummitButton onClick={handleMinimizeSwapCard} height={24} padding={41}>
            HIDE
          </SummitButton>
        </Flex>

        {/* <Flex width='100%' justifyContent='space-around' alignItems='center'>
          <Flex>
            <Flex flexDirection='column' alignItems='center' justifyContent='center'>
              <StyledHighlightedText fontSize="16px" letterSpacing="2px" mb='-8px'>
                V1
              </StyledHighlightedText>
              <GreyToken3DFloating width="96px" />
            </Flex>


            <Flex mb='24px'>
              <ChevronRightIcon width="24px" mr="-8px" key="a" />
              <ChevronRightIcon width="24px" ml="-8px" key="b" />
            </Flex>
            
            <Flex flexDirection='column' alignItems='center' justifyContent='center'>
              <StyledHighlightedText fontSize="16px" letterSpacing="2px" mb='-8px'>
                V2
              </StyledHighlightedText>
              <Token3DFloating width="96px" />
            </Flex>
          </Flex>
          
          <StyledHighlightedText fontSize="16px" letterSpacing="2px" mt='-18px'>
            TOKEN
            <br/>
            SWAP
          </StyledHighlightedText>
        </Flex> */}
        

        { !swapUnlocked && 
          <Flex alignItems='center' justifyContent='center' gap='8px' mt='-24px'>
            <StyledLock width='18px'/>
            <Text bold italic color='red' textAlign='center' small monospace>
              SUMMIT V1--V2 TOKEN SWAP IS CURRENTLY LOCKED
            </Text>
          </Flex>
        }


        <Flex gap='8px' flexDirection='column' justifyContent='center' alignItems='center' width='100%'>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
            <Text monospace small>Add V2 SUMMIT to Wallet</Text>
            <SummitButton onClick={addWatchSummitToken} height={24} padding={36}>
              + <img style={{ marginLeft: 8 }} width={16} src="/images/wallet/metamask.png" alt="metamask logo" />
            </SummitButton>
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
            <Text monospace small>Mark V1 SUMMIT Deprecated</Text>
            <SummitButton onClick={deprecateV1SummitToken} height={24} padding={36} summitPalette={'RED' as SummitPalette}>
              - <img style={{ marginLeft: 8 }} width={16} src="/images/wallet/metamask.png" alt="metamask logo" />
            </SummitButton>
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
            <Text monospace small>V1 SUMMIT in Wallet:</Text>
            <Text bold monospace>{rawV1SummitBalance} SUMMIT</Text>
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
            <Text monospace small>V1:V2 Swap Ratio:</Text>
            <Text bold monospace>10:1</Text>
          </Flex>
        </Flex>


        <Flex gap='18px' width='100%' alignItems='flex-start' justifyContent='center' flexDirection='column'>
          <EntryFlowItem
            flowItem={TokenSwapFlowItem.Approve}
            flowIndex={1}
            completed={v1SummitApproved}
            active={!v1SummitApproved}
          />
          <Flex width='100%' alignItems='center' justifyContent='center'>
            <SummitButton
                isLoading={approvePending}
                disabled={v1SummitApproved}
                onClick={handleApproveButtonPressed}
              >
                APPROVE V1 SUMMIT
            </SummitButton>
          </Flex>

          <EntryFlowItem
            flowItem={TokenSwapFlowItem.Swap}
            flowIndex={2}
            completed={v1SummitApproved && v1SummitBalance.isEqualTo(0)}
            active={v1SummitApproved && v1SummitBalance.isGreaterThan(0)}
          />
          <Flex width='100%' alignItems='center' justifyContent='center'>
            <TokenInput
              value={swapVal}
              disabled={v1SummitBalance.isEqualTo(0)}
              balanceText="Wallet"
              isLocked={!v1SummitApproved || !swapUnlocked}
              onSelectMax={handleSelectMaxSwap}
              onChange={handleChangeSwap}
              max={fullSwapBalance}
              symbol='V1 SUMMIT'
            />
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
            <Text monospace small>V2 SUMMIT To Receive:</Text>
            <Text bold monospace>{new BigNumber(swapVal || 0).dividedBy(10).toFixed(3)}</Text>
          </Flex>
          <Flex width='100%' alignItems='center' justifyContent='center'>
            <SummitButton
                isLoading={swapPending}
                disabled={invalidSwap || v1SummitBalance.isEqualTo(0)}
                isLocked={!v1SummitApproved || !swapUnlocked}
                onClick={handleSwapButtonPressed}
              >
                SWAP V1 FOR V2 SUMMIT
            </SummitButton>
          </Flex>          
        </Flex>

        {!account &&
          <Actions>
            <UnlockButton/>
          </Actions>
        }
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default React.memo(SummitTokenSwapCard)
