import { SummitPalette } from "config/constants"
import React, { useCallback } from "react"
import { useDispatch } from "react-redux"
import { useRoadmapScreenshot } from "state/hooksNew"
import { toggleRoadmapScreenshot } from "state/summitEcosystem"
import styled from "styled-components"
import { CameraIcon, CloseIcon, SummitButton } from "uikit"
import { SelectorWrapperBase } from "uikit/widgets/Selector/styles"

const ScreenshotInset = styled(SelectorWrapperBase)`
    position: absolute;
    left: 2px;
    top: 2px;
    bottom: 2px;
    right: 2px;
    border-radius: 50px;
    background-color: ${({ theme }) => theme.colors.background};
`

const StyledCloseIcon = styled(CloseIcon)`
    fill: ${({ theme }) => theme.colors.BASE};
    stroke: ${({ theme }) => theme.colors.BASE};
    stroke-width: 0.5px;
`

const StyledCameraIcon = styled(CameraIcon)`
    fill: white;
`


const ScreenshotButton: React.FC = () => {
    const screenshot = useRoadmapScreenshot()
    const dispatch = useDispatch()
    const handleToggleScreenshot = useCallback(
        () => dispatch(toggleRoadmapScreenshot()),
        [dispatch]
    )
    return (
        <SummitButton
            onClick={handleToggleScreenshot}
            width='80px'
            height={screenshot ? '38px' : '112px'}
            padding='0px'
            secondary={screenshot}
            summitPalette={SummitPalette.BASE}
            style={{borderRadius: screenshot ? '50px' : '14px', marginTop: '4px'}}
            InsetComponent={<ScreenshotInset/>}
        >
            {screenshot ? <StyledCloseIcon/> : <StyledCameraIcon width='28px' height='28px'/>}
        </SummitButton>
    )
}

export default React.memo(ScreenshotButton)