import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import { MenuEntry, LinkLabel, MenuGap } from './MenuEntry'
import MenuLink from './MenuLink'
import { PanelProps, PushedProps } from '../types'
import { Elevation, elevationUtils } from 'config/constants/types'
import SelectableIcon from './SelectableIcon'
import { useElevationsLocked, useElevationTotems, useWinningTotems } from 'state/hooks'

interface Props extends PanelProps, PushedProps {
  isMobile: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;

  ${({ theme }) => theme.mediaQueries.invNav} {
    justify-content: flex-start;
  }
`

const PanelBody: React.FC<Props> = ({ isPushed, pushNav, isMobile, links }) => {
  const location = useLocation()
  const keyPath = location.pathname.split('/')[1]
  const userTotems = useElevationTotems()
  const winningTotems = useWinningTotems()
  const elevationsLocked = useElevationsLocked()

  // Close the menu when a user clicks a link on mobile
  const handleClick = () => {
    if (isMobile) {
      pushNav(false)
    }
  }

  const entryIcon = useCallback(
    (elevation, icon) => {
      if (elevation == null) {
        return icon
      }
      return `totemIcons/${elevationUtils.getElevationTotemName(
        elevation,
        userTotems[elevationUtils.toInt(elevation)],
      )}.png`
    },
    [userTotems]
  )

  return (
    <Container>
      {links.map((entry) => {
        const calloutClass = entry.calloutClass ? entry.calloutClass : undefined
        const elevationInt = elevationUtils.toInt(entry.elevation)

        const isActive = !entry.neverHighlight && entry.icon != null && entry.keyPaths.includes(keyPath)

        const backgroundIcon =
          entry.elevation === Elevation.EXPEDITION ? 'totemIcons/expeditionIconBackground.png' : null

        if (entry.gap) return <MenuGap key={entry.href} />

        return (
          <MenuEntry
            key={entry.href}
            isPushed={isPushed}
            disabled={entry.disabled}
            textItem={entry.icon == null}
            isActive={isActive}
            className={calloutClass}
            elevation={entry.elevation || entry.label}
          >
            <MenuLink
              href={entry.href}
              rel="noreferrer noopener"
              target={entry.external ? '_blank' : '_self'}
              onClick={handleClick}
            >
              {entry.icon != null && (
                <SelectableIcon
                  crowned={
                    entry.elevation != null &&
                    winningTotems[elevationInt] === userTotems[elevationInt]
                  }
                  isActive={isActive}
                  elevation={entry.elevation || entry.label}
                  icon={entryIcon(entry.elevation, entry.icon)}
                  backgroundIcon={backgroundIcon}
                  elevationLocked={elevationsLocked[elevationInt]}
                />
              )}
              <LinkLabel isActive={isActive} isPushed={isPushed} elevation={entry.elevation || entry.label}>
                {entry.icon == null && ' - '}
                {entry.label.split('|').map((text) => (text === 'br' ? <br key={text} /> : text))}
              </LinkLabel>
            </MenuLink>
          </MenuEntry>
        )
      })}
    </Container>
  )
}

export default PanelBody
