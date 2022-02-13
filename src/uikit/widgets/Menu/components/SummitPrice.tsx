import { getLinks } from 'config/constants'
import React from 'react'
import styled from 'styled-components'
import { pressableMixin } from 'uikit/util/styledMixins'
import { getSummitTokenAddress } from 'utils'
import { LogoRoundIcon } from '../../../components/Svg'
import { Text } from '../../../components/Text/Text'

interface Props {
  summitPriceUsd?: number
}

const PriceLink = styled.a`
  display: flex;
  opacity: 0.5;
  align-items: center;
  margin-right: 18px;
  margin-left: 18px;

  ${pressableMixin}
`

const SummitPrice: React.FC<Props> = ({ summitPriceUsd }) => {
  const populatedSummitTokenLink = (getLinks().summitTokenLink || '').replace('0xSUMMIT', getSummitTokenAddress())
  return (
    <PriceLink href={populatedSummitTokenLink} rel="noreferrer noopener" target="_blank">
      <LogoRoundIcon width="36px" mr="8px" />
      <Text monospace bold style={{ marginLeft: '18px' }}>{`$${
        summitPriceUsd ? summitPriceUsd.toFixed(3) : 'XX.XX'
      }`}</Text>
    </PriceLink>
  )
}

export default React.memo(SummitPrice, (prev, next) => prev.summitPriceUsd === next.summitPriceUsd)
