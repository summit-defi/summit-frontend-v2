import React, { useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex } from 'uikit'
import { Farm, UserTokenData } from 'state/types'
import { Elevation } from 'config/constants/types'
import { provider } from 'web3-core'
import FarmCardTokenSection from './FarmCardTokenSection'
import FarmCardUserInteractionSection from './FarmCardUserInteractionSection'

const ExpandableSection = styled(Flex)<{ isExpanded: boolean, elevation?: Elevation }>`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 300ms;
  overflow: hidden;
  padding-left: 24px;
  padding-right: 24px;
  max-height: ${({ isExpanded, elevation }) => (isExpanded ? (elevation == null ? '171px' : '500px') : '0px')};
  opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
`

const BottomPadding = styled.div`
  width: 100px;
  height: 24px;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin-bottom: 12px;
  width: 100%;
`

const MobileVerticalFlex = styled(Flex)`
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 12px;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
`

const MobileVerticalFlexText = styled(MobileVerticalFlex)`
  ${({ theme }) => theme.mediaQueries.nav} {
    justify-content: space-around;
  }
`

interface Props {
  isExpanded: boolean
  elevation: Elevation
  farm: Farm
  tokenInfo: UserTokenData
  account?: string
  ethereum?: provider
}
const FarmCardUserSection: React.FC<Props> = (props) => {
  const { isExpanded: expanded, elevation, farm, tokenInfo, account, ethereum } = props
  const {
    depositFeeBP,
    taxBP,
    native,
  } = farm

  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    setIsExpanded(expanded)
  }, [expanded, setIsExpanded])

  // FARM TOKEN SECTION
  const tokenSection = useCallback(
    () => <FarmCardTokenSection
      bonusResetTimestamp={tokenInfo.bonusResetTimestamp}
      taxResetTimestamp={tokenInfo.taxResetTimestamp}
      depositFeeBP={depositFeeBP}
      maxTaxBP={taxBP}
      minTaxBP={100}
      currentTaxBP={tokenInfo.taxBP}
      maxBonusBP={700}
      currentBonusBP={tokenInfo.bonusBP}
      native={native}
      elevation={elevation}
    />,
    [tokenInfo, depositFeeBP, taxBP, native, elevation]
  )

  return (
    <ExpandableSection isExpanded={isExpanded} elevation={elevation}>
      <Divider />
      {tokenSection()}
      { elevation != null && 
        <>
          <Divider/>
          <FarmCardUserInteractionSection
            elevation={elevation}
            farm={farm}
            tokenInfo={tokenInfo}
            account={account}
            ethereum={ethereum}
          />
          <BottomPadding/>
        </>
      }
    </ExpandableSection>
  )
}

export default FarmCardUserSection
