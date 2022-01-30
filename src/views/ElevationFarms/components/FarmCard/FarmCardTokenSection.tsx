import React from 'react'
import { Flex } from 'uikit'
import BoundedProgressBar from '../BoundedProgressBar'
import { timestampToDate } from 'utils'
import { useFarmUserTokenSectionInfo } from 'state/hooksNew'

interface Props {
  symbol: string
}

const week = (3600 * 24 * 7)
const maxBonusBP = 700

const FarmCardTokenSection: React.FC<Props> = ({ symbol }) => {  
  const {
    depositFeeBP,

    maxTaxBP,
    minTaxBP,
    currentTaxBP,
    taxResetTimestamp,

    currentBonusBP,
    bonusResetTimestamp,
  } = useFarmUserTokenSectionInfo(symbol)

  const taxStartDate = timestampToDate(taxResetTimestamp)
  const taxEndDate = timestampToDate(taxResetTimestamp + week)
  
  const bonusStartTimestamp = bonusResetTimestamp + week
  const bonusStartDate = timestampToDate(bonusStartTimestamp)
  const bonusEndDate = timestampToDate(bonusStartTimestamp + week)

  return (
    <Flex flexWrap='wrap' justifyContent='center' flexDirection='row' width='100%' mb='18px' mt='6px' style={{gap: '24px'}}>
      { depositFeeBP > 0 &&
        <BoundedProgressBar
          title='DEPOSIT|br|FEE'
          currPerc={depositFeeBP / 100}
        />
      }

      { maxTaxBP > 0 &&
        <BoundedProgressBar
          title='FAIRNESS|br|TAX'
          minTitle={taxStartDate}
          maxTitle={taxEndDate}
          leftPerc={maxTaxBP / 100}
          rightPerc={minTaxBP / 100}
          currPerc={currentTaxBP / 100}
        />
      }

      <BoundedProgressBar
        title='LOYALTY|br|BONUS'
        minTitle={bonusStartDate}
        maxTitle={bonusEndDate}
        leftPerc={0}
        rightPerc={maxBonusBP / 100}
        currPerc={currentBonusBP / 100}
      />
    </Flex>
  )
}

export default React.memo(FarmCardTokenSection)
