import React, { cloneElement, ElementType, isValidElement } from 'react'
import styled from 'styled-components'
import getExternalLinkProps from '../../util/getExternalLinkProps'
import { Lock, Spinner } from '../Svg'
import SummitStyledButton from './SummitStyledButton'
import { ButtonProps, scales, variants } from './types'

const StyledLock = styled(Lock)`
  position: absolute;
  align-self: center;
  transform: rotate(20deg);
  fill: white;
  filter: drop-shadow(0px 0px 8px black) drop-shadow(0px 0px 2px black);
`
const StyledSpinner = styled(Spinner)`
  position: absolute;
  align-self: center;
  filter: drop-shadow(0px 0px 4px black);
`

const SummitButton = <E extends ElementType = 'button'>(props: ButtonProps<E>): JSX.Element => {
  const {
    startIcon,
    endIcon,
    external,
    className,
    isLoading,
    isLocked,
    disabled,
    secondary,
    children,
    summitPalette,
    style,
    onClick,
    ...rest
  } = props
  const internalProps = external ? getExternalLinkProps() : {}
  const isDisabled = isLoading || disabled
  const classNames = className ? [className] : []

  if (isLoading) {
    classNames.push('summit-button--loading')
  }

  if (isDisabled && !isLoading) {
    classNames.push('summit-button--disabled')
  }

  const handleClick = () => {
    if (isLoading || isLocked || isDisabled) return
    onClick()
  }

  return (
    <SummitStyledButton
      $isLoading={isLoading}
      isLocked={isLocked}
      className={classNames.join(' ')}
      summitPalette={summitPalette}
      secondary={secondary}
      disabled={isDisabled || isLocked}
      style={{ ...style }}
      onClick={handleClick}
      {...internalProps}
      {...rest}
    >
      <>
        {isLocked && <StyledLock width="28px" />}
        {isLoading && <StyledSpinner className="spinner" />}
        {isValidElement(startIcon) &&
          cloneElement(startIcon, {
            mr: '0.5rem',
          })}
        {children}
        {isValidElement(endIcon) &&
          cloneElement(endIcon, {
            ml: '0.5rem',
          })}
      </>
    </SummitStyledButton>
  )
}

SummitButton.defaultProps = {
  isLoading: false,
  isLocked: false,
  external: false,
  variant: variants.PRIMARY,
  scale: scales.MD,
  disabled: false,
  elevation: null,
  href: null,
  secondary: false,
  secondaryColor: null,
}

export default SummitButton
