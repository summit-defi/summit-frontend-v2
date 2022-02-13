import { MenuEntry } from 'uikit'
import { Elevation, elevationUtils } from 'config/constants/types'
import { ChainIncludesBetaTokens, getSummitTokenAddress } from 'utils'

const getTotemIcon = (elevation, locked, totem) => {
  if (locked) return 'elevationLock'
  if (totem == null) return ''
  return elevationUtils.getTotemIcon(elevation, totem)
}

const populateLinkSummitAddress = (link: string): string => {
  return (link || '').replace('0xSUMMIT', getSummitTokenAddress())
}

export const getMenuItems = (
  exchangeLink,
  liqLink,
  userDeity,
): MenuEntry[] => [
  {
    label: 'HOME',
    href: '/',
    keyPaths: [''],
  },
  {
    label: 'V1 DAPP',
    href: 'https://app.summitdefi.com',
    external: true,
  },
  {
    label: 'EXCHANGE',
    href: populateLinkSummitAddress(exchangeLink),
    external: true,
  },
  {
    label: 'LIQUIDITY',
    href: populateLinkSummitAddress(liqLink),
    external: true,
  },
  {
    label: 'DOCS',
    href: 'https://docs.summitdefi.com',
    external: true,
  },
  {
    label: 'OBELISK AUDIT',
    href: 'https://github.com/Tibereum/obelisk-audits/blob/main/Summit.pdf',
    external: true,
  },

  {
    label: 'ELEVATION|br|FARMS',
    icon: 'totemOtter',
    href: `/elevations`,
    external: false,
    elevation: Elevation.OASIS,
    keyPaths: ['elevations', 'oasis', 'plains', 'mesa', 'summit']
  },
  {
    label: 'THE GLACIER',
    icon: 'tokens/ThawedSUMMIT.png',
    href: '/glacier',
    palette: 'GLACIER',
    external: false,
    keyPaths: ['glacier']
  },
  {
    label: 'EVEREST',
    icon: 'summit/EVERESTicon.png',
    href: '/everest',
    external: false,
    keyPaths: ['everest'],
  },
  {
    label: Elevation.EXPEDITION,
    icon: getTotemIcon(
      Elevation.EXPEDITION,
      false,
      userDeity,
    ),
    href: `/expedition`,
    external: false,
    elevation: Elevation.EXPEDITION,
    keyPaths: ['expedition'],
  },

  (ChainIncludesBetaTokens() || true) ? {
    label: 'ROLLOVER',
    href: '/rollover',
    icon: 'totemIcons/BETA.png',
    keyPaths: ['rollover']
  } : null
].filter((entry) => entry != null)
