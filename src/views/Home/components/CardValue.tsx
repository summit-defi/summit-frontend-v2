import { ElevOrPalette } from 'config/constants/types'
import React, { useEffect, useRef } from 'react'
import { useCountUp } from 'react-countup'
import { HighlightedText } from 'uikit'

interface CardValueProps {
  value: number
  decimals?: number
  fontSize?: string
  prefix?: string
  postfix?: string
  postfixFontSize?: string
  summitPalette?: ElevOrPalette
  gold?: boolean
  isMultiplier?: boolean
}

const CardValue: React.FC<CardValueProps> = ({
  value,
  decimals,
  fontSize = '40',
  prefix,
  postfix,
  isMultiplier,
  postfixFontSize,
  summitPalette,
  gold = false,
}) => {
  const { countUp, update } = useCountUp({
    start: 0,
    end: value,
    duration: 1,
    separator: ',',
    decimals:
      // eslint-disable-next-line no-nested-ternary
      decimals !== undefined ? decimals : value < 0 ? 4 : value > 1e5 ? 0 : 3,
  })

  const updateValue = useRef(update)

  useEffect(() => {
    updateValue.current(value)
  }, [value, updateValue])

  return (
    <HighlightedText bold monospace fontSize={fontSize} summitPalette={summitPalette} header gold={gold}>
      {prefix}
      {countUp}
      {isMultiplier && 'X'}
      {postfix != null && (
        <HighlightedText bold summitPalette={summitPalette} fontSize={postfixFontSize || fontSize} header ml="6px" mt='2px' gold={gold}>
          {postfix}
        </HighlightedText>
      )}
    </HighlightedText>
  )
}

export default CardValue
