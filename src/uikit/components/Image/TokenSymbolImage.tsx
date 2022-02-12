import { TokensWithCustomArtwork } from 'config/constants'
import React from 'react'
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
  filter: drop-shadow(1px 1px 1px ${({ theme }) => theme.colors.textShadow});
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`

const SingleSymbolIcon = styled(BaseSymbolIcon)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%) scale(0.85);
`

const LpASymbolIcon = styled(BaseSymbolIcon)`
  top: -10px;
  left: -10px;
  z-index: 1;
  transform: scale(0.6);
`

const LpBSymbolIcon = styled(BaseSymbolIcon)`
  bottom: -5px;
  right: -5px;
  z-index: 2;
  transform: scale(0.8);
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
  return (
    <LpSymbolWrapper width={width} height={height}>
      {(TokensWithCustomArtwork[symbol] || symbolParts.length === 1) ? (
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
