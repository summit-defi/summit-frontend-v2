import React, { useEffect, useState } from 'react'
import { Elevation } from 'config/constants/types'
import styled from 'styled-components'
import { HighlightedText } from 'uikit'
import { useElevationInfo, useElevationUserRoundInfo } from 'state/hooks'
import ArtworkTotem from 'views/ElevationFarms/components/ArtworkTotem'
import CardValue from 'views/Home/components/CardValue'
import { getBalanceNumber } from 'utils'

interface Props {
  elevation: Elevation
  winningTotem: number
  multiWin: boolean
}

const TotemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  animation: entry 0.3s ease-out;
  @keyframes entry {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    to {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }

  &:before {
    content: ' ';
    width: 700px;
    height: 700px;
    position: absolute;
    margin: auto;
    border-radius: 350px;
    background-color: gold;
    opacity: 0;

    animation: popEntry 0.6s ease-out;
    @keyframes popEntry {
      0% {
        opacity: 0.8;
        -webkit-transform: scale(0);
        transform: scale(0);
      }
      to {
        opacity: 0;
        -webkit-transform: scale(1);
        transform: scale(1);
      }
    }
  }
`

export const RolledOverElevation: React.FC<Props> = ({ elevation, winningTotem, multiWin }) => {
  const { userVesting } = useElevationUserRoundInfo(elevation)
  const [maxUserVesting, setMaxUserVesting] = useState(userVesting)

  useEffect(() => {
    if (elevation !== Elevation.EXPEDITION && userVesting.isGreaterThan(maxUserVesting)) {
      setMaxUserVesting(userVesting)
    }
  }, [elevation, userVesting, maxUserVesting, setMaxUserVesting])

  const elevationInfo = useElevationInfo(elevation)
  let winningsMultiplier = 0
  let rawTotalContributed = 0
  if (elevation !== Elevation.EXPEDITION) {
    winningsMultiplier = elevationInfo.prevWinningsMultipliers[0]
    rawTotalContributed = getBalanceNumber(maxUserVesting.dividedBy(winningsMultiplier))
  }
  const rawTotalEarned = getBalanceNumber(maxUserVesting)

  return (
    <TotemWrapper key={elevation}>
      {multiWin && (
        <HighlightedText elevation={elevation} header fontSize="18">
          THE {elevation}:
        </HighlightedText>
      )}

      { elevation !== Elevation.EXPEDITION &&
      <>
        <HighlightedText elevation={elevation} header fontSize="12">
          YIELD CONTRIBUTED:
        </HighlightedText>
        <CardValue
          value={rawTotalContributed}
          decimals={2}
          postfix="SUMMIT"
          elevation={elevation}
          fontSize="16px"
          postfixFontSize="14px"
        />
        <br />
        <br />
      </>
      }
      <HighlightedText elevation={elevation} header fontSize="14" gold>
        { elevation !== Elevation.EXPEDITION ? 'REWARDS:' : 'WINNINGS:' }
      </HighlightedText>
      <CardValue
        value={rawTotalEarned}
        decimals={2}
        postfix='MIM'
        elevation={elevation}
        fontSize="32px"
        postfixFontSize="24px"
        gold
      />
      { elevation !== Elevation.EXPEDITION &&
      <CardValue
        value={winningsMultiplier}
        isMultiplier
        decimals={1}
        postfix="MULTIPLIER"
        elevation={elevation}
        fontSize="24px"
        postfixFontSize="14px"
        gold
      />
      }
      <br />
      <br />
      <br />
      <ArtworkTotem
        elevation={elevation}
        totem={winningTotem}
        crowned
        desktopSize="200"
        mobileSize={multiWin ? '120' : '200'}
        withName
      />
    </TotemWrapper>
  )
}
