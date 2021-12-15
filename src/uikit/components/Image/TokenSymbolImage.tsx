import { transparentize } from 'polished'
import React from 'react'
import { TokenSymbol } from 'state/types'
import styled from 'styled-components'

const LpSymbolWrapper = styled.div<{ width: number; height: number }>`
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`
const BaseSymbolIcon = styled.div<{ symbol: string; width: number; height: number }>`
  position: absolute;
  background-image: ${({ symbol }) => `url("/images/tokens/${symbol}.png")`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  filter: drop-shadow(1px 1px 2px ${transparentize(0.5, '#000000')});
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`

const SingleSymbolIcon = styled(BaseSymbolIcon)`
  width: ${({ width }) => width * 0.85}px;
  height: ${({ height }) => height * 0.85}px;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
`

const LpASymbolIcon = styled(BaseSymbolIcon)`
  top: 0px;
  left: 0px;
  z-index: 1;
  width: ${({ width }) => width * 0.6}px;
  height: ${({ height }) => height * 0.6}px;
`

const LpBSymbolIcon = styled(BaseSymbolIcon)`
  bottom: 0px;
  right: 0px;
  z-index: 2;
  width: ${({ width }) => width * 0.8}px;
  height: ${({ height }) => height * 0.8}px;
`

interface Props {
  symbol: string
  width: number
  height: number
}

const symbolSortPrio = (symbol): number => {
  switch (symbol) {
    case 'SUMMIT':
      return 1
    case 'FTM':
      return -1
    default:
      return 0
  }
}

const SymbolImage: React.FC<Props> = ({ symbol, width, height }) => {
  const symbolPartsRaw = symbol.split('-')
  const symbolParts = symbolPartsRaw.sort((a, b) => (symbolSortPrio(a) > symbolSortPrio(b) ? 1 : -1))
  const singleSymbols = [
    TokenSymbol.fUSDT_DAI_USDC,
    TokenSymbol.GRAND_ORCH,
    TokenSymbol.BeetXLP_MIM_USDC_USDT,
    TokenSymbol.BPT_BEETS_FTM,
  ]
  return (
    <LpSymbolWrapper width={width} height={height}>
      {(singleSymbols.includes(symbol) || symbolParts.length === 1) ? (
        <SingleSymbolIcon symbol={symbol} width={width} height={height} />
      ) : (
        <>
          <LpASymbolIcon symbol={symbolParts[0]} width={width} height={height} />
          <LpBSymbolIcon symbol={symbolParts[1]} width={width} height={height} />
        </>
      )}
    </LpSymbolWrapper>
  )
}

export default SymbolImage
