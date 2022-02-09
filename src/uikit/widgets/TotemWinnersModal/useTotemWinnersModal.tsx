import React from 'react'
import { useModal } from '../Modal'
import TotemWinnersModal from './TotemWinnersModal'
import { Elevation } from 'config/constants/types'
import { useTotemHistoricalData } from 'state/hooks'
import { useElevationUserTotem } from 'state/hooksNew'

interface ReturnType {
  onPresentTotemWinnersModal: () => void
  showTotemWinnersModalButton: boolean
}

const useTotemWinnersModal = (elevation: Elevation): ReturnType => {
  const { recentWinners, recentWinningsMultipliers, winsAccum } = useTotemHistoricalData(elevation)
  const showTotemWinnersModalButton = recentWinners.length > 0
  const userTotem = useElevationUserTotem(elevation)
  const [onPresentTotemWinnersModal] = useModal(
    <TotemWinnersModal
      elevation={elevation}
      userTotem={userTotem}
      recentWinners={recentWinners}
      recentWinningsMultipliers={recentWinningsMultipliers}
      winsAccum={winsAccum}
    />,
  )
  return { onPresentTotemWinnersModal, showTotemWinnersModalButton }
}

export default useTotemWinnersModal
