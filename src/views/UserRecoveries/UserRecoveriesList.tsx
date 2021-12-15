import React, { useCallback } from 'react'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import PageLoader from 'components/PageLoader'
import UserRecoveryCard from './UserRecoveryCard'
import { useRecovery } from 'hooks/useRecovery'
import styled from 'styled-components'
import { ElevationPuck, Flex, HighlightedText, Text } from 'uikit'

const InfoCard = styled(Flex)`
  position: relative;
  z-index: 10;
  padding: 16px;
  padding-top: 124px;
  margin: 100px auto 32px auto;
  max-width: 650px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`

const UserRecoveriesList: React.FC = () => {
  const { userRecoveries, recoveriesLoaded } = useRecovery()

  const userRecoveriesList = useCallback(
    (userRecoveryInfos) => userRecoveryInfos.map((userRecovery) => (
      <UserRecoveryCard
        key={userRecovery.symbol}
        userRecovery={userRecovery}
      />
    )),
    [],
  )

  return (
    <Page>
      <InfoCard>
        <ElevationPuck elevation='BASE'>
          <Text bold fontSize='24px' color='#CB0000'>
            RECOVER
            <br/>
            FUNDS
          </Text>
        </ElevationPuck>
        <Text bold monospace textAlign='center'>
          Any recoverable funds will be available below.
          <br/>
          <br/>
          If your funds are missing below, please let the
          <br/>
          team know in the Support channel on Discord.
          <br/>
          <br/>
          To recover your funds use the {'\''}RECOVER{'\''} button,
          <br/>
          this will send you your funds, and any SUMMIT / MIM
          <br/>
          earned during the period your funds were stuck.
          <br/>
          <br/>
          <br/>
          <Text italic monospace>
            The lock icon means that recovery is not available yet,
            <br/>
            and will be turned on soon
          </Text>
        </Text>
      </InfoCard>
      {!recoveriesLoaded && <PageLoader fill={false} loadingText='Loading User Recoveries' />}
      {recoveriesLoaded && (
        <FlexLayout>
          {userRecoveriesList(userRecoveries)}
        </FlexLayout>
      )}
    </Page>
  )
}

export default UserRecoveriesList
