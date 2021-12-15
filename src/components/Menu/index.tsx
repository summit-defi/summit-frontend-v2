import React, { useMemo } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useTheme from 'hooks/useTheme'
import {
  useElevationTotems,
  useElevationTotemsLockedIn,
  useSummitPrice,
  useSummitEnabled,
  useElevationsLocked,
} from 'state/hooks'
import { Menu as UikitMenu } from 'uikit'
import { getMenuItems } from './config'
import { getLinks } from '../../config/constants'

const Menu = (props) => {
  const { account, connect, reset } = useWallet()
  const { isDark, toggleTheme } = useTheme()
  const summitPriceUsd = useSummitPrice()
  const userTotems = useElevationTotems()
  const summitEnabled = useSummitEnabled()
  const totemsLockedIn = useElevationTotemsLockedIn()
  const elevationsLocked = useElevationsLocked()
  const links = getLinks()
  const menuLinks = useMemo(() => {
    return getMenuItems(summitEnabled, links.exchange, links.liquidity, userTotems, totemsLockedIn, elevationsLocked)
  }, [summitEnabled, links, userTotems, totemsLockedIn, elevationsLocked])

  return (
    <UikitMenu
      account={account}
      login={connect}
      logout={reset}
      isDark={isDark}
      toggleTheme={toggleTheme}
      summitPriceUsd={summitPriceUsd?.toNumber()}
      links={menuLinks}
      priceLink={links.exchange}
      {...props}
    />
  )
}

export default Menu
