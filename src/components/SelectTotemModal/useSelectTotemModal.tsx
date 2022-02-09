import React from 'react'
import { useModal } from 'uikit'
import SelectTotemModal from './SelectTotemModal'
import { Elevation } from 'config/constants/types'
import { useElevationUserTotem } from 'state/hooksNew'

interface ReturnType {
  onPresentSelectTotemModal: () => void
}

const useSelectTotemModal = (elevation: Elevation, preselectedTotem?: number, alsoSelectFaith = false, existingFaith?: number): ReturnType => {
  const userTotem = useElevationUserTotem(elevation)
  const [onPresentSelectTotemModal] = useModal(
    <SelectTotemModal
      elevation={elevation}
      userTotem={userTotem}
      preselectedTotem={preselectedTotem}
      alsoSelectFaith={alsoSelectFaith}
      existingFaith={existingFaith}
    />,
  )
  return { onPresentSelectTotemModal }
}

export default useSelectTotemModal
