import React, { useState, useEffect } from 'react'
import { Farm, UserTokenData } from 'state/types'
import { Elevation } from 'config/constants/types'
import { provider } from 'web3-core'
import FarmCardUserSection from './FarmCardUserSection'

interface Props {
  isExpanded: boolean
  elevation: Elevation
  farm: Farm
  tokenInfo: UserTokenData
  account?: string
  ethereum?: provider
}

const FarmCardUserSectionExpander: React.FC<Props> = (props) => {
  const { isExpanded } = props
  const [renderExpandedComponents, setRenderExpandedComponents] = useState(false)

  useEffect(() => {
    let collapseTimeout
    if (isExpanded) setRenderExpandedComponents(true)
    else collapseTimeout = setTimeout(() => setRenderExpandedComponents(false), 300)
    return () => clearTimeout(collapseTimeout)
  }, [isExpanded, setRenderExpandedComponents])

  if (!renderExpandedComponents) return null

  return <FarmCardUserSection
    {...props}
  />
}

export default FarmCardUserSectionExpander
