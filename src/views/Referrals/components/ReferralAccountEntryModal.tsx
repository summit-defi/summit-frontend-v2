import React, { useCallback, useState } from 'react'
import { Modal, Flex, Text, Input } from 'uikit'
import ModalActions from 'components/ModalActions'
import styled from 'styled-components'
import SummitButton from 'uikit/components/Button/SummitButton'
import { darken } from 'polished'

interface Props {
  onCreateReferral: (address: string) => void
  onDismiss?: () => void
}

const StyledInput = styled(Input)`
  font-family: Courier Prime, monospace;
  margin-bottom: 24px;
  font-size: 12px;
  font-weight: 900;
  text-shadow: 1px 1px 2px gray;
  background-color: ${({ theme }) => darken(0.1, theme.colors.background)};
  box-shadow: ${({ theme }) => `inset 2px 2px 4px ${theme.colors.textShadow}`};
  border-radius: 16px;

  &:focus:not(:disabled) {
    box-shadow: ${({ theme }) => `inset 2px 2px 4px ${theme.colors.textShadow}`};
  }
`

const ReferralAccountEntryModal: React.FC<Props> = ({ onCreateReferral, onDismiss }) => {
  const [val, setVal] = useState('')

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  return (
    <Modal title="Enter|br|Referral" onDismiss={onDismiss} headerless elevationCircleHeader="SUMMIT.DEFI">
      <Flex justifyContent="center">
        <Text textAlign="center" mb="32px">
          Enter the address of the user referring you.
          <br />
          <b>Be careful, this can&apos;t be changed later.</b>
        </Text>
      </Flex>
      <StyledInput onChange={handleChange} placeholder="Referral Address" value={val} />
      <ModalActions>
        <SummitButton onClick={onDismiss} secondary>
          CANCEL
        </SummitButton>
        <SummitButton
          onClick={() => {
            onCreateReferral(val)
            onDismiss()
          }}
        >
          CONFIRM
        </SummitButton>
      </ModalActions>
    </Modal>
  )
}

export default ReferralAccountEntryModal
