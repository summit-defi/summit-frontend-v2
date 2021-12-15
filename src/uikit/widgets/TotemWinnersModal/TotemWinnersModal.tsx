/* eslint-disable react/no-array-index-key */
import { Elevation, elevationUtils } from 'config/constants/types'
import { darken } from 'polished'
import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Flex } from 'uikit'
import { HighlightedText, Text } from 'uikit/components/Text'
import { chunkArray, getElevationGradientFarmCardBackground } from 'utils'
import ArtworkTotem from 'views/ElevationFarms/components/ArtworkTotem'
import Totem from 'views/ElevationFarms/components/Totem'
import { Modal } from '../Modal'
import { elevationPalette } from 'theme/colors'
import chroma from 'chroma-js'

interface Props {
  elevation: Elevation
  recentWinners: number[]
  recentWinningsMultipliers: number[]
  winsAccum: number[]
  userTotem: number | null
  onDismiss?: () => void
}

const ModalLayoutFlex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
    gap: 80px;
    padding: 0px 60px;
    margin-top: -60px;
  }
`

const MobileOnlyGap = styled.div`
  height: 32px;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`

const RainbowLight = keyframes`
0% {
  background-position: 0% 50%;
}
50% {
  background-position: 100% 50%;
}
100% {
  background-position: 0% 50%;
}
`

const StyledCardAccent = styled.div<{ elevationBackground: string }>`
  background: ${({ elevationBackground }) => elevationBackground};

  background-size: 200% 200%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 200px;
  filter: blur(30px);
  position: absolute;
  top: 3px;
  right: 3px;
  bottom: 3px;
  left: 3px;
  z-index: -1;
`

const TotemPadding = styled.div`
  margin: 24px;
  position: relative;
`
const TotemLabel = styled(Text)<{ elevation: Elevation; header?: boolean; color?: string }>`
  font-weight: bold;
  font-style: italic;
  text-align: center;
  font-size: ${({ header }) => (header ? '22' : '16')}px;
  color: ${({ elevation, theme, header, color }) =>
    darken(header ? 0.2 : 0, color !== 'text' ? color : elevationUtils.backgroundColor(elevation, theme))};
  text-shadow: 1px 1px 2px
    ${({ theme, elevation, header, color }) =>
      darken(header ? 0.2 : 0, color !== 'text' ? color : elevationUtils.backgroundColor(elevation, theme))};
`

const WinMultiplierLabel = styled(HighlightedText)`
  z-index: 1;
  margin-top: -16px;
  font-size: 28px;
`

const TotemBreakdownRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const TotemWithStatsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px;

  ${({ theme }) => theme.mediaQueries.nav} {
    padding: 6px;
  }
`

const getRecentWinnerStreak = (recentWinners: number[]): number => {
  for (let i = 0; i < recentWinners.length; i++) {
    if (recentWinners[i] !== recentWinners[0]) return i
  }
  return 10
}
const getBiggestWinnerAndLoser = (winsAccum: number[], elevation: Elevation): [number, number] => {
  const { winner, loser } = winsAccum.slice(0, elevationUtils.totemsArray(elevation).length).reduce(
    (accum, wins, index) => ({
      winner: wins > winsAccum[accum.winner] ? index : accum.winner,
      loser: wins < winsAccum[accum.loser] ? index : accum.loser,
    }),
    { winner: 0, loser: 0 },
  )
  return [winner, loser]
}
const getWinsPerc = (winsAccum: number[]): string[] => {
  const rounds = winsAccum.reduce((roundsAccum, wins) => roundsAccum + wins, 0)
  return winsAccum.map((wins) => `${Math.round((wins * 10000) / rounds) / 100}%`)
}

const TotemWinnersModal: React.FC<Props> = ({
  elevation,
  recentWinners,
  recentWinningsMultipliers,
  winsAccum,
  userTotem,
  onDismiss = () => null,
}) => {
  if (recentWinners.length === 0) {
    return (
      <Modal title={`${elevation} TOTEM WINNERS`} onDismiss={onDismiss} headerless>
        <Flex alignItems="center" flexDirection="column" p="18px">
          <Text>
            WAIT FOR THE FIRST ROUND TO END
            <br />
            TO SEE HISTORICAL DATA
          </Text>
        </Flex>
      </Modal>
    )
  }

  const elevationBackground = getElevationGradientFarmCardBackground(elevation)
  const recentWinnerName = elevationUtils.getElevationTotemName(elevation, recentWinners[0], false)
  const recentWinnerStreak = getRecentWinnerStreak(recentWinners)
  const winsPerc = getWinsPerc(winsAccum)
  const [biggestWinner, biggestLoser] = getBiggestWinnerAndLoser(winsAccum, elevation)
  const biggestWinnerName = elevationUtils.getElevationTotemName(elevation, biggestWinner, false)
  const biggestLoserName = elevationUtils.getElevationTotemName(elevation, biggestLoser, false)
  const totemsArray = elevationUtils.totemsArray(elevation)
  const chunkedTotems = chunkArray(5, totemsArray)
  const colorGradient = chroma
    .scale([elevationPalette[elevation][2], elevationPalette[elevation][4]])
    .mode('lch')
    .colors(Math.max(totemsArray.length, 5))

  return (
    <Modal title="TOTEM STATS" onDismiss={onDismiss} headerless elevationCircleHeader={elevation}>
      <ModalLayoutFlex>
        <Flex alignItems="center" flexDirection="column">
          <TotemLabel elevation={elevation}>WINNING TOTEM:</TotemLabel>
          <TotemLabel header mb={recentWinnerStreak === 1 ? '32px' : '0px'} elevation={elevation}>
            {recentWinnerName}
          </TotemLabel>
          {recentWinnerStreak > 1 && (
            <TotemLabel mb="32px" elevation={elevation} header={false}>
              {recentWinnerStreak} WIN STREAK
            </TotemLabel>
          )}
          <TotemPadding>
            <StyledCardAccent elevationBackground={elevationBackground} />
            <ArtworkTotem crowned elevation={elevation} totem={recentWinners[0]} desktopSize="200" mobileSize="200" />
          </TotemPadding>

          <WinMultiplierLabel elevation={elevation} header gold>
            {recentWinningsMultipliers[0].toFixed(1)}X
          </WinMultiplierLabel>
          <Text gold bold monospace fontSize="16px" mb="6px">
            WIN MULTIPLIER
          </Text>

          <Text mt="32px" bold>
            PREV 5 WINNERS
          </Text>
          <Flex>
            {recentWinners.slice(1, Math.min(recentWinners.length, 6)).map((totem, index) => (
              <TotemWithStatsWrapper key={index}>
                <Totem
                  elevation={elevation}
                  totem={totem}
                  color={colorGradient[index]}
                  selected={totem === userTotem}
                  pressable={false}
                  size={`${66 - index * 8}`}
                  navSize={`${74 - index * 8}`}
                />
                <Text monospace bold>
                  {recentWinningsMultipliers[index + 1].toFixed(1)}X
                </Text>
              </TotemWithStatsWrapper>
            ))}
          </Flex>
        </Flex>

        <MobileOnlyGap />

        <Flex alignItems="center" flexDirection="column">
          <Flex>
            <Flex flexDirection="column" alignItems="center">
              <TotemLabel elevation={elevation} header={false} gold>
                LUCKIEST
                <br />
                TOTEM
              </TotemLabel>
              <TotemPadding>
                <StyledCardAccent elevationBackground={elevationBackground} />
                <ArtworkTotem elevation={elevation} totem={biggestWinner} desktopSize="120" mobileSize="120" />
              </TotemPadding>
              <Text bold fontStyle="italic" gold>
                {biggestWinnerName}
              </Text>
              <Text monospace bold fontStyle="italic" gold>
                {winsPerc[biggestWinner]} WIN
              </Text>
            </Flex>
            <Flex flexDirection="column" alignItems="center">
              <TotemLabel elevation={elevation} header={false} color="#CE0000">
                UNLUCKIEST
                <br />
                TOTEM
              </TotemLabel>
              <TotemPadding>
                <StyledCardAccent elevationBackground={elevationBackground} />
                <ArtworkTotem elevation={elevation} totem={biggestLoser} desktopSize="120" mobileSize="120" />
              </TotemPadding>
              <Text bold fontStyle="italic" color="#CE0000">
                {biggestLoserName}
              </Text>
              <Text monospace bold fontStyle="italic" color="#CE0000">
                {winsPerc[biggestLoser]} WIN
              </Text>
            </Flex>
          </Flex>

          <Text mt="32px" bold>
            ALL TIME WINS BREAKDOWN
          </Text>
          {chunkedTotems.map((rowTotems) => (
            <TotemBreakdownRow key={rowTotems[0]}>
              {rowTotems.map((totem) => (
                <TotemWithStatsWrapper key={totem}>
                  <Totem
                    elevation={elevation}
                    totem={totem}
                    color={colorGradient[totem]}
                    selected={totem === userTotem}
                    pressable={false}
                  />
                  <Text monospace>{winsAccum[totem]} WINS</Text>
                  <Text monospace bold>
                    {winsPerc[totem]}
                  </Text>
                </TotemWithStatsWrapper>
              ))}
            </TotemBreakdownRow>
          ))}
        </Flex>
      </ModalLayoutFlex>
    </Modal>
  )
}

export default TotemWinnersModal
