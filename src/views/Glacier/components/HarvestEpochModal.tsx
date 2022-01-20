import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Text, Modal, ChevronRightIcon } from 'uikit'
import ModalActions from 'components/ModalActions'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import SummitButton from 'uikit/components/Button/SummitButton'
import { isNumber } from 'lodash'
import { elevationPalette } from 'theme/colors'
import { Epoch } from 'state/types'
import HarvestLockForEverestSelector from './HarvestLockForEverestSelector'

interface HarvestEpochModalProps {
  epoch: Epoch
  onHarvestEpoch: (
      amount: string,
      lockForEverest: boolean,
  ) => void
  onDismiss?: () => void
}

const HarvestEpochModal: React.FC<HarvestEpochModalProps> = ({
  epoch,
  onHarvestEpoch,
  onDismiss,
}) => {
  const {
    frozenSummit,
    isThawed,
  } = epoch

  const fullHarvestableBalance = getFullDisplayBalance(frozenSummit, 18)

  const [val, setVal] = useState('')
  const [invalidVal, setValInvalid] = useState(true)
  const [lockForEverest, setLockForEverest] = useState(false)

  const validHarvestVal = (testVal, harvestableBalance) => {
    return (
      testVal === '' ||
      (isNumber(parseFloat(testVal)) && parseFloat(testVal) >= 0 && parseFloat(testVal) <= parseFloat(harvestableBalance))
    )
  }

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
      setValInvalid(!validHarvestVal(e.currentTarget.value, fullHarvestableBalance))
    },
    [setVal, setValInvalid, fullHarvestableBalance],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullHarvestableBalance)
    setValInvalid(false)
  }, [fullHarvestableBalance, setVal, setValInvalid])

  const handleConfirmHarvestEpoch = () => {
    if (invalidVal) return
    onHarvestEpoch(val, lockForEverest)
  }


  return (
    <Modal
      title='Harvest|br|Epoch'
      onDismiss={onDismiss}
      elevationCircleHeader='BLUE'
      headerless
    >
      <Flex justifyContent="center" flexDirection="column" alignItems="center">
        <HarvestLockForEverestSelector
            lockForEverest={lockForEverest}
            selectLockForEverest={setLockForEverest}
        />

        <Text bold monospace mt="24px">
          AMOUNT TO HARVEST:
        </Text>
        <TokenInput
          value={val}
          balanceText={`EPOCH ${isThawed ? 'THAWED' : 'FROZEN'}`}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullHarvestableBalance}
          symbol='SUMMIT'
          feeText='Harvest Before Thawed Tax'
          feeBP={isThawed || lockForEverest ? 0 : 5000}
        />
      </Flex>

      <Text monospace fontSize='12px' textAlign='center' mt='48px'>
          { lockForEverest ?
            <>
                Locking frozen SUMMIT for EVEREST requires
                <br/>
                a lock period of at least 30 days.
                <br/>
                <br/>
                Your EVEREST lock duration will be increased
                <br/>
                to 30 days if it is currently less.
                <br/>
                <br/>
            </> :
            isThawed ?
                <>
                    This locked SUMMIT has thawed,
                    <br/>
                    and is free to harvest.
                    <br/>
                    <br/>
                    Harvesting will not take any tax,
                    <br/>
                    you will receive 100% of your harvest.
                    <br/>
                    <br/>
                </> :
                <>
                    This SUMMIT is still frozen,
                    <br/>
                    a 50% tax will be taken on harvest.
                    <br/>
                    (50% burned, 50% sent to EVEREST holders)
                    <br/>
                    <br/>
                    Either lock for EVEREST or wait until
                    <br/>
                    this epoch thaws to avoid the tax.
                </>
          }
      </Text>

      <ModalActions>
        <SummitButton secondary onClick={onDismiss}>
          CANCEL
        </SummitButton>
        <SummitButton
          disabled={invalidVal}
          onClick={handleConfirmHarvestEpoch}
        >
          { lockForEverest ? 'LOCK FOR EVEREST' : 'HARVEST'}
        </SummitButton>
      </ModalActions>
    </Modal>
  )
}

export default HarvestEpochModal
