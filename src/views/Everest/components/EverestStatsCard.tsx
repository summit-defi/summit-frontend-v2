import React, { memo, useCallback } from "react"
import { useEverestInfo, useSummitPrice } from "state/hooks"
import styled from "styled-components"
import { Flex, Text, HighlightedText, TokenSymbolImage } from "uikit"
import SummitButton from "uikit/components/Button/SummitButton"
import { getBalanceNumber, getEverestTokenAddress, getFormattedBigNumber, } from "utils"
import CardValue from "views/Home/components/CardValue"
import EverestLockDurationIndicator from "./EverestLockDurationIndicator"


export const EverestCard = styled(Flex)`
    flex-direction: column;
    justify-content: flex-start;
    background: ${({ theme }) => theme.colors.background};
    border-radius: 6px;
    padding: 18px;
    flex: 1;
    padding-top: 32px;
    padding-bottom: 32px;
    min-width: 350px;
    min-height: 400px;
    box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
    height: 100%;
`


const TokenImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`


export const EverestStatsCard: React.FC = memo(() => {
    const { totalSummitLocked, averageLockDuration, everestSupply } = useEverestInfo()
    const rawEverestSupply = getBalanceNumber(everestSupply)
    const rawSummitLocked = getBalanceNumber(totalSummitLocked)
    const summitPrice = useSummitPrice()
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

    return (
        <EverestCard gap='32px' alignItems='center' justifyContent='center'>
            <HighlightedText bold monospace textAlign='center'>
                THE EVEREST TOKEN
            </HighlightedText>

            <TokenImageWrapper>
                <TokenSymbolImage symbol='EVEREST' width={48} height={48}/>
                <SummitButton onClick={addWatchSummitToken} height={30} padding={22} style={{ marginLeft: '8px' }}>
                    + <img style={{ marginLeft: 8 }} width={16} src="/images/wallet/metamask.png" alt="metamask logo" />
                </SummitButton>
            </TokenImageWrapper>

            <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
                <Text monospace small>Everest Supply:</Text>
                <CardValue value={rawEverestSupply} decimals={3} fontSize="22" />
            </Flex>
            <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
                <Text monospace small>Total Summit Locked:</Text>
                <CardValue value={rawSummitLocked} decimals={3} fontSize="22" />
            </Flex>
            <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
                <Text monospace small>Summit Value Locked:</Text>
                <CardValue prefix="$" value={rawSummitValueLocked} decimals={2} fontSize="22" />
            </Flex>
            <Flex flexDirection='column' alignItems='center' justifyContent='center' width='100%'>
                <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
                    <Text monospace small>Average Summit Lock Duration:</Text>
                    <CardValue value={averageLockDuration} postfix="DAYS" decimals={0} fontSize="22" postfixFontSize="16" />
                </Flex>
                <EverestLockDurationIndicator avgLockDuration={averageLockDuration}/>
            </Flex>

            <Flex gap='12px' flexDirection='column' alignItems='center' justifyContent='center' width='100%'>
                <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
                    <Text monospace small>Everest Value (est):</Text>
                    <Text monospace small bold>TBD</Text>
                </Flex>
                <Text monospace small fontSize='10px' textAlign='center'>Everest Value is calculated based on SUMMIT lock duration and Expedition earnings.</Text>
            </Flex>


        </EverestCard>
    )
})