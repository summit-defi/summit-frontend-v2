import React from 'react'
import { Flex, HighlightedText, Text } from 'uikit'
import { useMultiElevStaked } from 'state/hooks'
import ContributionBreakdown from './ContributionBreakdown'

const MultiElevStaked: React.FC = () => {
  const { totalTVL, tvlContributions } = useMultiElevStaked()

  return (
    <Flex width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
      <Flex flexDirection='column' justifyContent='center' alignItems='center'>
        <Text bold monospace>YOUR TVL:</Text>
        <HighlightedText bold monospace style={{ display: 'flex', alignItems: 'center', lineHeight: '28px' }}>
          {'$'}{totalTVL.toFixed(2)}
        </HighlightedText>
      </Flex>
      <ContributionBreakdown
        contributions={tvlContributions}
      />
    </Flex>
  )
}

export default React.memo(MultiElevStaked)
