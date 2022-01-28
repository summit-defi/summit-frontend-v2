import React from 'react'
import ElevationFarmsTabSelector from "./ElevationFarmsTabSelector"
import { useMatchBreakpoints } from "../../../hooks";
import { useCurrentSummitPalette, useSelectedElevation } from "state/hooks";
import Logo from "./Logo";
import ElevationRoundProgress from "./ElevationRoundProgress";
import Flex from 'uikit/components/Box/Flex'
import styled from 'styled-components'
import { MENU_HEIGHT } from '../config'
import ExpeditionMenuHeader from './ExpeditionMenuHeader';



const FullHeightWrapper = styled(Flex)<{ farmTabSelectorVisible: boolean }>`
    height: ${MENU_HEIGHT}px;
    position: relative;
    align-items: center;
    padding-left: auto;
    width: 100%;
    justify-content: ${({farmTabSelectorVisible}) => farmTabSelectorVisible ? 'flex-end' : 'center'};
    
    ${({ theme }) => theme.mediaQueries.nav} {
        padding-left: 0px;
        width: auto;
        justify-content: center;
    }
`

interface Props {
    isDark: boolean
    isPushed: boolean
}

const MenuPageSpecificHeader: React.FC<Props> = ({ isDark, isPushed }) => {
    const summitPalette = useCurrentSummitPalette()
    const { isXl } = useMatchBreakpoints();
    const isMobile = isXl === false;

    const keyPath = location.pathname.split('/')[1]

    const isExpedition = keyPath === 'expedition'
    const isFarmTab = ['beta', 'elevations', 'oasis', 'plains', 'mesa', 'summit'].includes(keyPath)
    
    const logoVisible = !isMobile || (!isFarmTab && !isExpedition)
    const roundProgressVisible = !isMobile || !isPushed

    return (
        <>
            { logoVisible && <Logo isDark={isDark} href="/" summitPalette={summitPalette}/> }
            { (isFarmTab || isExpedition) &&
            <>
                <FullHeightWrapper farmTabSelectorVisible={isFarmTab}>
                    { isFarmTab && <ElevationFarmsTabSelector/> }
                    { isExpedition && <ExpeditionMenuHeader /> }
                    { roundProgressVisible && <ElevationRoundProgress/> }
                </FullHeightWrapper>
            </>
            }
        </>
    )
}

export default MenuPageSpecificHeader