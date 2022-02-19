import React, { memo, useState, useCallback, useMemo } from "react"
import BigNumber from "bignumber.js"
import { FaithSlider } from "components/SelectTotemModal"
import { BN_ZERO, Elevation } from "config/constants"
import { useSelectTotemAndOrFaith } from "hooks/useSelectTotem"
import { debounce } from "lodash"
import { useExpeditionUserData } from "state/hooks"
import { useExpeditionUserFaithInfo } from "state/hooksNew"
import styled from "styled-components"
import { Flex, Text, SummitButton, TokenSymbolImage } from "uikit"
import { getBalanceNumber } from "utils"
import CardValue from "views/Home/components/CardValue"
import Divider from "./Divider"


const StyledPlusText = styled(Text)`
    position: absolute;
    font-size: 16px;
`

interface UpdatedEverestSupplies {
    safeSupply: BigNumber
    deitiedSupply: BigNumber
    selectedDeitySupply: BigNumber
    totalSupply: BigNumber
    userSafeSupply: BigNumber
    userDeitiedSupply: BigNumber
}

const updatedFaithSupplies = (everestOwned: BigNumber, safeSupply: BigNumber, deitiedSupply: BigNumber, selectedDeitySupply: BigNumber, existingFaith: number, updatedFaith: number | null): UpdatedEverestSupplies => {
    const divineBonus = 1.2
    const userExistingDeitiedSupply = everestOwned.times(existingFaith).dividedBy(100)
    const userExistingSafeSupply = everestOwned.times(100 - existingFaith).dividedBy(100)
    if (updatedFaith == null || updatedFaith === existingFaith) return {
        safeSupply,
        deitiedSupply: deitiedSupply.times(divineBonus),
        selectedDeitySupply,
        totalSupply: safeSupply.plus(deitiedSupply.times(divineBonus)),

        userSafeSupply: userExistingSafeSupply,
        userDeitiedSupply: userExistingDeitiedSupply,
    }
    const userUpdatedDeitiedSupply = everestOwned.times(updatedFaith).dividedBy(100)
    const userUpdatedSafeSupply = everestOwned.times(100 - updatedFaith).dividedBy(100)

    const baseDeitiedSupplyWithBonus = deitiedSupply.minus(userExistingDeitiedSupply).plus(userUpdatedDeitiedSupply).times(divineBonus)
    const baseSelectedDeitySupply = selectedDeitySupply.minus(userExistingDeitiedSupply).plus(userUpdatedDeitiedSupply)
    const baseSafeSupply = safeSupply.minus(userExistingSafeSupply).plus(userUpdatedSafeSupply)
    const totalSupply = baseSafeSupply.plus(baseDeitiedSupplyWithBonus)

    return {
        safeSupply: baseSafeSupply,
        deitiedSupply: baseDeitiedSupplyWithBonus,
        selectedDeitySupply: baseSelectedDeitySupply,
        totalSupply,

        userSafeSupply: userUpdatedSafeSupply,
        userDeitiedSupply: userUpdatedDeitiedSupply,
    }
}


const e12 = new BigNumber(10).pow(18)

const calculateWinnings = (
    {
        safeSupply,
        deitiedSupply,
        selectedDeitySupply,
        totalSupply,

        userSafeSupply,
        userDeitiedSupply,
    }: UpdatedEverestSupplies,
    summitRoundEmission: BigNumber,
    usdcRoundEmission: BigNumber,
) => {
    if (totalSupply.isEqualTo(0)) return {
        summitGuaranteedWinnings: BN_ZERO,
        usdcGuaranteedWinnings: BN_ZERO,
        summitPotentialWinnings: BN_ZERO,
        usdcPotentialWinnings: BN_ZERO,
    }

    return {
        summitGuaranteedWinnings: safeSupply.isEqualTo(0) ?
            BN_ZERO :
            summitRoundEmission
                .times(safeSupply).times(e12).dividedBy(totalSupply)
                .times(userSafeSupply).dividedBy(safeSupply).dividedBy(e12),
        usdcGuaranteedWinnings: safeSupply.isEqualTo(0) ?
            BN_ZERO :
            usdcRoundEmission
                .times(safeSupply).times(e12).dividedBy(totalSupply)
                .times(userSafeSupply).dividedBy(safeSupply).dividedBy(e12),
        summitPotentialWinnings: selectedDeitySupply.isEqualTo(0) ?
            BN_ZERO :
            summitRoundEmission
                .times(deitiedSupply).times(e12).dividedBy(totalSupply)
                .times(userDeitiedSupply).dividedBy(selectedDeitySupply).dividedBy(e12),
        usdcPotentialWinnings: selectedDeitySupply.isEqualTo(0) ?
            BN_ZERO :
            usdcRoundEmission
                .times(deitiedSupply).times(e12).dividedBy(totalSupply)
                .times(userDeitiedSupply).dividedBy(selectedDeitySupply).dividedBy(e12),
    }
}


const UserFaithSection: React.FC = memo(() => {
    const {
        summitRoundEmission,
        usdcRoundEmission,
        everestOwned,
        safeSupply,
        deitiedSupply,
        selectedDeitySupply,
        faith,
        userDeity,
        deityDivider,
    } = useExpeditionUserFaithInfo()

    const winPercChance = userDeity === 0 ? deityDivider : (100 - deityDivider)
    const deityName = userDeity === 0 ? 'BULL' : 'BEAR'


    const [updatedFaith, setUpdatedFaith] = useState(null)
    const debouncedSetUpdatedFaith = useMemo(
        () => debounce(setUpdatedFaith, 300)
    , []);

    const faithChanged = updatedFaith != null

    const { pending: faithPending, onSelectTotemAndOrSafetyFactor: onSelectFaith } = useSelectTotemAndOrFaith()

    const handleUpdateFaith = useCallback(() => {
        if (faithPending || !faithChanged) return
        onSelectFaith(
            Elevation.EXPEDITION,
            null,
            updatedFaith
        )
    }, [faithPending, faithChanged, updatedFaith, onSelectFaith])

    const {
        summitGuaranteedWinnings,
        usdcGuaranteedWinnings,
        summitPotentialWinnings,
        usdcPotentialWinnings,
    } = useMemo(
        () => calculateWinnings(
            updatedFaithSupplies(
                everestOwned,
                safeSupply,
                deitiedSupply,
                selectedDeitySupply,
                faith,
                updatedFaith
            ),
            summitRoundEmission,
            usdcRoundEmission,
        ),
        [everestOwned, safeSupply, deitiedSupply, selectedDeitySupply, faith, updatedFaith, summitRoundEmission, usdcRoundEmission]
    )

    const rawSummitGuaranteedWinnings = getBalanceNumber(summitGuaranteedWinnings)
    const rawUsdcGuaranteedWinnings = getBalanceNumber(usdcGuaranteedWinnings, 6)
    const rawSummitPotentialWinnings = getBalanceNumber(summitPotentialWinnings)
    const rawUsdcPotentialWinnings = getBalanceNumber(usdcPotentialWinnings, 6)

    return (
        <>
            <Flex gap='24px' flexDirection='column' width='calc(100% - 36px)' maxWidth='500px' alignItems='center' justifyContent='center'>
                <FaithSlider
                    existingFaith={faith}
                    setFaith={debouncedSetUpdatedFaith}
                />

                { faithChanged &&
                    <SummitButton
                        isLoading={faithPending}
                        summitPalette={Elevation.EXPEDITION}
                        onClick={handleUpdateFaith}
                    >
                        UPDATE FAITH
                    </SummitButton>
                }
            </Flex>

            <Flex width='100%' alignItems='center' justifyContent='center' position='relative'>
                <StyledPlusText bold monospace>--</StyledPlusText>
                <Flex width='50%' gap='6px' flexDirection='column' alignItems='center' justifyContent='center'>
                    <Text bold monospace small>MINIMUM WINNINGS</Text>
                    <Text bold monospace small italic>(GUARANTEED)</Text>
                    <Flex flexDirection='column' alignItems='center' justifyContent='center'>
                        <CardValue
                            value={rawSummitGuaranteedWinnings}
                            decimals={3}
                            fontSize='18'
                            postfix='SUMMIT'
                            postfixFontSize='12'
                        />
                        <CardValue
                            value={rawUsdcGuaranteedWinnings}
                            decimals={3}
                            fontSize='18'
                            postfix='USDC'
                            postfixFontSize='12'
                        />
                    </Flex>
                </Flex>
                <Flex width='50%' gap='6px' flexDirection='column' alignItems='center' justifyContent='center'>
                    <Text bold monospace small>MAXIMUM WINNINGS</Text>
                    <Text bold monospace small italic>({deityName} WIN - {winPercChance}% CHANCE)</Text>
                    <Flex flexDirection='column' alignItems='center' justifyContent='center'>
                        <CardValue
                                value={rawSummitPotentialWinnings}
                                decimals={3}
                                fontSize='18'
                                postfix='SUMMIT'
                                postfixFontSize='12'
                        />
                        <CardValue
                                value={rawUsdcPotentialWinnings}
                                decimals={3}
                                fontSize='18'
                                postfix='USDC'
                                postfixFontSize='12'
                        />
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
})






export const ExpeditionUserSection: React.FC = memo(() => {
    const {
        entered,
        everestOwned,
        summitLifetimeWinnings,
        usdcLifetimeWinnings,
    } = useExpeditionUserData()

    const rawEverestOwned = getBalanceNumber(everestOwned)
    const rawSummitLifetimeWinnings = getBalanceNumber(summitLifetimeWinnings)
    const rawUsdcLifetimeWinnings = getBalanceNumber(usdcLifetimeWinnings, 6)

    if (!entered) return null

    return (
    <Flex width='100%' maxWidth='650px !important' mt='32px' flexDirection='column' gap='24px' alignItems='center' justifyContent='center'>

        {/* EVEREST SECTION */}
        <Flex width='100%' alignItems='flex-start'>
            <Flex width='50%' gap='6px' flexDirection='column' alignItems='center' justifyContent='center'>
                <Text bold monospace small>EVEREST OWNED</Text>
                <Flex height='54px' gap='6px' alignItems='center' justifyContent='center'>
                    <TokenSymbolImage symbol='EVEREST' width={46} height={46}/>
                    <Flex pb='3px'>
                        <CardValue
                            value={rawEverestOwned}
                            decimals={3}
                            fontSize='18'
                            postfix='EVEREST'
                            postfixFontSize='12'
                        />
                    </Flex>
                </Flex>
            </Flex>
            <Flex width='50%' gap='6px' flexDirection='column' alignItems='center' justifyContent='center'>
                <Text bold monospace small>LIFETIME WINNINGS</Text>
                <Flex flexDirection='column' alignItems='center' justifyContent='center'>
                    <CardValue
                        value={rawSummitLifetimeWinnings}
                        decimals={3}
                        fontSize='18'
                        postfix='SUMMIT'
                        postfixFontSize='12'
                    />
                    <CardValue
                        value={rawUsdcLifetimeWinnings}
                        decimals={3}
                        fontSize='18'
                        postfix='USDC'
                        postfixFontSize='12'
                    />
                </Flex>
            </Flex>
        </Flex>

        <UserFaithSection/>
        <Divider/>
    </Flex>
    )
})