import React from 'react'
import styled from 'styled-components'
import { BaseLayout, HighlightedText, Flex } from 'uikit'
import Page from 'components/layout/Page'
import SummitStats from './components/SummitStats'
import { useTotalValue } from 'state/hooks'
import CardValue from './components/CardValue'
import { Elevation } from 'config/constants/types'
import SummitTokenSwapCard from './components/SummitTokenSwapCard'
import ExpeditionTreasuryCard from './components/ExpeditionTreasuryCard'
import { useSummitSwapMinimized } from 'state/hooksNew'
import SummitSwapMinimizedCard from './components/SummitSwapMinimizedCard'

const StyledPage = styled(Page)`
  max-width: 950px;
`

const Hero = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  text-align: center;
`

const BackgroundedFlex = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.background};
  max-width: 500px;
  margin: 36px auto;
  padding: 36px 24px;
  border-radius: 6px;
  box-shadow: 2px 2px 12px -4px rgba(25, 19, 38, 0.4), 2px 2px 8px rgba(25, 19, 38, 0.2);
`

const SwapMinGrid = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;

  & > div {
    grid-column: span 12;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 12;
    }
  }
`

const StyledHighlightedText = styled(HighlightedText)<{ fontSize: string; letterSpacing: string }>`
  letter-spacing: ${({ letterSpacing }) => letterSpacing};
  font-weight: 900;
  font-size: ${({ fontSize }) => fontSize};
  text-shadow: none;
`

const DeityWrapper = styled.div`
    filter: drop-shadow(-0.5vw 0.5vw 0.5vw white) drop-shadow(-4vw 2vw 4vw #ae6481) drop-shadow(4vw -2vw 4vw #0d172e);
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const Home: React.FC = () => {
  const totalValue = useTotalValue()
  const summitSwapMinimized = useSummitSwapMinimized()

  return (
    <StyledPage>
      <Hero>
        <StyledHighlightedText fontSize="32px" letterSpacing="16px">
          SUMMIT DEFI
        </StyledHighlightedText>
        <StyledHighlightedText italic fontSize="16px" mt="8px" letterSpacing="1.5px">
          Risk the Milk, not the Cow.
        </StyledHighlightedText>
        <StyledHighlightedText fontSize="14px" mt="8px" letterSpacing="1.5px">
          First generation Yield Multiplying on FTM.
        </StyledHighlightedText>
      </Hero>


      <Flex justifyContent="center" alignItems="center" mt="0px" mb='48px'>
        <StyledHighlightedText fontSize="16px" letterSpacing="2px">
          TVL:
        </StyledHighlightedText>
        <CardValue
          value={totalValue.toNumber()}
          prefix="$"
          decimals={2}
          fontSize="40"
          summitPalette={Elevation.OASIS}
        />
      </Flex>

      <Cards>
        { summitSwapMinimized ?
          <SwapMinGrid>
            <SummitSwapMinimizedCard/>
            <SummitStats/>
          </SwapMinGrid> :
          <SummitTokenSwapCard />
        }
        <ExpeditionTreasuryCard />
        { !summitSwapMinimized && <SummitStats /> }
      </Cards>
    </StyledPage>
  )
}

export default Home
