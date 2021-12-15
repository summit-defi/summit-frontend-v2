import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import Heading from '../../components/Heading/Heading'
import Flex from '../../components/Box/Flex'
import { ArrowBackIcon, CloseIcon } from '../../components/Svg'
import { IconButton } from '../../components/Button'
import { InjectedProps } from './types'
import { elevationUtils } from 'config/constants/types'
import { getElevationGradientFarmCardBackground } from 'utils'
import { Text } from 'uikit/components/Text'
import { ElevationPuck } from './ElevationPuck'

interface Props extends InjectedProps {
  title: string
  hideCloseButton?: boolean
  onBack?: () => void
  bodyPadding?: string
  headerless?: boolean
  elevationGlow?: string
  elevationCircleHeader?: string
}

const RainbowLight = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const StyledModal = styled.div<{ elevationGlow?: string }>`
  position: relative;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin: 12px;
  width: 100%;
  z-index: ${({ theme }) => theme.zIndices.modal};
  overflow: visible;
  max-height: calc(100% - 100px);
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: calc(100% - 140px);
    width: auto;
    min-width: 340px;
    max-width: calc(100% - 18px);
    margin-top: 130px;
  }

  ${({ elevationGlow, theme }) =>
    elevationGlow != null &&
    css`
      &:before {
        content: ' ';
        background: ${getElevationGradientFarmCardBackground(elevationGlow)};

        background-size: 200% 200%;
        animation: ${RainbowLight} 2s linear infinite;
        border-radius: 6px;
        filter: blur(3px);
        position: absolute;
        top: -5px;
        right: -5px;
        bottom: -5px;
        left: -5px;
        z-index: -2;
        transition: filter 0.2s;
      }
      &:after {
        content: ' ';
        background: ${theme.colors.background};
        border-radius: 6px;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: -1;
      }
    `}
`

const ScrollableContent = styled(Flex)<{ elevationCircleHeader: string }>`
  overflow: scroll;
  height: 100%;
  padding-top: ${({ elevationCircleHeader }) => (elevationCircleHeader != null ? 130 : 24)}px;
`

const StyledCloseIcon = styled(CloseIcon)`
  fill: ${({ theme }) => (theme.isDark ? theme.colors.EXPEDITION : '')};
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  align-items: center;
  padding: 12px 24px;
`

const ModalTitle = styled(Flex)`
  align-items: center;
  flex: 1;
`

const AbsoluteIconButton = styled(IconButton)`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
`

const Modal: React.FC<Props> = ({
  title,
  onDismiss,
  onBack,
  children,
  hideCloseButton = false,
  bodyPadding = '24px',
  headerless = false,
  elevationGlow,
  elevationCircleHeader,
}) => (
  <StyledModal elevationGlow={elevationGlow}>
    <ElevationPuck elevation={elevationCircleHeader}>
      <Text fontSize="16px" color="inherit" mb="2px">
        {elevationUtils.modalTitle(elevationCircleHeader)}
      </Text>
      {title.split('|').map((text) => (text === 'br' ? <br key={text} /> : text))}
    </ElevationPuck>
    {!headerless && (
      <ModalHeader>
        <ModalTitle>
          {onBack && (
            <IconButton variant="text" onClick={onBack} area-label="go back" mr="8px">
              <ArrowBackIcon color="primary" />
            </IconButton>
          )}
          <Heading>{title}</Heading>
        </ModalTitle>
        {!hideCloseButton && (
          <IconButton variant="text" onClick={onDismiss} aria-label="Close the dialog">
            <StyledCloseIcon color="primary" />
          </IconButton>
        )}
      </ModalHeader>
    )}
    <ScrollableContent flexDirection="column" p={bodyPadding} elevationCircleHeader={elevationCircleHeader}>
      {children}
      {headerless && !hideCloseButton && (
        <AbsoluteIconButton variant="text" onClick={onDismiss} aria-label="Close the dialog">
          <StyledCloseIcon color="primary" />
        </AbsoluteIconButton>
      )}
    </ScrollableContent>
  </StyledModal>
)

export default Modal
