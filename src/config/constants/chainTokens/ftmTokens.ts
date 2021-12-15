import { TokenPriceType, PriceableTokenSymbol, PriceableToken } from "state/types"

export const ftmPeggedTokens = {
  '0x04068da6c83afcfa0e13ba15a6696662335d5b75': true, // USDC
  '0x049d68029688eabf473097a2fc38ef61633a3c7a': true, // fUSDT
  '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e': true, // DAI
  '0x92d5ebf3593a92888c25c0abef126583d4b5312e': true, // fUSDT/DAI/USDC - treated as stable though it may drift by 2% :shrug:
  '0x82f0b8b456c1a451378467398982d4834b6829c1': true, // MIM
}


export const ftmPriceableTokens: PriceableToken[] = [
  {
    type: TokenPriceType.SingleAsset,
    symbol: PriceableTokenSymbol.SUMMIT,
    token: '0xSUMMIT',
    lp: '0xSUMMITLP',
    decimals: 18,
  },
  {
    type: TokenPriceType.LP,
    symbol: PriceableTokenSymbol.SUMMIT_FTM,
    token: '',
    lp: '0xSUMMITLP',
    decimals: 18,
  },
  {
    type: TokenPriceType.LP,
    symbol: PriceableTokenSymbol.TOMB_FTM,
    token: '',
    lp: '0x2a651563c9d3af67ae0388a5c8f89b867038089e',
    decimals: 18,
  },
  {
    type: TokenPriceType.LP,
    symbol: PriceableTokenSymbol.TSHARE_FTM,
    token: '',
    lp: '0x4733bc45ef91cf7ccecaeedb794727075fb209f2',
    decimals: 18,
  },
  {
    type: TokenPriceType.LP,
    symbol: PriceableTokenSymbol.FTM_BOO,
    token: '',
    lp: '0xEc7178F4C41f346b2721907F5cF7628E388A7a58',
    decimals: 18,
  },
  {
    type: TokenPriceType.LP,
    symbol: PriceableTokenSymbol.USDC_FTM,
    token: '',
    lp: '0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c',
    decimals: 18,
  },
  {
    type: TokenPriceType.LP,
    symbol: PriceableTokenSymbol.FTM_wETH,
    token: '',
    lp: '0xf0702249f4d3a25cd3ded7859a165693685ab577',
    decimals: 18,
  },
  {
    type: TokenPriceType.LP,
    symbol: PriceableTokenSymbol.fUSDT_FTM,
    token: '',
    lp: '0x5965e53aa80a0bcf1cd6dbdd72e6a9b2aa047410',
    decimals: 18,
  },
  {
    type: TokenPriceType.LP,
    symbol: PriceableTokenSymbol.FTM_DAI,
    token: '',
    lp: '0xe120ffbda0d14f3bb6d6053e90e63c572a66a428',
    decimals: 18,
  },
  {
    type: TokenPriceType.Stablecoin,
    symbol: PriceableTokenSymbol.fUSDT_DAI_USDC,
    token: '',
    lp: '0x92d5ebf3593a92888c25c0abef126583d4b5312e',
    decimals: 18,
  },
  {
    type: TokenPriceType.SingleAsset,
    symbol: PriceableTokenSymbol.BOO,
    token: '0x841fad6eae12c286d1fd18d1d525dffa75c7effe',
    lp: '0xEc7178F4C41f346b2721907F5cF7628E388A7a58',
    decimals: 18,
  },
  {
    type: TokenPriceType.Stablecoin,
    symbol: PriceableTokenSymbol.USDC,
    token: '',
    lp: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    decimals: 6,
  },
  {
    type: TokenPriceType.Stablecoin,
    symbol: PriceableTokenSymbol.fUSDT,
    token: '',
    lp: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
    decimals: 6,
  },
  {
    type: TokenPriceType.Stablecoin,
    symbol: PriceableTokenSymbol.DAI,
    token: '',
    lp: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
    decimals: 18,
  },
  {
    type: TokenPriceType.SingleAsset,
    symbol: PriceableTokenSymbol.BIFI,
    token: '0xd6070ae98b8069de6b494332d1a1a81b6179d960',
    lp: '0x1656728af3a14e1319F030Dc147fAbf6f627059e',
    decimals: 18,
  },
  {
    type: TokenPriceType.WrappedNative,
    symbol: PriceableTokenSymbol.wFTM,
    token: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    lp: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    decimals: 18,
  },
  {
    type: TokenPriceType.Stablecoin,
    symbol: PriceableTokenSymbol.MIM,
    token: '0x82f0b8b456c1a451378467398982d4834b6829c1',
    lp: '',
    decimals: 18,
  },
  {
    type: TokenPriceType.SingleAsset,
    symbol: PriceableTokenSymbol.wBTC,
    token: '0x321162Cd933E2Be498Cd2267a90534A804051b11',
    lp: '0xfdb9ab8b9513ad9e419cf19530fee49d412c3ee3',
    decimals: 8,
  },
  {
    type: TokenPriceType.SingleAsset,
    symbol: PriceableTokenSymbol.wETH,
    token: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
    lp: '0xf0702249f4d3a25cd3ded7859a165693685ab577',
    decimals: 18,
  },
  {
    type: TokenPriceType.Balancer2Pool,
    symbol: PriceableTokenSymbol.BPT_BEETS_FTM,
    decimals: 18,
    token: '',
    lp: '0xcde5a11a4acb4ee4c805352cec57e236bdbc3837',
  },
  {
    type: TokenPriceType.BalancerMultiPool,
    symbol: PriceableTokenSymbol.BeetXLP_MIM_USDC_USDT,
    token: '',
    lp: '0xd163415bd34ef06f57c58d2aed5a5478afb464cc',
    decimals: 18,
    containingTokens: [PriceableTokenSymbol.USDC, PriceableTokenSymbol.fUSDT, PriceableTokenSymbol.MIM],
    balancerMultiPoolPid: '0xd163415bd34ef06f57c58d2aed5a5478afb464cc00000000000000000000000e',
  },
  {
    type: TokenPriceType.BalancerMultiPool,
    symbol: PriceableTokenSymbol.GRAND_ORCH,
    token: '',
    lp: '0xd47d2791d3b46f9452709fa41855a045304d6f9d',
    decimals: 18,
    containingTokens: [PriceableTokenSymbol.wFTM, PriceableTokenSymbol.wBTC, PriceableTokenSymbol.wETH],
    balancerMultiPoolPid: '0xd47d2791d3b46f9452709fa41855a045304d6f9d000100000000000000000004',
  }
]
