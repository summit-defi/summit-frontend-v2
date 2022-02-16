import { Elevation, elevationUtils } from "config/constants"
import React from "react"
import { useMultiElevStaked } from "state/hooks"
import { useFarmsUserDataLoaded, useUserTotemLoyalties, useUserTotemsAndCrowns } from "state/hooksNew"
import styled from "styled-components"
import { ArtworkTotem, BadgeRibbonIcon, Flex, Text } from "uikit"


// const BadgeWrapper = styled.div`
//     display: flex;
//     flex-direction: row;
//     align-items: center;
//     justify-content: center;
//     margin-top: 6px;
// `
// const RibbonWrapper = styled.div`
//     left: 0;
//     background-color: ${({ theme }) => theme.colors.background };
//     box-shadow: 1px 1px 2px ${({ theme }) => theme.colors.textShadow };
//     border-radius: 50px;
//     padding: 8px;
//     width: 38px;
//     height: 38px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     z-index: 2;
// `
// const BadgeText = styled(Text)`
//     margin-left: -16px;
//     height: 32px;
//     padding: 4px 6px 4px 24px;
//     line-height: 12px;
//     background-color: ${({ theme }) => theme.colors.background };
// `

// const StyledBadgeRibbonIcon = styled(BadgeRibbonIcon)`
//     fill: ${({ theme }) => theme.colors.textGold};
//     transform: rotate(15deg);
// `

// const getBadge = (totemIndex, loyalty, totemName) => {
//     if (totemIndex === 0 || loyalty === -1) return null
//     if (loyalty >= 24) return `${totemName}|br|LOYALIST`
//     if (loyalty >= 12) return '24HOUR|br|MAXI'
//     if (loyalty <= 2) return `YIELD|br|CHASER`
//     return null
// }

const TextBackground = styled(Flex)`
    background: linear-gradient(to right, transparent -50%, white, white, transparent);
    overflow: visible;
`


const SceneryTotemRow: React.FC = () => {
    const userTotemsAndCrowns = useUserTotemsAndCrowns()
    const userTotemLoyalties = useUserTotemLoyalties()

    return (
        <Flex width='100%' alignItems='flex-start' justifyContent='space-around' maxWidth='850px'>
            { userTotemsAndCrowns.map(({ userTotem, crowned }, totemIndex) => {
                if (totemIndex === 4) return null
                const totemName = elevationUtils.getElevationTotemName(elevationUtils.fromInt(totemIndex), userTotem)
                const loyalty = userTotemLoyalties[totemIndex -1]
                const loyaltyText = totemIndex === 0 ? 'INFINITE':
                    loyalty === -1 ?
                        'NOT YET TESTED' :
                        `${loyalty} ROUNDS`
                // const badge = getBadge(totemIndex, loyalty, totemName)
                return (
                    <Flex width='25%' position='relative' flexDirection='column' alignItems='center' justifyContent='center'>
                        <ArtworkTotem
                            withName
                            elevation={elevationUtils.fromInt(totemIndex)}
                            totem={userTotem}
                            crowned={crowned}
                            noCrown
                            desktopSize="154"
                            mobileSize="76"
                        />
                        
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