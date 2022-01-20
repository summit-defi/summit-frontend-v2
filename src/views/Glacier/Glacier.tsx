import React from 'react'
import Page from 'components/layout/Page'
import EpochsHeaderCard from './components'
import styled from 'styled-components'
import { Flex } from 'uikit'

const HeaderCardsWrapper = styled(Flex)`
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap: 32px;
    margin: 0px auto 32px auto;
    max-width: 850px;
`

const Glacier: React.FC = () => {
  return (
    <Page>
      <HeaderCardsWrapper>
        <EpochsHeaderCard/>
      </HeaderCardsWrapper>
      {/* <FlexLayout>
        <FrozenEpochs/>
      </FlexLayout> */}
    </Page>
  )
}

export default Glacier
