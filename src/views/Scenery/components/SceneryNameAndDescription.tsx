import { SummitPalette } from "config/constants"
import React from "react"
import { useSceneryScreenshot, useUserStrategyNameAndDescription } from "state/hooksNew"
import styled from "styled-components"
import { Flex, Text } from "uikit"
import { LogoIcon as LogoWithText } from "uikit/widgets/Menu/icons"

const ScreenshotWrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    max-width: 850px;
    margin-top: 12px;
    .summit-logo {
        width: 212px;
        display: block;
    }
`

const SceneryNameAndDescription: React.FC = () => {
    const screenshot = useSceneryScreenshot()
    // const { name, owner, description } = useUserStrategyNameAndDescription()
    const name = 'The Yankee Degen'
    const owner = 'Yankee Ruin X'
    const description = 'The Yankee Degen jumps on any Totem arb opportunity > 0.01%. Always 100% Faith in the Bear, the payouts when it hits are Euphoric. Max lock time is the only way.'

    if (screenshot) {
        return (
            <ScreenshotWrapper>
                <LogoWithText isDark={false} className='summit-logo' summitPalette={SummitPalette.BASE}/>
                <Flex flexDirection='column' alignItems='flex-end' justifyContent='center' maxWidth='550px;'>
                    <Text bold monospace fontSize='22px'>
                        {name}
                    </Text>
                    { !!owner && <Text monospace italic fontSize='16px'>
                        - by {owner}
                    </Text> }
                    <Text bold monospace small textAlign='right' mt='12px'>
                        {description}
                    </Text>
                </Flex>
            </ScreenshotWrapper>
        )
    }
    return (
        <Flex width='100%' alignItems='center' justifyContent='space-around'>
            <Text bold monospace fontSize='22px'>
                {name}
            </Text>
            <Text bold monospace>
                {description}
            </Text>
        </Flex>
    )
}

export default React.memo(SceneryNameAndDescription)