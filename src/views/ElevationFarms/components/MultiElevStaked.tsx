import React from 'react'
import { Flex, HighlightedText, Skeleton, Text } from 'uikit'
import { useMultiElevStaked } from 'state/hooks'
import ContributionBreakdown from './ContributionBreakdown'
import { useFarmsUserDataLoaded } from 'state/hooksNew'

const MultiElevStaked: React.FC = () => {
  const { totalTVL, tvlContributions } = useMultiElevStaked()
  const userDataLoaded = useFarmsUserDataLoaded()

  return (
    <Flex width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
      <Flex flexDirection='column' justifyContent='center' alignItems='center'>
        <Text bold monospace>YOUR STAKED VOLUME:</Text>
        { userDataLoaded ?
          <HighlightedText bold monospace style={{ display: 'flex', alignItems: 'center', lineHeight: '28px' }}>
            {'$'}{totalTVL.toFixed(2)}
          </HighlightedText> :
          <Skeleton height={24} width={180}/>
        }
      </Flex>
      <ContributionBreakdown
        loaded={userDataLoaded}
        breakingDownTitle='STAKING'
        contributions={tvlContributions}
      />
    </Flex>
  )
}

export default React.memo(MultiElevStaked)
