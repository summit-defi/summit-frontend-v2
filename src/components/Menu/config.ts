import { MenuEntry } from 'uikit'
import { Elevation, elevationUtils } from 'config/constants/types'
import { getSummitTokenAddress } from 'utils'

const getTotemIcon = (elevation, locked, totem, totemInUse) => {
  if (locked) return 'elevationLock'
  if (!totemInUse) return ''
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
  totemsLockedIn,
  elevationsLocked,
): MenuEntry[] => [
  {
    label: 'HOME',
    href: '/',
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
    label: 'OBELISK|br|AUDIT',
    href: 'https://github.com/Tibereum/obelisk-audits/blob/main/Summit.pdf',
    external: true,
    icon: 'totemIcons/AUDIT.png',
    neverHighlight: true,
  },
  {
    label: Elevation.OASIS,
    icon: 'totemOtter',
    href: `/oasis`,
    external: false,
    elevation: Elevation.OASIS,
  },
  ...elevationUtils.elevationOnly.map((elevation) => ({
    label: Elevation[elevation],
    icon: getTotemIcon(
      elevation,
      elevationsLocked[elevationUtils.toInt(elevation)],
      totems[elevation],
      totemsLockedIn[elevationUtils.toInt(elevation)],
    ),
    href: `/${elevation.toLowerCase()}`,
    external: false,
    elevation,
  })),
  {
    label: Elevation.EXPEDITION,
    icon: getTotemIcon(
      Elevation.EXPEDITION,
      elevationsLocked[elevationUtils.toInt(Elevation.EXPEDITION)],
      totems[Elevation.EXPEDITION],
      totemsLockedIn[elevationUtils.toInt(Elevation.EXPEDITION)],
    ),
    href: `/expedition`,
    external: false,
    elevation: Elevation.EXPEDITION,
  },
  {
    label: 'REFERRALS',
    href: `/referrals`,
    icon: 'totemIcons/ADDRESS.png',
    external: false,
  },
]
