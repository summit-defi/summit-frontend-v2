import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Flex, Text, Card, CardBody, Token3DFloating, ChevronRightIcon } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { updateSummitSwapMinimized } from 'state/summitEcosystem'
import { useDispatch } from 'react-redux'

const StyledFarmStakingCard = styled(Card)`
  height: min-content;
`

const GreyToken3DFloating = styled(Token3DFloating)`
  filter: grayscale(1);
`

const SummitSwapMinimizedCard = () => {
  const dispatch = useDispatch()

  const handleMaximizeSwapCard = useCallback(
    () => dispatch(updateSummitSwapMinimized(false)),
    [dispatch]
  )

  return (
    <StyledFarmStakingCard>
      <CardBody style={{ padding: '12px', display: 'flex', flexDirection: 'row', gap: '32px', justifyContent: 'space-between', alignItems: 'center'}}>
        <Flex flexDirection='column' alignItems='flex-start' justifyContent='center' mb='-12px'>
          <Text bold monospace letterSpacing="2px">
            SUMMIT TOKEN SWAP:
          </Text>

          <Flex justifyContent='center' alignItems='center'>
            <GreyToken3DFloating width="48px" />

            <Flex mb='12px'>
              <ChevronRightIcon width="24px" mr="-8px" key="a" />
              <ChevronRightIcon width="24px" ml="-8px" key="b" />
            </Flex>
            
            <Token3DFloating width="48px" />
          </Flex>
        </Flex>


          <SummitButton onClick={handleMaximizeSwapCard} height={24} padding={41}>
            SHOW
          </SummitButton>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default React.memo(SummitSwapMinimizedCard)
