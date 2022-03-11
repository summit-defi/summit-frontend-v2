import React, { useState, useCallback, useRef } from 'react'
import Popup from 'reactjs-popup'
import styled from 'styled-components';

interface Props {
    button: JSX.Element
    position: any
    contentPadding?: string
    popUpContent: JSX.Element
    fixed?: boolean
}

const StyledPopup = styled(Popup)`
    &-content {
        top: 65px !important;
    }
`;

const PopUpCard = styled.div<{ contentPadding?: string }>`
    flex-direction: column;
    justify-content: flex-start;
    background: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
    padding: ${({ contentPadding }) => contentPadding || '18px'};
    flex: 1;
    box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
`

const SummitPopUp: React.FC<Props> = ({ button, position, contentPadding, popUpContent, fixed=false }) => {
    const ref = useRef();
    const onDismiss = useCallback(() => {
        if (ref.current != null) {
            (ref.current as unknown as any).close()
        }
    }, [ref])
    return (
        <StyledPopup
            trigger={button}
            position={position}
            closeOnDocumentClick
            closeOnEscape
            ref={ref}
            offsetY={22}
            offsetX={10}
            arrow={false}
        >
            <PopUpCard contentPadding={contentPadding}>
                {React.cloneElement(popUpContent, {
                    onDismiss,
                })}
            </PopUpCard>
        </StyledPopup>
    )
}

export default React.memo(SummitPopUp)
