import BigNumber from 'bignumber.js'
import TokenInput from 'components/TokenInput'
import { isNumber } from 'lodash'
import React, { memo, useCallback, useState } from 'react'
import { useCurrentTimestampOnce } from 'state/hooks'
import { LockSummitButtonType } from 'state/types'
import { Flex, Text } from 'uikit'
import { getExpectedEverestAward, getFullDisplayBalance, lockDurationTextLong } from 'utils'
import EverestLockDurationSlider from './EverestLockDurationSlider'
import { LockSummitInfoAndButton } from './LockSummitInfoAndButton'


export const InitialSummitLockSection: React.FC = memo(() => {
    const currentTimestamp = useCurrentTimestampOnce()

    const summitBalance = new BigNumber(500).times(new BigNumber(10).pow(18))

    const [lockAmount, setLockAmount] = useState<BigNumber | null>(null)
    const [lockDuration, setLockDuration] = useState<number | null>(null)

    const everestAward = getExpectedEverestAward(lockAmount, lockDuration)

    const lockRelease = lockDuration != null ?
        currentTimestamp + (lockDuration * (24 * 3600)) :
        null


    // LOCK AMOUNT INPUT
    const fullSummitBalance = getFullDisplayBalance(summitBalance, 18)
    const [val, setVal] = useState('')
    const [invalidVal, setValInvalid] = useState(true)

    const validLockAmountVal = (testVal, harvestableBalance) => {
        return (
            (isNumber(parseFloat(testVal)) && parseFloat(testVal) > 0 && parseFloat(testVal) <= parseFloat(harvestableBalance))
        )
    }

    const handleChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            const amt = e.currentTarget.value
            setVal(amt)
            setLockAmount(amt == null ? null : new BigNumber(amt).times(new BigNumber(10).pow(18)))
            setValInvalid(!validLockAmountVal(amt, fullSummitBalance))
        },
        [setVal, setValInvalid, fullSummitBalance],
    )

    const handleSelectMax = useCallback(() => {
        setVal(fullSummitBalance)
        setLockAmount(fullSummitBalance == null ? null : new BigNumber(fullSummitBalance).times(new BigNumber(10).pow(18)))
        setValInvalid(!validLockAmountVal(fullSummitBalance, fullSummitBalance))
    }, [fullSummitBalance, setVal, setValInvalid])

        
    return (
        <Flex gap='32px' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
            <TokenInput
                value={val}
                balanceText='SUMMIT BALANCE'
                onSelectMax={handleSelectMax}
                onChange={handleChange}
                max={fullSummitBalance}
                symbol='SUMMIT'
            />

            <Text bold monospace small italic textAlign='left' pl='6px' style={{width: '100%'}} mb='-32px'>
                LOCK DURATION: {lockDuration != null ? lockDurationTextLong(lockDuration) : '-'}
            </Text>
            <EverestLockDurationSlider
                existingLockDuration={null}
                setLockDuration={setLockDuration}
            />

            <LockSummitInfoAndButton
                disabled={invalidVal || lockDuration == null}
                type={LockSummitButtonType.LockSummit}
                amount={lockAmount}
                duration={lockDuration}
                lockRelease={lockRelease}
                everestAward={everestAward}
            />
        </Flex>
    )
})