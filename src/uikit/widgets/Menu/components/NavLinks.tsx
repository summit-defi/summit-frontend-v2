import React from 'react'
import styled, { css } from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { MenuEntry } from '../types'
import { pressableMixin } from 'uikit/util/styledMixins'
import { Text } from 'uikit/components/Text'
import { elevationPalette } from 'theme/colors'

interface Props {
    links: Array<MenuEntry>
    mobileNav: boolean
}

const Container = styled.div<{ mobileNav: boolean }>`
    flex-direction: row;
    justify-content: center;
    height: 100%;
    gap: 18px;
    display: ${({ mobileNav }) => mobileNav ? 'flex' : 'none'};
    
    
    ${({ theme }) => theme.mediaQueries.nav} {
        gap: 24px;
        margin-left: 24px;
        display: ${({ mobileNav }) => mobileNav ? 'none' : 'flex'};
    }
`

const ItemFlex = styled.div<{ selected: boolean, index: number }>`
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: center;
    position: relative;
    ${({ theme, index }) => pressableMixin({
        theme,
        hoverStyles: css`
            color: white;
            &::before {
                content: ' ';
                position: absolute;
                height: 2px;
                bottom: -4px;
                right: -12px;
                left: -12px;
                background-color: ${theme.isDark ? theme.colors.text : elevationPalette.BASE[index + 1]};
                z-index: -1;
                opacity: 1;
                transform: translateY(2px);
            }

            .item-label {
                color: ${theme.isDark ? theme.colors.text : elevationPalette.BASE[index + 1]};
                font-weight: bold;
            }
        `
    })}

    ${({ selected, theme, index }) => selected && css`
        &::before {
            content: ' ';
            position: absolute;
            height: 2px;
            bottom: -4px;
            right: -12px;
            left: -12px;
            background-color: ${theme.isDark ? theme.colors.text : elevationPalette.BASE[index + 1]};
            z-index: -1;
            opacity: 1;
        }

        .item-label {
            color: ${theme.isDark ? theme.colors.text : elevationPalette.BASE[index + 1]};
            font-weight: bold;
        }
    `}
`

const NavLinks: React.FC<Props> = ({ links, mobileNav }) => {
    const location = useLocation()
    const keyPath = location.pathname.split('/')[1]

    return (
        <Container mobileNav={mobileNav}>
            {links.map((entry, index) => {
                const selected = entry.keyPaths.includes(keyPath)
                return (
                    <ItemFlex selected={selected} index={index} as={Link} to={entry.href} replace>
                        <Text className='item-label' monospace bold={selected}>{entry.label}</Text>
                    </ItemFlex>
                )
            })}
        </Container>
    )
}

export default NavLinks
