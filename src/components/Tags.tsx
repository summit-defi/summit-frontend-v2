import React from 'react'
import { Tag, VerifiedIcon } from 'uikit'

const NoFeeTag = ({ elevation }) => (
  <Tag variant="success" outline elevation={elevation} startIcon={<VerifiedIcon />}>
    No Fees
  </Tag>
)

export { NoFeeTag }
