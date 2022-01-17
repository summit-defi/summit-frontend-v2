import React, { useState } from "react";
import styled from "styled-components";
import Overlay from "../../components/Overlay/Overlay";
import Flex from "../../components/Box/Flex";
import { useMatchBreakpoints } from "../../hooks";
import Logo from "./components/Logo";
import Panel from "./components/Panel";
import UserBlock from "./components/UserBlock";
import { NavProps } from "./types";
import { MENU_HEIGHT, SIDEBAR_WIDTH_REDUCED, SIDEBAR_WIDTH_FULL } from "./config";
import SummitPrice from "./components/SummitPrice";
import MenuButton from "./components/MenuButton";
import { HamburgerCloseIcon, HamburgerIcon } from "./icons";
import { useSelectedElevation } from "state/hooks";
import DarkModeToggle from "./components/DarkModeToggle";
import ElevationFarmsTabSelector from "./components/ElevationFarmsTabSelector";

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
  justify-content: center;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  width: 100vw;
  max-width: 100vw;
  height: ${MENU_HEIGHT}px;
  z-index: 20;
  transform: translate3d(0, 0, 0);
  background-color: ${({ theme }) => theme.colors.background};
  flex-direction: row;
  justify-content: flex-end;
  gap: 14px;

  ${({ theme }) => theme.mediaQueries.nav} {
    justify-content: space-between;
  }
`;

const BodyWrapper = styled.div`
  position: relative;
  display: flex;
`;

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  flex-grow: 1;
  margin-top: ${({ showMenu }) => (showMenu ? `${MENU_HEIGHT}px` : 0)};
  transition: margin-top 0.2s;
  transform: translate3d(0, 0, 0);
  max-width: 100%;

  ${({ theme }) => theme.mediaQueries.nav} {
    margin-left: ${SIDEBAR_WIDTH_FULL}px;
    max-width: ${({ isPushed }) => `calc(100% - ${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px)`};
  }
`;

const MobileOnlyOverlay = styled(Overlay)`
  position: fixed;
  height: 100%;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
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
  justify-content: space-between;
  height: 65px;
  padding-right: 16px;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: 0px 0px 4px ${({ theme }) => theme.colors.textShadow};


  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`;

const MobileExcludedHeaderElements = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.invNav} {
    display: none;
  }
`;
const MobileHamburgerWrapper = styled.div`
  position: absolute;
  left: 8px;
  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`;

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
  const elevation = useSelectedElevation()

  const keyPath = location.pathname.split('/')[1]
  const farmTabsVisible = ['elevation', 'oasis', 'plains', 'mesa', 'summit'].includes(keyPath)


  // Find the home link if provided
  const homeLink = links.find((link) => link.label === "Home");

  return (
    <Wrapper>
      <StyledNav showMenu>
        <MobileHamburgerWrapper>
          <MenuButton aria-label="Toggle menu" onClick={() => setIsPushed((prevState: boolean) => !prevState)} mr="6px">
            {isPushed ? (
              <HamburgerCloseIcon width="24px" color="textSubtle"/>
            ) : (
              <HamburgerIcon width="24px" color="textSubtle"/>
            )}
          </MenuButton>
        </MobileHamburgerWrapper>

        { (!isMobile || !farmTabsVisible) && <Logo isDark={isDark} href={homeLink?.href ?? "/"} elevation={elevation}/> }

        { farmTabsVisible && <ElevationFarmsTabSelector/> }

        <MobileExcludedHeaderElements>
          <Flex justifyContent='flex-end' flex='1'>
              <DarkModeToggle elevation={elevation} isDark={isDark} toggleTheme={toggleTheme}/>
              <UserBlock account={account} login={login} logout={logout} isDark={isDark} />
          </Flex>
        </MobileExcludedHeaderElements>
      </StyledNav>
      <BodyWrapper>
        <Panel
          isPushed={isPushed}
          isMobile={isMobile}
          isDark={isDark}
          currentLang={currentLang}
          toggleTheme={toggleTheme}
          pushNav={setIsPushed}
          links={links}
          additionals={additionals}
          summitPriceUsd={summitPriceUsd}
        />
        <Inner isPushed={isPushed} showMenu>
          {children}
        </Inner>
        <MobileOnlyOverlay show={isPushed} onClick={() => setIsPushed(false)} role="presentation" />
        <MobileOnlyFooter>
          <SummitPrice summitPriceUsd={summitPriceUsd} />
          <Flex>
            <DarkModeToggle elevation={elevation} isDark={isDark} toggleTheme={toggleTheme}/>
            <UserBlock account={account} login={login} logout={logout} isDark={isDark} />
          </Flex>
        </MobileOnlyFooter>
      </BodyWrapper>
    </Wrapper>
  );
};

export default Menu;
