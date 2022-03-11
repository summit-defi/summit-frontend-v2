import { getLinks } from 'config/constants'
import React from 'react'
import styled from 'styled-components'
import { pressableMixin } from 'uikit/util/styledMixins'
import { SummitPopUp } from 'uikit/widgets/Popup'
import { getSummitTokenAddress } from 'utils'
import { LogoRoundIcon } from '../../../components/Svg'
import { Text } from '../../../components/Text/Text'
import SummitTokenPopUp from './SummitTokenPopUp'

interface Props {
  summitPriceUsd?: number
}

const PriceLink = styled.div`
  display: flex;
  opacity: 0.5;
  gap: 6px;
  align-items: center;

  ${pressableMixin}
`

const SummitPrice: React.FC<Props> = ({ summitPriceUsd }) => {
  return (
    <SummitPopUp
      position='bottom right'
      button={
        <PriceLink>
          <LogoRoundIcon width="32px" />
          <Text monospace bold>{`$${
            summitPriceUsd ? summitPriceUsd.toFixed(3) : 'XX.XX'
          }`}</Text>
        </PriceLink>
      }
      contentPadding='12px'
      popUpContent={
        <SummitTokenPopUp summitPriceUsd={summitPriceUsd}/>
      }
    />
  )
}

export default React.memo(SummitPrice, (prev, next) => prev.summitPriceUsd === next.summitPriceUsd)
