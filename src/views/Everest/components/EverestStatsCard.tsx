import { BN_ZERO, SummitPalette, TokenSymbol } from "config/constants"
import { useBurnedSummitBalance, useTotalSummitSupply } from "hooks/useTokenBalance"
import React, { memo, useCallback } from "react"
import { useSummitPrice, useEverestStatsInfo } from "state/hooksNew"
import styled from "styled-components"
import { Flex, Text, HighlightedText, TokenSymbolImage, SummitButton, useModal } from "uikit"
import { getBalanceNumber, getEverestTokenAddress } from "utils"
import FarmInteractionModal from "views/ElevationFarms/components/FarmInteractionModal/FarmInteractionModal"
import CardValue from "views/Home/components/CardValue"
import EverestLockDurationIndicator from "./EverestLockDurationIndicator"
import { Link } from 'react-router-dom'


export const EverestCard = styled(Flex)`
    flex-direction: column;
    justify-content: flex-start;
    background: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
    padding: 18px;
    flex: 1;
    padding-top: 32px;
    padding-bottom: 32px;
    min-width: 350px;
    min-height: 400px;
    box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
    height: 100%;
`

const Divider = styled.div`
    background-color: ${({ theme }) => theme.colors.text};
    height: 1px;
    margin: 0px auto;
    width: 100%;
    max-width: 600px;
    opacity: 0.5px;
`



const HeaderHighlightedText = styled(HighlightedText)`
    margin-bottom: 0px;
    ${({ theme }) => theme.mediaQueries.nav} {
        margin-bottom: 18px;
    }
`


const TokenImageWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
`


export const EverestStatsCard: React.FC = memo(() => {
    const {
        totalSummitLocked,
        averageLockDuration,
        everestSupply,
        userEverestOwned,
    } = useEverestStatsInfo()
    const totalSupply = useTotalSummitSupply()
    const burnedSupply = useBurnedSummitBalance()
    const summitLockedPerc = totalSupply != null ? totalSummitLocked.times(100).dividedBy(totalSupply.minus(burnedSupply || BN_ZERO)).toNumber() : 0
    const summitPrice = useSummitPrice()

    const rawUserEverestOwned = getBalanceNumber(userEverestOwned)
    const rawEverestSupply = getBalanceNumber(everestSupply)
    const rawSummitLocked = getBalanceNumber(totalSummitLocked)
    const rawSummitValueLocked = getBalanceNumber(totalSummitLocked.times(summitPrice))

    const everestAddress = getEverestTokenAddress()

    const addWatchSummitToken = useCallback(async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const provider = window.ethereum
        if (provider) {
            try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await provider.request({
                method: 'wallet_watchAsset',
                params: {
                type: 'ERC20',
                options: {
                    address: everestAddress,
                    symbol: 'EVEREST',
                    decimals: '18',
                    image: `${window.location.origin}/images/tokens/EVEREST.png`,
                },
                },
            })

            if (wasAdded) {
                console.log('Token was added')
            }
            } catch (error) {
            // TODO: find a way to handle when the user rejects transaction or it fails
            }
        }
        }, [everestAddress])


    const [onPresentFarmInteractions] = useModal(
        <FarmInteractionModal
            symbol={TokenSymbol.EVEREST}
        />,
    )

    return (
        <EverestCard gap='32px' alignItems='center' justifyContent='center'>
            <HeaderHighlightedText bold monospace textAlign='center'>
                THE EVEREST TOKEN
            </HeaderHighlightedText>

            <TokenImageWrapper>
                <TokenSymbolImage symbol='EVEREST' width={48} height={48}/>
                <SummitButton
                    onClick={addWatchSummitToken}
                    height={30}
                    padding={22}
                    style={{ marginLeft: '8px' }}
                    summitPalette={SummitPalette.EVEREST}
                >
                    + <img style={{ marginLeft: 8 }} width={16} src="/images/wallet/metamask.png" alt="metamask logo" />
                </SummitButton>
            </TokenImageWrapper>
            
            <Flex flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
                <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
                    <Text monospace small bold>YOUR EVEREST BALANCE:</Text>
                    <CardValue summitPalette={SummitPalette.EVEREST} value={rawUserEverestOwned} decimals={3} fontSize="22" />
                </Flex>
                <Flex flexDirection='row' justifyContent='center' alignItems='center' width='100%' gap='18px'>
                    <SummitButton
                        summitPalette={SummitPalette.EVEREST}
                        onClick={onPresentFarmInteractions}
                    >
                        STAKE EVEREST
                    </SummitButton>
                    <SummitButton
                        summitPalette={SummitPalette.EXPEDITION}
                        as={Link}
                        to='/expedition'
                        replace
                    >
                        OPEN EXPEDITION
                    </SummitButton>
                </Flex>
            </Flex>

            <Divider/>

            <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
                <Text monospace small>Total Everest Supply:</Text>
                <CardValue summitPalette={SummitPalette.EVEREST} value={rawEverestSupply} decimals={3} fontSize="22" />
            </Flex>
            <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
                <Text monospace small>Total Summit Locked:</Text>
                <CardValue summitPalette={SummitPalette.EVEREST} value={rawSummitLocked} decimals={3} fontSize="22" />
            </Flex>
            <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
                <Text monospace small>Summit Value Locked:</Text>
                <CardValue summitPalette={SummitPalette.EVEREST} prefix="$" value={rawSummitValueLocked} decimals={2} fontSize="22" />
            </Flex>
            <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
                <Text monospace small>% of Summit Locked:</Text>
                <CardValue summitPalette={SummitPalette.EVEREST} postfix="%" value={summitLockedPerc} decimals={2} fontSize="22" />
            </Flex>
            <Flex flexDirection='column' alignItems='center' justifyContent='center' width='100%'>
                <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
                    <Text monospace small>Average Summit Lock Duration:</Text>
                    <CardValue summitPalette={SummitPalette.EVEREST} value={averageLockDuration} postfix="DAYS" decimals={0} fontSize="22" postfixFontSize="16" />
                </Flex>
                <EverestLockDurationIndicator avgLockDuration={averageLockDuration}/>
            </Flex>


        </EverestCard>
    )
})