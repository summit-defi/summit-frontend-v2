import { Elevation } from 'config/constants/types'
import React from 'react'
import { useSelectedElevation } from 'state/hooks'
import styled from 'styled-components'

const BackgroundImage = styled.div<{ elevation: Elevation | null }>`
  background-image: ${({ theme, elevation }) => `url("/images/summit/background${elevation || 'BASE'}${theme.isDark ? '_DARK' : '_LIGHT'}.jpg")`};
  position: fixed;
  background-position: center right;
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
`

// const SummitCloudsMovement = keyframes`
//   0% {
//     transform: translate(0, 0) scale(1.25);
//     opacity: 0;
//   }
//   1% {
//   }
//   10% {
//     opacity: 1;
//   }
//   90% {
//     opacity: 1;
//   }
//   100% {
//     transform: translate(10%, -40%) scale(1.25);
//     opacity: 0;
//   }
// `

// const SummitCloudsImage = styled.div`
//   position: fixed;
//   background-image: ${({ theme }) => `url("/images/summit/cloudOverlay${theme.isDark ? '_DARK' : ''}.png")`};
//   background-size: auto 100%;
//   animation: ${SummitCloudsMovement} 90s linear infinite;
//   top: 0;
//   right: 0;
//   height: 100%;
//   width: 100%;
//   pointer-events: none;
// `

// const ExpeditionExclusion = styled.div<{ elevation: Elevation | null }>`
//   opacity: ${({ elevation }) => (elevation !== Elevation.EXPEDITION ? 1 : 0)};
// `

const ElevationBackground: React.FC = () => {
  const elevation = useSelectedElevation()
  // const isPerformant = false

  return <BackgroundImage elevation={elevation} />

  // return (
  //   <>
  //     <ExpeditionExclusion elevation={elevation}>
  //       <SummitCloudsImage />
  //     </ExpeditionExclusion>
  //   </>
  // )
}

export default React.memo(ElevationBackground)
