import React, { useState } from "react";
import styled from "styled-components";
import Flex from "../../components/Box/Flex";
import { useMatchBreakpoints } from "../../hooks";
import UserBlock from "./components/UserBlock";
import { NavProps } from "./types";
import { MENU_HEIGHT } from "./config";
import SummitPrice from "./components/SummitPrice";
import { useCurrentSummitPalette } from "state/hooks";
import { useRoadmapScreenshot } from "state/hooksNew";
import Logo from "./components/Logo";
import NavLinks from "./components/NavLinks";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledNav = styled.nav<{ showMenu: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  transition: top 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  width: 100vw;
  max-width: 100vw;
  height: ${MENU_HEIGHT - 6}px;
  padding-bottom: 0px;
  z-index: 20;
  transform: translate3d(0, 0, 0);
  background-color: ${({ theme }) => theme.colors.background};
  flex-direction: row;
  gap: 14px;
  box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
`;

const BodyWrapper = styled.div`
  position: relative;
  display: flex;
`;

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean, screenshot: boolean }>`
  flex-grow: 1;
  margin-top: ${({ showMenu, screenshot }) => (screenshot ? '12px' : (showMenu ? `${MENU_HEIGHT}px` : 0))};
  transform: translate3d(0, 0, 0);
  max-width: 100%;
`;

const MobileOnlyFooter = styled.div`
  position: fixed;
  height: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  height: 65px;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: 0px 0px 4px ${({ theme }) => theme.colors.textShadow};


  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`

const Menu: React.FC<NavProps> = ({
  account,
  login,
  logout,
  isDark,
  toggleTheme,
  currentLang,
  summitPriceUsd,
  links,
  children,
  additionals,
}) => {
  const { isXl } = useMatchBreakpoints();
  const isMobile = isXl === false;
  const [isPushed, setIsPushed] = useState(!isMobile);
  const summitPalette = useCurrentSummitPalette()
  const roadmapScreenshot = useRoadmapScreenshot()

  return (
    <Wrapper>
      { !roadmapScreenshot &&
        <StyledNav showMenu id='popup-root'>
          {/* <MobileHamburgerWrapper>
            <MenuButton aria-label="Toggle menu" onClick={() => setIsPushed((prevState: boolean) => !prevState)} mr="6px">
              {isPushed ? (
                <HamburgerCloseIcon width="24px" color="textSubtle"/>
              ) : (
                <HamburgerIcon width="24px" color="textSubtle"/>
              )}
            </MenuButton>
          </MobileHamburgerWrapper> */}
          <Flex alignItems='center' justifyContent='center' gap='10px'>
            <Logo isDark={isDark} href="/" summitPalette={summitPalette}/>
            <NavLinks links={links} mobileNav={false}/>
          </Flex>
          <Flex alignItems='center' justifyContent='center' gap='10px'>
            <SummitPrice summitPriceUsd={summitPriceUsd} />
            <UserBlock account={account} login={login} logout={logout} isDark={isDark} toggleTheme={toggleTheme} />
          </Flex>

          {/* <MenuPageSpecificHeader isDark={isDark} isPushed={isPushed}/> */}

          {/* <MobileExcludedHeaderElements>
            <Flex justifyContent='flex-end' flex='1'>
                <DarkModeToggle summitPalette={summitPalette} isDark={isDark} toggleTheme={toggleTheme}/>
            </Flex>
          </MobileExcludedHeaderElements> */}
        </StyledNav>
      }
      <BodyWrapper>
        {/* {!roadmapScreenshot &&
          <Panel
            isPushed={isPushed}
            isMobile={isMobile}
            currentLang={currentLang}
            pushNav={setIsPushed}
            links={links}
            additionals={additionals}
            summitPriceUsd={summitPriceUsd}
          />
        } */}
        <Inner isPushed={isPushed} screenshot={roadmapScreenshot} showMenu>
          {children}
        </Inner>
        {/* <MobileOnlyOverlay show={isPushed} onClick={() => setIsPushed(false)} role="presentation" /> */}
        <MobileOnlyFooter>
          <Flex>
            <NavLinks links={links} mobileNav/>
            {/* <DarkModeToggle summitPalette={summitPalette} isDark={isDark} toggleTheme={toggleTheme}/> */}
            {/* <UserBlock account={account} login={login} logout={logout} isDark={isDark} /> */}
          </Flex>
        </MobileOnlyFooter>
      </BodyWrapper>
    </Wrapper>
  );
};

export default Menu;
