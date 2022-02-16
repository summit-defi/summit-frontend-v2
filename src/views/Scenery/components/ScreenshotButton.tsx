import { SummitPalette } from "config/constants"
import React, { useCallback } from "react"
import { useDispatch } from "react-redux"
import { useSceneryScreenshot } from "state/hooksNew"
import { toggleSceneryScreenshot } from "state/summitEcosystem"
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
    fill: ${({ theme }) => theme.colors.PLAINS};
    stroke: ${({ theme }) => theme.colors.PLAINS};
    stroke-width: 0.5px;
`

const StyledCameraIcon = styled(CameraIcon)`
    fill: white;
`


const ScreenshotButton: React.FC = () => {
    const screenshot = useSceneryScreenshot()
    const dispatch = useDispatch()
    const handleToggleScreenshot = useCallback(
        () => dispatch(toggleSceneryScreenshot()),
        [dispatch]
    )
    return (
        <SummitButton
            onClick={handleToggleScreenshot}
            summitPalette={SummitPalette.PLAINS}
            width='80px'
            height={screenshot ? '38px' : '112px'}
            padding='0px'
            secondary={screenshot}
            style={{borderRadius: screenshot ? '50px' : '14px', marginTop: '4px'}}
            InsetComponent={<ScreenshotInset/>}
        >
            {screenshot ? <StyledCloseIcon/> : <StyledCameraIcon width='28px' height='28px'/>}
        </SummitButton>
    )
}

export default React.memo(ScreenshotButton)