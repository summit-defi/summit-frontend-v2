import React from 'react'
import styled from 'styled-components'
import { useSelectedElevation } from 'state/hooks'
import { useFarmType } from 'hooks/useFarmType'
import { Flex } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { FarmType } from 'state/types'
import { darken } from 'polished'
import { pressableMixin } from 'uikit/util/styledMixins'
import FarmTypeSelector from './FarmTypeSelector'
import FarmActiveSelector from './FarmActiveSelector'

const FilterRowFlex = styled(Flex)`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
`

const FarmFilterRow: React.FC = () => {
  return (
    <FilterRowFlex>
      <FarmTypeSelector />
      <FarmActiveSelector />
    </FilterRowFlex>
  )
}

export default React.memo(FarmFilterRow)
