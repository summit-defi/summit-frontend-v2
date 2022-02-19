import { SummitPalette } from "config/constants"
import useTheme from "hooks/useTheme"
import React from "react"
import { useRoadmapScreenshot, useUserStrategyTitleOwnerDescWithPreset } from "state/hooksNew"
import styled from "styled-components"
import { Flex, Text } from "uikit"
import { LogoIcon as LogoWithText } from "uikit/widgets/Menu/icons"

const ScreenshotWrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 12px;
    justify-content: space-between;
    align-items: flex-start;
    max-width: 850px;
    margin-top: 12px;
    .summit-logo {
        width: 212px;
        display: block;
    }

    ${({ theme }) => theme.mediaQueries.nav} {
        flex-direction: row;
        gap: 0px;
    }
`

const SummitDefiLogoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    justify-content: center;
    margin-top: -48px;
    
    ${({ theme }) => theme.mediaQueries.nav} {
        align-items: flex-start;
        justify-content: center;
        margin-top: 0px;
    }
`

const RoadmapNameAndDescription: React.FC = () => {
    const { isDark } = useTheme()
    const screenshot = useRoadmapScreenshot()
    const {
        title,
        owner,
        description,
    } = useUserStrategyTitleOwnerDescWithPreset()

    if (screenshot) {
        return (
            <ScreenshotWrapper>
                <SummitDefiLogoWrapper>
                    <LogoWithText isDark={isDark} className='summit-logo' summitPalette={SummitPalette.BASE}/>
                    <Text monospace italic ml='6px'>
                        https://summitdefi.com
                    </Text>
                </SummitDefiLogoWrapper>
                <Flex flexDirection='column' alignItems='flex-end' justifyContent='center' maxWidth='550px;'>
                    <Text bold monospace fontSize='22px' mt='4px'>
                        {title}
                    </Text>
                    { !!owner && <Text monospace italic fontSize='16px' style={{width: '100%'}} textAlign='end'>
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
                {title}
            </Text>
            <Text bold monospace>
                {description}
            </Text>
        </Flex>
    )
}

export default React.memo(RoadmapNameAndDescription)