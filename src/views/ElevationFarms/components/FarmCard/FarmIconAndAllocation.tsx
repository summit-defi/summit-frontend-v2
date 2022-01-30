import React from "react";
import styled from "styled-components";
import { Flex, Tag, Text, TokenSymbolImage } from "uikit";

const MultiplierTag = styled(Tag)`
  font-family: 'Courier Prime', monospace;
  background-color: ${({ theme }) => theme.colors.DASH};
  border-color: ${({ theme }) => theme.colors.DASH};
`

interface Props {
    symbol: string
    allocation: number
}

const FarmIconAndAllocation: React.FC<Props> = ({ symbol, allocation }) => {
    return (
        <Flex gap='8px' width='180px' justifyContent="flex-start" alignItems="center">
            <TokenSymbolImage symbol={symbol} width={52} height={52} />
            <Flex flexDirection="column" alignItems="flex-start">
                <Text italic monospace bold fontSize="14px" lineHeight="14px" mb="4px" textAlign="left">
                    {symbol}
                </Text>
                <MultiplierTag variant="secondary">
                    {(allocation / 100).toFixed(1)}X
                </MultiplierTag>
            </Flex>
        </Flex>
    )
}

export default React.memo(FarmIconAndAllocation)