import React, { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import useTheme from 'hooks/useTheme'
import { Menu as UikitMenu } from 'uikit'
import { getMenuItems } from './config'
import { getLinks } from '../../config/constants'
import { useExpeditionUserDeity, useSummitPrice } from 'state/hooksNew'
import useAuth from 'hooks/useAuth'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const Menu = (props) => {
  const { login, logout } = useAuth()
  const { account } = useActiveWeb3React()

  console.log({
    account
  })
  const { isDark, toggleTheme } = useTheme()
  const summitPriceUsd = useSummitPrice()
  const userDeity = useExpeditionUserDeity()
  const links = getLinks()
  const menuLinks = useMemo(() => {
    return getMenuItems(links.exchange, links.liquidity, userDeity)
  }, [links, userDeity])

  return (
    <UikitMenu
      account={account}
      login={login}
      logout={logout}
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
