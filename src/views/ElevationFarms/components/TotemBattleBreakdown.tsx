import React from 'react'
import { Elevation, elevationUtils } from 'config/constants/types'
import styled, { css } from 'styled-components'
import { elevationPalette } from 'theme/colors'
import { chunkArray } from 'utils'
import { Text, Flex, useMatchBreakpoints } from 'uikit'
import Totem from './Totem'
import chroma from 'chroma-js'
import BigNumber from 'bignumber.js'
import { clamp, chunk } from 'lodash'

const TotemHeight = 64;
const GameAreaHeight = 150;

const TotemBattleAreaWrapper = styled(Flex)<{ fullWidth: boolean, secondRow: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  height: ${GameAreaHeight}px;
  margin-top: ${({ secondRow }) => secondRow ? -15 : 15}px;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
`

const ExpectedMultText = styled(Text)<{ invis?: boolean }>`
  font-size: 12px;
  width: 24px;
  opacity: ${({ invis }) => invis ? 0 : 1};
`

const TotemMultText = styled(Text)<{ top: boolean }>`
  position: absolute;
  font-size: 12px;
  ${({ top }) => top ? css`
    top: -16px;
  ` : css`
    bottom: -16px;
  `}
`

const TotemResultsWrapper = styled(Flex)<{ elevation: Elevation }>`
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
  padding-left: 6px;
  padding-right: 6px; 
  margin-left: 6px; 
  margin-right: 6px;
  gap: ${({ elevation }) => elevation === Elevation.SUMMIT || elevation === Elevation.MESA ? 0 : 20}px;
  flex: 1;

  ${({ theme }) => theme.mediaQueries.nav} {
    gap: ${({ elevation }) => elevation === Elevation.SUMMIT ? 0 : 20}px;
  }
`

const TotemPosition = styled(Flex)<{ topOffset: number }>`
  margin-top: ${({ topOffset }) => topOffset}px;
  align-items: center;
  justify-content: center;
  position: relative;
`

const DashedLine = styled.div<{ leftClipped: boolean, rightClipped: boolean }>`
  position: absolute;
  left: ${({ leftClipped }) => leftClipped ? 6 : 0}px;
  right: ${({ rightClipped }) => rightClipped ? 6 : 0}px;
  border-top: 1px dashed ${({ theme }) => theme.colors.text};
`

const RuleLine = styled.div<{ topOffset: number }>`
  position: absolute;
  left: 0px;
  right: 0px;
  top: ${({ topOffset }) => topOffset + (TotemHeight / 2)}px;
  opacity: 0.2;
  border-top: 1px solid ${({ theme }) => theme.colors.text};
`

const TotemScale = styled.div<{ scale: number }>`
  transform: scale(${({ scale }) => scale});
  transform-origin: center;
`

const TotemBreakdownWrapper = styled.div<{ fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
`

const TotemResultWrapper = styled(Flex)`
  flex-direction: column;
  position: relative;  
  height: 100%;
`

const RowCombinerRight = styled.div`
  border: 1px dashed ${({ theme }) => theme.colors.text};
  border-left: none;
  width: 32px;
  height: 85px;
  position: absolute;
  right: 0px;
  bottom: -10px;
  border-radius: 0px 32px 32px 0px;
`

const RowCombinerLeft = styled.div`
  border: 1px dashed ${({ theme }) => theme.colors.text};
  border-right: none;
  width: 32px;
  height: 84px;
  position: absolute;
  left: 0px;
  top: -8px;
  border-radius: 32px 0px 0px 32px;
`
const RowCombinerMid = styled.div`
  border-top: 1px dashed ${({ theme }) => theme.colors.text};
  height: 1px;
  position: absolute;
  left: 32px;
  right: 32px;
  top: -8px;
`

const calcTopOffset = (mult, elevation: Elevation) => {
  const expectedMult = elevationUtils.totemCount(elevation)

  const thirdMult = expectedMult * 0.4
  const maxMult = expectedMult + thirdMult
  const minMult = expectedMult - thirdMult
  const clampedMult = clamp(mult == null ? expectedMult : mult, minMult, maxMult)
  return ((maxMult - clampedMult) / (maxMult - minMult)) * (GameAreaHeight - TotemHeight)
}
const calcScale = (mult, elevation: Elevation) => {
  const expectedMult = elevationUtils.totemCount(elevation)

  const thirdMult = expectedMult * 0.4
  const maxMult = expectedMult + thirdMult
  const minMult = expectedMult - thirdMult
  const clampedMult = clamp(mult == null ? expectedMult : mult, minMult, maxMult)
  return 1 - (((maxMult - clampedMult) / (maxMult - minMult)) * 0.2)
}


const RulerLine: React.FC<{ i: number, elevation: Elevation }> = ({ i, elevation }) => {
  const expectedMult = elevationUtils.totemCount(elevation)
  const maxMult = expectedMult + (expectedMult * 0.4)
  const mult = maxMult - (i * expectedMult * 0.2)
  return (<RuleLine topOffset={calcTopOffset(mult, elevation)}/>)
}

const TotemBattleArea: React.FC<{ elevation: Elevation, fullWidth: boolean, secondRow: boolean, isMobile: boolean, multiElev: boolean }> = ({ elevation, children, fullWidth, secondRow, isMobile, multiElev }) => {
  const expectedMultiplier = elevationUtils.totemCount(elevation)
  return (
    <TotemBattleAreaWrapper fullWidth={fullWidth} secondRow={secondRow}>
      <ExpectedMultText invis={secondRow} bold monospace>{expectedMultiplier}x</ExpectedMultText>
      <TotemResultsWrapper elevation={elevation}>
        <RulerLine elevation={elevation} i={0}/>
        <RulerLine elevation={elevation} i={1}/>
        <DashedLine leftClipped={secondRow} rightClipped={elevation === Elevation.SUMMIT && !secondRow && isMobile && !multiElev}/>
        <RulerLine elevation={elevation} i={3}/>
        <RulerLine elevation={elevation} i={4}/>
        {children}
      </TotemResultsWrapper>
      { secondRow && <RowCombinerLeft/>}
      { secondRow && <RowCombinerMid/>}
      { elevation === Elevation.SUMMIT && !secondRow && isMobile && !multiElev && <RowCombinerRight/>}
      { fullWidth && <ExpectedMultText invis={!secondRow} bold monospace>{expectedMultiplier}x</ExpectedMultText> }
    </TotemBattleAreaWrapper>
  )
}

interface TotemInfo {
  totem: number
  mult: number
}

interface TotemResultProps {
  totemInfo: TotemInfo
  elevation: Elevation
  color: string
  selected: boolean
}

const TotemBattleResult: React.FC<TotemResultProps> = ({ totemInfo, elevation, color, selected }) => {
  const topOffset = calcTopOffset(totemInfo.mult, elevation)
  const totemScale = calcScale(totemInfo.mult, elevation)

  return (
    <TotemResultWrapper>
      <TotemPosition topOffset={topOffset}>
        <TotemScale scale={totemScale}>
          <Totem
            elevation={elevation}
            totem={totemInfo.totem}
            color={color}
            selected={selected}
            pressable={false}
          />
        </TotemScale>
        <TotemMultText bold monospace top={topOffset <= ((GameAreaHeight - TotemHeight) / 2)}>{totemInfo.mult == null ? '' : `${totemInfo.mult}x`}</TotemMultText>
      </TotemPosition>
    </TotemResultWrapper>
  )
}

interface Props {
  title?: string
  elevation: Elevation
  totemInfos: TotemInfo[]
  fullWidth?: boolean
  userTotem?: number
  multiElev?: boolean
}

const TotemBattleBreakdown: React.FC<Props> = ({ title, elevation, totemInfos, userTotem, fullWidth = true, multiElev = false }) => {
  const colorGradient = chroma
    .scale([elevationPalette[elevation][2], elevationPalette[elevation][4]])
    .mode('lch')
    .colors(totemInfos.length)

  const { isXl } = useMatchBreakpoints();
  const isMobile = isXl === false;

  const chunkedTotems = chunk(totemInfos, isMobile ? 5 : 10)
  return (
    <>
    { chunkedTotems.map((totems, chunkIndex) =>
      <TotemBreakdownWrapper fullWidth={fullWidth} key={totems[0].totem}>
        { title != null && chunkIndex === 0 && <Text bold monospace>{title}</Text> }
        <TotemBattleArea
          fullWidth={fullWidth}
          elevation={elevation}
          secondRow={chunkIndex === 1}
          isMobile={isMobile}
          multiElev={multiElev}
        >
          {totems.map((totemInfo) => (
            <>
              <TotemBattleResult
                key={totemInfo.totem}
                totemInfo={totemInfo}
                elevation={elevation}
                color={colorGradient[totemInfo.totem]}
                selected={totemInfo.totem === userTotem}
              />
            </>
          ))}
        </TotemBattleArea>
      </TotemBreakdownWrapper>
    )}
    </>
  )
}

export default TotemBattleBreakdown
