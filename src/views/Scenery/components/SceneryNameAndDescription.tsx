import React from "react"
import { Flex } from "uikit"

const SceneryNameAndDescription: React.FC = () => {
    return (
        <Flex width='100%' alignItems='center' justifyContent='space-around'>
            NAME AND DESCRIPTION
        </Flex>
    )
}

export default React.memo(SceneryNameAndDescription)