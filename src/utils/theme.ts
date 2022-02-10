import { ElevOrPalette, SummitPalette } from 'config/constants/types'
import { elevationPalette, paletteSingleColor } from 'theme/colors'

export const getPaletteGradientColors = (summitPalette: ElevOrPalette | null): string[] => {
  return elevationPalette[summitPalette || SummitPalette.BASE]
}

export const getPalettePerfBackgroundColor = (summitPalette: ElevOrPalette | null): string => {
  return paletteSingleColor[summitPalette || SummitPalette.BASE]
}

export const getPaletteGradientStops = (summitPalette: ElevOrPalette | null): string[] => {
  const colors = getPaletteGradientColors(summitPalette)

  if (summitPalette === 'EXPEDITION') {
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

export const getPaletteGradientFarmCardBackground = (elevation: ElevOrPalette | null): string => {
  const colors = getPaletteGradientColors(elevation)
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
