import { Elevation, elevationUtils } from "config/constants"
import React from "react"
import { useMultiElevStaked } from "state/hooks"
import { useFarmsUserDataLoaded, useUserTotemLoyalties, useUserTotemsAndCrowns } from "state/hooksNew"
import styled from "styled-components"
import { ArtworkTotem, BadgeRibbonIcon, ElevationImage, Flex, Text } from "uikit"


const BadgeWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 6px;
`
const RibbonWrapper = styled.div`
    left: 0;
    background-color: ${({ theme }) => theme.colors.background };
    box-shadow: 1px 1px 2px ${({ theme }) => theme.colors.textShadow };
    border-radius: 50px;
    padding: 8px;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
`
const BadgeText = styled(Text)`
    margin-left: -16px;
    height: 32px;
    padding: 4px 6px 4px 24px;
    line-height: 12px;
    background-color: ${({ theme }) => theme.colors.background };
`

const StyledBadgeRibbonIcon = styled(BadgeRibbonIcon)`
    fill: ${({ theme }) => theme.colors.textGold};
    transform: rotate(15deg);
`

const getBadge = (totemIndex, loyalty, totemName) => {
    if (totemIndex === 0 || loyalty === -1) return null
    if (loyalty >= 24) return `${totemName}|br|LOYALIST`
    if (loyalty >= 12) return '24HOUR|br|MAXI'
    if (loyalty <= 2) return `YIELD|br|CHASER`
    return null
}

const TotemAndElevWrapper = styled.div`
    position: relative;
    width: 190px;
    height: 212px;
`

const ElevationImagePosition = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0px;
    top: 0px;
`
const TotemPosition = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0px;
    top: 60px;
`

const TextBackground = styled(Flex)`
    /* background: linear-gradient(to right, transparent -50%, white, white, transparent); */
    /* overflow: visible; */
`


const SceneryTotemRow: React.FC = () => {
    const userTotemsAndCrowns = useUserTotemsAndCrowns()
    const userTotemLoyalties = useUserTotemLoyalties()

    return (
        <Flex width='100%' alignItems='flex-start' justifyContent='space-around' maxWidth='850px'>
            { userTotemsAndCrowns.map(({ userTotem, crowned }, totemIndex) => {
                if (totemIndex === 4) return null
                const elevation = elevationUtils.fromInt(totemIndex)
                const totemName = elevationUtils.getElevationTotemName(elevation, userTotem)
                const loyalty = userTotemLoyalties[totemIndex -1]
                const loyaltyText = totemIndex === 0 ? 'INFINITE':
                    loyalty === -1 ?
                        'NOT YET TESTED' :
                        `${loyalty} ROUNDS`
                // const badge = getBadge(totemIndex, loyalty, totemName)
                return (
                    <Flex width='25%' position='relative' flexDirection='column' alignItems='center' justifyContent='center'>
                        <TotemAndElevWrapper>
                            <ElevationImagePosition>
                                <ElevationImage elevation={elevation} width={128} height={128} />
                            </ElevationImagePosition>
                            <TotemPosition>
                                <ArtworkTotem
                                    withName
                                    elevation={elevation}
                                    totem={userTotem}
                                    crowned={crowned}
                                    // noCrown
                                    desktopSize="112"
                                    mobileSize="76"
                                />
                            </TotemPosition>
                        </TotemAndElevWrapper>
                        
                        <TextBackground flexDirection='column' alignItems='column' justifyContent='center'>
                            <Text bold monospace small textAlign='center' fontSize='11px'>
                                {totemName} LOYALTY
                            </Text>
                            <Text bold monospace fontSize='26' textAlign='center' lineHeight='16px'>
                                {loyaltyText}
                            </Text>
                            {/* { badge != null &&
                                <BadgeWrapper>
                                    <RibbonWrapper>
                                        <StyledBadgeRibbonIcon width='24px' height='24px'/>
                                    </RibbonWrapper>
                                    <BadgeText bold gold monospace textAlign='center'>
                                        {badge.split('|').map((text) => text === 'br' ? <br/> : text)}
                                    </BadgeText>
                                </BadgeWrapper>
                            } */}
                        </TextBackground>
                    </Flex>
                )
            })}
        </Flex>
    )
}

export default React.memo(SceneryTotemRow)