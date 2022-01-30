import React, { useState, useEffect } from 'react'
import FarmCardUserSection from './FarmCardUserSection'

interface Props {
  isExpanded: boolean
  symbol: string
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
