import { TokenSymbol } from "config/constants"
import React from "react"
import { useRoadmapEverestInfoWithPreset } from "state/hooksNew"
import { Flex, Text, TokenSymbolImage } from "uikit"

const RoadmapEverest: React.FC = () => {
    const { lockDuration, lockPerc } = useRoadmapEverestInfoWithPreset()
    return (
        <Flex flex='2' gap='16px' flexDirection='column' alignItems='center' justifyContent='center'>
            <Text italic textAlign='left' style={{ width: '100%' }} bold monospace>EVEREST:</Text>
            <TokenSymbolImage symbol={TokenSymbol.EVEREST} width={124} height={124}/>
            <Flex width='100%' alignItems='center' justifyContent='space-between'>
                <Text monospace>Lock Duration:</Text>
                <Text bold monospace>{lockDuration}D</Text>
            </Flex>
            <Flex width='100%' alignItems='center' justifyContent='space-between'>
                <Text monospace>% of SUMMIT Locked:</Text>
                <Text bold monospace>{lockPerc}</Text>
            </Flex>
        </Flex>
    )
}

export default React.memo(RoadmapEverest)