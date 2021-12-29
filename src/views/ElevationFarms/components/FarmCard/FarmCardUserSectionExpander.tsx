import React, { useState, useEffect } from 'react'
import { Farm } from 'state/types'
import { Elevation } from 'config/constants/types'
import { provider } from 'web3-core'
import FarmCardUserSection from './FarmCardUserSection'

interface Props {
  expanded: boolean
  elevation: Elevation
  farm: Farm
  account?: string
  ethereum?: provider
}

const FarmCardUserSectionExpander: React.FC<Props> = (props) => {
  const { expanded } = props
  const [renderExpandedComponents, setRenderExpandedComponents] = useState(false)

  useEffect(() => {
    let collapseTimeout
    if (expanded) setRenderExpandedComponents(true)
    else collapseTimeout = setTimeout(() => setRenderExpandedComponents(false), 300)
    return () => clearTimeout(collapseTimeout)
  }, [expanded, setRenderExpandedComponents])

  if (!renderExpandedComponents) return null

  return <FarmCardUserSection
    {...props}
  />
}

export default FarmCardUserSectionExpander
