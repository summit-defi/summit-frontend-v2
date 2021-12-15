import { Elevation } from 'config/constants/types'
import { AnchorHTMLAttributes } from 'react'
import { TextProps } from '../Text'

export interface LinkProps extends TextProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean
  elevation?: Elevation
}
