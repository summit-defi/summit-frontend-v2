import React from 'react'
import { Elevation, elevationUtils } from 'config/constants/types'
import styled, { css } from 'styled-components'
import { elevationPalette } from 'theme/colors'
import { chunkArray } from 'utils'
import { Text, Flex } from 'uikit'
import Totem from './Totem'
import chroma from 'chroma-js'
import BigNumber from 'bignumber.js'
import { clamp } from 'lodash'

const TotemHeight = 64;
const GameAreaHeight = 164;

const TotemBattleAreaWrapper = styled(Flex)<{ fullWidth: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  height: ${GameAreaHeight}px;
  margin-top: 15px;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
`

const ExpectedMultText = styled(Text)`
  font-size: 12px;
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
  padding-left: 18px;
  padding-right: 18px; 
  margin-left: 6px; 
  gap: ${({ elevation }) => elevation === Elevation.SUMMIT ? 0 : 20}px;
  flex: 1;
`

const TotemPosition = styled(Flex)<{ topOffset: number }>`
  margin-top: ${({ topOffset }) => topOffset}px;
  align-items: center;
  justify-content: center;
  position: relative;
`

const DashedLine = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
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
  margin-top: 32px;
  margin-bottom: 32px;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
`

const TotemResultWrapper = styled(Flex)`
  flex-direction: column;
  position: relative;  
  height: 100%;
`

const calcTopOffset = (mult, elevation: Elevation) => {
  const expectedMult = elevationUtils.totemCount(elevation)

  const thirdMult = expectedMult * 0.4
  const maxMult = expectedMult + thirdMult
  const minMult = expectedMult - thirdMult
  const clampedMult = clamp(mult, minMult, maxMult)
  return ((maxMult - clampedMult) / (maxMult - minMult)) * (GameAreaHeight - TotemHeight)
}
const calcScale = (mult, elevation: Elevation) => {
  const expectedMult = elevationUtils.totemCount(elevation)

  const thirdMult = expectedMult * 0.4
  const maxMult = expectedMult + thirdMult
  const minMult = expectedMult - thirdMult
  const clampedMult = clamp(mult, minMult, maxMult)
  return 1 - (((maxMult - clampedMult) / (maxMult - minMult)) * 0.2)
}


const RulerLine: React.FC<{ i: number, elevation: Elevation }> = ({ i, elevation }) => {
  const expectedMult = elevationUtils.totemCount(elevation)
  const maxMult = expectedMult + (expectedMult * 0.4)
  const mult = maxMult - (i * expectedMult * 0.2)
  return (<RuleLine topOffset={calcTopOffset(mult, elevation)}/>)
}

const TotemBattleArea: React.FC<{ elevation: Elevation, fullWidth: boolean }> = ({ elevation, children, fullWidth }) => {
  const expectedMultiplier = elevationUtils.totemCount(elevation)
  return (
    <TotemBattleAreaWrapper fullWidth={fullWidth}>
      <ExpectedMultText bold monospace>{expectedMultiplier}x</ExpectedMultText>
      <TotemResultsWrapper elevation={elevation}>
        <RulerLine elevation={elevation} i={0}/>
        <RulerLine elevation={elevation} i={1}/>
        <DashedLine/>
        <RulerLine elevation={elevation} i={3}/>
        <RulerLine elevation={elevation} i={4}/>
        {children}
      </TotemResultsWrapper>
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
        <TotemMultText bold monospace top={topOffset <= ((GameAreaHeight - TotemHeight) / 2)}>{totemInfo.mult}x</TotemMultText>
      </TotemPosition>
    </TotemResultWrapper>
  )
}

interface Props {
  title?: string
  elevation: Elevation
  totemInfos: TotemInfo[]
  fullWidth?: boolean
}

const TotemBattleBreakdown: React.FC<Props> = ({ title, elevation, totemInfos, fullWidth = true }) => {
  const colorGradient = chroma
    .scale([elevationPalette[elevation][2], elevationPalette[elevation][4]])
    .mode('lch')
    .colors(totemInfos.length)
  console.log(fullWidth)
  return (
    <TotemBreakdownWrapper fullWidth={fullWidth}>
      { title != null && <Text bold monospace>{title}</Text> }
      <TotemBattleArea
        fullWidth={fullWidth}
        elevation={elevation}
      >
        {totemInfos.map((totemInfo) => (
          <TotemBattleResult
            key={totemInfo.totem}
            totemInfo={totemInfo}
            elevation={elevation}
            color={colorGradient[totemInfo.totem]}
            selected={false}
          />
        ))}
      </TotemBattleArea>
    </TotemBreakdownWrapper>
  )
}

export default TotemBattleBreakdown
