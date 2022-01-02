import React from 'react'
import { useModal } from '../Modal'
import { useElevationTotem } from 'state/hooks'
import SelectTotemModal from './SelectTotemModal'
import { Elevation, elevationUtils } from 'config/constants/types'

interface ReturnType {
  onPresentSelectTotemModal: () => void
}

const useSelectTotemModal = (elevation: Elevation, preselectedTotem?: number): ReturnType => {
  const userTotem = useElevationTotem(elevation)
  const [onPresentSelectTotemModal] = useModal(
    <SelectTotemModal
      elevation={elevation}
      userTotem={userTotem}
      preselectedTotem={preselectedTotem}
    />,
  )
  return { onPresentSelectTotemModal }
}

export default useSelectTotemModal
