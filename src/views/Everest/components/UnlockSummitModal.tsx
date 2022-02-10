import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Text, Modal, ModalActions, SummitButton, Lock } from 'uikit'
import { BN_ZERO, SummitPalette } from 'config/constants/types'
import { isNumber } from 'lodash'
import { getFormattedBigNumber, getFullDisplayBalance } from 'utils'
import TokenInput from 'components/TokenInput'
import { useEverestUserInfo } from 'state/hooksNew'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'


const InfoText = styled(Text)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(100% - 48px);
`

interface UnlockSummitProps {
  onUnlockSummit: (
    amount: string,
  ) => void
  onDismiss?: () => void
}

const UnlockSummitModal: React.FC<UnlockSummitProps> = ({
  onUnlockSummit,
  onDismiss,
}) => {
  const {
    everestBalance,
    summitLocked,
    everestLockMult
  } = useEverestUserInfo()

  const [fullBalance, setFullBalance] = useState('0')
  const [val, setVal] = useState('')
  const [invalidVal, setValInvalid] = useState(true)
  const [everestToBurn, setEverestToBurn] = useState(BN_ZERO)
  const [notEnoughEverest, setNotEnoughEverest] = useState(false)

  const rawEverestBalance = getFormattedBigNumber(everestBalance)
  const rawEverestToBurn = getFormattedBigNumber(everestToBurn)

  const validElevateVal = (testVal, stakedBal) => {
    return isNumber(parseFloat(testVal)) && parseFloat(testVal) > 0 && parseFloat(testVal) <= parseFloat(stakedBal)
  }

  useEffect(
    () => {
      const newFullBalance = getFullDisplayBalance(summitLocked)
      setFullBalance(newFullBalance)
      setVal(newFullBalance)
      setValInvalid(false)

      const requiredEverestBurn = summitLocked.times(10000).dividedBy(everestLockMult)
      setEverestToBurn(requiredEverestBurn)
      setNotEnoughEverest(everestBalance.isLessThan(requiredEverestBurn))
    },
    [summitLocked, everestLockMult, everestBalance, setFullBalance, setVal, setValInvalid, setEverestToBurn, setNotEnoughEverest]
  )

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
      setValInvalid(!validElevateVal(e.currentTarget.value, fullBalance))

      const summitToUnlock = new BigNumber(e.currentTarget.value).times(new BigNumber(10).pow(18))
      const requiredEverestBurn = summitToUnlock.times(10000).dividedBy(everestLockMult)
      setEverestToBurn(requiredEverestBurn)
      setNotEnoughEverest(everestBalance.isLessThan(requiredEverestBurn))
    },
    [setVal, setValInvalid, fullBalance, setEverestToBurn, setNotEnoughEverest, everestLockMult, everestBalance],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
    setValInvalid(!validElevateVal(fullBalance, fullBalance))
      
    const summitToUnlock = new BigNumber(fullBalance).times(new BigNumber(10).pow(18))
    const requiredEverestBurn = summitToUnlock.times(10000).dividedBy(everestLockMult)
    setEverestToBurn(requiredEverestBurn)
    setNotEnoughEverest(everestBalance.isLessThan(requiredEverestBurn))
  }, [fullBalance, setVal, setValInvalid, setEverestToBurn, setNotEnoughEverest, everestLockMult, everestBalance])

  // CONFIRM ELEVATE
  const handleUnlockSummit = useCallback(() => {
    onDismiss()
    onUnlockSummit(val)
  }, [onDismiss, onUnlockSummit, val])

  const infoTextColor = notEnoughEverest ? 'red' : ''


  return (
    <Modal
      title='UNLOCK|br|SUMMIT'
      onDismiss={onDismiss}
      elevationCircleHeader={SummitPalette.EVEREST}
      headerless
    >
      <Flex gap='18px' justifyContent="center" flexDirection="column" alignItems="center" maxWidth='350px'>
        <Text textAlign="center" monospace small bold mt='-24px'>
          Unlock your SUMMIT and burn the EVEREST you received at the time of Locking 
        </Text>

        <Text bold monospace small mb='-18px'>
          AMOUNT TO UNLOCK:
        </Text>
        <TokenInput
          summitPalette={SummitPalette.EVEREST}
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          balanceText='Locked'
          max={fullBalance}
          symbol='SUMMIT'
        />

        <InfoText monospace small textAlign='center'>
          { notEnoughEverest &&
            <Text monospace bold small color='red' italic mb='12px'>EVEREST must be burned to unlock your SUMMIT, withdraw your staked EVEREST from the farms.</Text>
          }
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
            <Text monospace small textAlign='left' color={infoTextColor}>EVEREST Balance:</Text>
            <Text bold monospace textAlign='right' color={infoTextColor}>{rawEverestBalance}</Text>
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
            <Text monospace small textAlign='left' color={infoTextColor}>EVEREST Burned to Unlock:</Text>
            <Text bold monospace textAlign='right' color={infoTextColor}>{rawEverestToBurn}</Text>
          </Flex>
        </InfoText>
      </Flex>

      <ModalActions>
        <SummitButton secondary onClick={onDismiss}>
          CANCEL
        </SummitButton>
        <SummitButton
          summitPalette={SummitPalette.EVEREST}
          disabled={invalidVal || notEnoughEverest}
          onClick={handleUnlockSummit}
        >
          UNLOCK SUMMIT
        </SummitButton>
      </ModalActions>
    </Modal>
  )
}

export default UnlockSummitModal
