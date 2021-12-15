import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from 'uikit'

const PoolFarmSwitcher = () => {
  const { url, isExact } = useRouteMatch()

  return (
    <Wrapper>
      <ButtonMenu activeIndex={!isExact ? 1 : 0} scale="sm" variant="subtle">
        <ButtonMenuItem as={Link} to={`${url}`}>
          Pools
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${url}/farm`}>
          Farms
        </ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )
}

export default PoolFarmSwitcher

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`
