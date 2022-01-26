import BigNumber from 'bignumber.js'
import TokenInput from 'components/TokenInput'
import { SummitPalette } from 'config/constants'
import { isNumber } from 'lodash'
import React, { memo, useCallback, useState } from 'react'
import { useCurrentTimestampOnce } from 'state/hooks'
import { EverestUserData, LockSummitButtonType } from 'state/types'
import { Flex } from 'uikit'
import { getExpectedEverestAward, getFullDisplayBalance } from 'utils'
import { ExistingLockedSummit } from './ExistingLockedSummit'
import { LockSummitInfoAndButton } from './LockSummitInfoAndButton'

interface Props {
    userEverestInfo: EverestUserData
}

export const IncreaseLockedAmountSection: React.FC<Props> = ({ userEverestInfo }) => {
    const {
        summitBalance,
        summitLocked,
        lockRelease,
        lockDuration
    } = userEverestInfo

    const [lockAmount, setLockAmount] = useState<BigNumber | null>(null)
    const everestAward = getExpectedEverestAward(lockAmount, lockDuration)

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
        <Flex gap='18px' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
            <TokenInput
                value={val}
                summitPalette={SummitPalette.EVEREST}
                balanceText='SUMMIT BALANCE'
                onSelectMax={handleSelectMax}
                onChange={handleChange}
                max={fullSummitBalance}
                symbol='SUMMIT'
            />

            <ExistingLockedSummit
                summitLocked={summitLocked}
                lockRelease={lockRelease}
            />

            <LockSummitInfoAndButton
                approved
                disabled={invalidVal}
                type={LockSummitButtonType.IncreaseLockedSummit}
                amount={lockAmount}
                duration={lockDuration}
                lockRelease={lockRelease}
                everestAward={everestAward}
            />
        </Flex>
    )
}