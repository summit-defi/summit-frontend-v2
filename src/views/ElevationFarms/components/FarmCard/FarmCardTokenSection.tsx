import React from 'react'
import { Flex } from 'uikit'
import { Elevation } from 'config/constants/types'
import BoundedProgressBar from '../BoundedProgressBar'
import { timestampToDate } from 'utils'
import { clamp } from 'lodash'
import { useCurrentTimestampOnce } from 'state/hooks'

interface Props {
  bonusResetTimestamp: number
  taxResetTimestamp: number
  depositFeeBP: number
  maxTaxBP: number
  minTaxBP: number
  currentTaxBP: number
  maxBonusBP: number
  currentBonusBP: number
  native: boolean
  elevation: Elevation
}

const week = (3600 * 24 * 7)

const FarmCardTokenSection: React.FC<Props> = ({ bonusResetTimestamp, taxResetTimestamp, depositFeeBP, maxTaxBP, minTaxBP, currentTaxBP, maxBonusBP, currentBonusBP, native, elevation }) => {  
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
          elevation={elevation}
        />
      }

      { maxTaxBP > 0 &&
        <BoundedProgressBar
          title='FAIRNESS|br|TAX'
          minTitle={taxStartDate}
          maxTitle={taxEndDate}
          leftPerc={maxTaxBP / 100}
          rightPerc={native ? 0 : (minTaxBP / 100)}
          currPerc={currentTaxBP / 100}
          elevation={elevation}
        />
      }

      <BoundedProgressBar
        title='LOYALTY|br|BONUS'
        minTitle={bonusStartDate}
        maxTitle={bonusEndDate}
        leftPerc={0}
        rightPerc={maxBonusBP / 100}
        currPerc={currentBonusBP / 100}
        elevation={elevation}
      />
    </Flex>
  )
}

export default FarmCardTokenSection
