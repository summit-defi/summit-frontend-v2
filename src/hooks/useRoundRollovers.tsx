import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Elevation } from 'config/constants/types'
import { useModal } from 'uikit'
import { ElevationsRolledOverModal } from 'components/ElevationsModals/ElevationsRolledOverModal'
// import { ElevationUnlockedModal } from 'components/ElevationsModals/ElevationUnlockedModal'
import { useElevationRoundNumbers, useElevationTotems, useElevationTotemsLockedIn, useWinningTotems } from 'state/hooks'

export const useRoundRollovers = () => {
  const [
    _1,
    _plainsTotemLockedIn,
    _mesaTotemLockedIn,
    _summitTotemLockedIn,
    expeditionTotemLockedIn,
  ] = useElevationTotemsLockedIn()
  const [_2, _plainsTotem, _mesaTotem, _summitTotem, expeditionTotem] = useElevationTotems()
  const [_3, _plainsWinningTotem, _mesaWinningTotem, _summitWinningTotem, expeditionWinningTotem] = useWinningTotems()
  const [_4, _plainsRound, _mesaRound, _summitRound, expeditionRound] = useElevationRoundNumbers()

  // const prevPlainsRound = useRef<number | null>()
  // const prevMesaRound = useRef<number | null>()
  // const prevSummitRound = useRef<number | null>()
  const prevExpeditionRound = useRef<number | null>()

  const prevElevationRolloversShownCount = useRef<number>(0)
  const [elevationRolloversToShow, setElevationRolloversToShow] = useState<Elevation[]>([])
  // const prevUnlockedElevationToShow = useRef<Elevation | null>(null)
  const [_unlockedElevationToShow, setUnlockedElevationToShow] = useState<Elevation | null>()

  // useEffect(() => {
  //     setTimeout(() => {
  //         setUnlockedElevationToShow(Elevation.MESA)
  //     }, 5000)
  // }, [])

  // useEffect(() => {
  //     setTimeout(() => {
  //       setElevationRolloversToShow((elevations) => Array.from(new Set([...elevations, Elevation.EXPEDITION])))
  //   }, 5000)
  // }, [])

  const handleClearElevationRolloversToShow = useCallback(() => {
    setElevationRolloversToShow([])
    prevElevationRolloversShownCount.current = 0
  }, [setElevationRolloversToShow])

  const [onPresentElevationRolloverModal] = useModal(
    <ElevationsRolledOverModal markShown={handleClearElevationRolloversToShow} />,
  )

  useEffect(() => {
    if (elevationRolloversToShow.length > prevElevationRolloversShownCount.current) {
      onPresentElevationRolloverModal({
        elevations: elevationRolloversToShow,
      })
    }
    prevElevationRolloversShownCount.current = elevationRolloversToShow.length
  }, [onPresentElevationRolloverModal, elevationRolloversToShow])

  // const handleClearElevationUnlockToShow = useCallback(() => {
  //   setUnlockedElevationToShow(null)
  //   prevUnlockedElevationToShow.current = null
  // }, [setUnlockedElevationToShow])

  // const [onPresentElevationUnlockedModal] = useModal(
  //   <ElevationUnlockedModal elevation={unlockedElevationToShow} markShown={handleClearElevationUnlockToShow} />,
  // )

  // useEffect(() => {
  //   if (prevUnlockedElevationToShow.current == null && unlockedElevationToShow != null) {
  //     onPresentElevationUnlockedModal()
  //   }
  //   prevUnlockedElevationToShow.current = unlockedElevationToShow
  // }, [onPresentElevationUnlockedModal, unlockedElevationToShow])

  // useEffect(() => {
  //   if (prevPlainsRound.current == null) {
  //     prevPlainsRound.current = plainsRound
  //     return
  //   }
  //   if (plainsRound === prevPlainsRound.current) {
  //     return
  //   }
  //   if (prevPlainsRound.current === 0 && plainsRound === 1) {
  //     setUnlockedElevationToShow(Elevation.PLAINS)
  //   } else if (
  //     plainsTotem === plainsWinningTotem &&
  //     plainsTotemLockedIn &&
  //     plainsRound > (prevPlainsRound.current || 0)
  //   ) {
  //     setElevationRolloversToShow((elevations) => [...elevations, Elevation.PLAINS])
  //   }
  //   prevPlainsRound.current = plainsRound
  // }, [
  //   plainsTotem,
  //   plainsWinningTotem,
  //   plainsTotemLockedIn,
  //   plainsRound,
  //   setElevationRolloversToShow,
  //   setUnlockedElevationToShow,
  // ])

  // useEffect(() => {
  //   if (prevMesaRound.current == null) {
  //     prevMesaRound.current = mesaRound
  //     return
  //   }
  //   if (mesaRound === prevMesaRound.current) {
  //     return
  //   }
  //   if (prevMesaRound.current === 0 && mesaRound === 1) {
  //     setUnlockedElevationToShow(Elevation.MESA)
  //   } else if (mesaTotem === mesaWinningTotem && mesaTotemLockedIn && mesaRound > (prevMesaRound.current || 0)) {
  //     setElevationRolloversToShow((elevations) => [...elevations, Elevation.MESA])
  //   }
  //   prevMesaRound.current = mesaRound
  // }, [
  //   mesaTotem,
  //   mesaWinningTotem,
  //   mesaRound,
  //   mesaTotemLockedIn,
  //   setElevationRolloversToShow,
  //   setUnlockedElevationToShow,
  // ])

  // useEffect(() => {
  //   if (prevSummitRound.current == null) {
  //     prevSummitRound.current = summitRound
  //     return
  //   }
  //   if (summitRound === prevSummitRound.current) {
  //     return
  //   }
  //   if (prevSummitRound.current === 0 && summitRound === 1) {
  //     setUnlockedElevationToShow(Elevation.SUMMIT)
  //   } else if (
  //     summitTotem === summitWinningTotem &&
  //     summitTotemLockedIn &&
  //     summitRound > (prevSummitRound.current || 0)
  //   ) {
  //     setElevationRolloversToShow((elevations) => [...elevations, Elevation.SUMMIT])
  //   }
  //   prevSummitRound.current = summitRound
  // }, [
  //   summitTotem,
  //   summitWinningTotem,
  //   summitTotemLockedIn,
  //   summitRound,
  //   setElevationRolloversToShow,
  //   setUnlockedElevationToShow,
  // ])

  useEffect(() => {
    if (prevExpeditionRound.current == null) {
      prevExpeditionRound.current = expeditionRound
      return
    }
    if (expeditionRound === prevExpeditionRound.current) {
      return
    }
    if (prevExpeditionRound.current === 0 && expeditionRound === 1) {
      setUnlockedElevationToShow(Elevation.EXPEDITION)
    } else if (
      expeditionTotem === expeditionWinningTotem &&
      expeditionTotemLockedIn &&
      expeditionRound > (prevExpeditionRound.current || 0)
    ) {
      setElevationRolloversToShow((elevations) => [...elevations, Elevation.EXPEDITION])
    }
    prevExpeditionRound.current = expeditionRound
  }, [
    expeditionTotem,
    expeditionWinningTotem,
    expeditionTotemLockedIn,
    expeditionRound,
    setElevationRolloversToShow,
    setUnlockedElevationToShow,
  ])
}
