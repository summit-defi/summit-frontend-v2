import { Elevation } from 'config/constants/types'
import { elevationPalette } from 'theme/colors'

export const getElevationGradientColors = (elevation: Elevation | string | null): string[] => {
  return elevationPalette[elevation || 'BASE']
}

export const getElevationGradientStops = (elevation: Elevation | string | null): string[] => {
  const colors = getElevationGradientColors(elevation)

  if (elevation === Elevation.EXPEDITION) {
    return [
      `${colors[0]} 20%`,
      // `${colors[1]} 21%`,
      `${colors[1]} 35%`,
      // `${colors[2]} 36%`,
      `${colors[2]} 50%`,
      // `${colors[3]} 51%`,
      `${colors[3]} 65%`,
      // `${colors[4]} 66%`,
      `${colors[4]} 80%`,
      // `${colors[5]} 81%`,
      `${colors[4]} 100%`,
    ]
  }

  return [
    `${colors[0]} 20%`,
    `${colors[1]} 21%`,
    `${colors[1]} 35%`,
    `${colors[2]} 36%`,
    `${colors[2]} 50%`,
    `${colors[3]} 51%`,
    `${colors[3]} 65%`,
    `${colors[4]} 66%`,
    `${colors[4]} 80%`,
    `${colors[5]} 81%`,
  ]
}

export const getElevationGradientFarmCardBackground = (elevation: Elevation | string | null): string => {
  const colors = getElevationGradientColors(elevation)
  return `
    linear-gradient(
        135deg,
        ${colors[0]} 0%,
        ${colors[1]} 20%,
        ${colors[2]} 35%,
        ${colors[3]} 50%,
        ${colors[4]} 65%,
        ${colors[5]} 80%,
        ${colors[5]} 100%
    );
    `
}
