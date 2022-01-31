import React, { useMemo } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useTheme from 'hooks/useTheme'
import {
  useElevationsLocked,
} from 'state/hooks'
import { Menu as UikitMenu } from 'uikit'
import { getMenuItems } from './config'
import { getLinks } from '../../config/constants'
import { useExpeditionUserDeity, useSummitPrice } from 'state/hooksNew'

const Menu = (props) => {
  const { account, connect, reset } = useWallet()
  const { isDark, toggleTheme } = useTheme()
  const summitPriceUsd = useSummitPrice()
  const userDeity = useExpeditionUserDeity()
  const elevationsLocked = useElevationsLocked()
  const links = getLinks()
  const menuLinks = useMemo(() => {
    return getMenuItems(links.exchange, links.liquidity, userDeity, elevationsLocked)
  }, [links, userDeity, elevationsLocked])

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
