import React from 'react'
import styled from 'styled-components'
import Flex from 'uikit/components/Box/Flex'
import { Text } from 'uikit/components/Text'

const ButtonHeight = 46

const Wrapper = styled(Flex)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 340px;
    height: 46px;
    gap: 12px;
`

const ExpeditionIcon = styled.div`
    background-image: url("/images/summit/elevationArtworkEXPEDITION.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 75%;
    border-radius: 23px;
    width: 200px;
    height: ${ButtonHeight - 4}px;
    align-items: center;
    justify-content: center;
    display: flex;
`

const IconText = styled(Text)`
    text-shadow: 1px 1px 2px ${({ theme }) => theme.colors.card};
`


const ExpeditionMenuHeader: React.FC = () => {
    return (
        <Wrapper>
            <ExpeditionIcon>
                <IconText bold monospace lineHeight='14px' textAlign='center'>
                    THE
                    <br/>
                    EXPEDITION
                </IconText>
            </ExpeditionIcon>
        </Wrapper>
    )
}

export default React.memo(ExpeditionMenuHeader)