import { MenuEntry } from 'uikit'
import { Elevation, elevationUtils } from 'config/constants/types'
import { getSummitTokenAddress } from 'utils'

const getTotemIcon = (elevation, locked, totem) => {
  if (locked) return 'elevationLock'
  if (totem == null) return ''
  return elevationUtils.getTotemIcon(elevation, totem)
}

const populateLinkSummitAddress = (link: string): string => {
  return (link || '').replace('0xSUMMIT', getSummitTokenAddress())
}

export const getMenuItems = (
  summitEnabled,
  exchangeLink,
  liqLink,
  totems,
  elevationsLocked,
): MenuEntry[] => [
  {
    label: 'HOME',
    href: '/',
    keyPaths: [''],
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
    label: 'BETA',
    href: '/beta',
    icon: 'totemIcons/BETA.png',
    keyPaths: ['beta']
  },

  {
    label: 'OBELISK|br|AUDIT',
    href: 'https://github.com/Tibereum/obelisk-audits/blob/main/Summit.pdf',
    external: true,
    icon: 'totemIcons/AUDIT.png',
    neverHighlight: true,
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
    icon: '',
    href: '/glacier',
    external: false,
    keyPaths: ['glacier']
  },
  {
    label: 'EVEREST',
    icon: '',
    href: './everest',
    external: false,
    keyPaths: ['everest'],
  },
  {
    label: Elevation.EXPEDITION,
    icon: getTotemIcon(
      Elevation.EXPEDITION,
      elevationsLocked[elevationUtils.toInt(Elevation.EXPEDITION)],
      totems[Elevation.EXPEDITION],
    ),
    href: `/expedition`,
    external: false,
    elevation: Elevation.EXPEDITION,
    keyPaths: ['expedition'],
  },
]
