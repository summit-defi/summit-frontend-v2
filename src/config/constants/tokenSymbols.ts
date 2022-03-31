export enum TokenSymbol {
    // SHARED
    SUMMIT = 'SUMMIT',
    EVEREST = 'EVEREST',
    USDC = 'USDC',
    
    // BSC TESTNET
    wBNB = 'wBNB',
    CAKE = 'CAKE',
    BIFI = 'BIFI',
    GS0 = 'GS0',
    GS1 = 'GS1',
    GS2 = 'GS2',
    GS3 = 'GS3',
    GS4 = 'GS4',
    GS5 = 'GS5',

    // FTM
    FTM = 'FTM',
    wFTM = 'wFTM',
    TOMB = 'TOMB',
    TOMB_FTM = 'TOMB-FTM',
    TSHARE_FTM = 'TSHARE-FTM',
    TSHARE = 'TSHARE',
    BOO = 'BOO',
    FTM_BOO = 'FTM-BOO',
    '2OMB' = '2OMB',
    '2SHARES' = '2SHARES',
    '2OMB_FTM' = '2OMB-FTM',
    '2SHARES_FTM' = '2SHARES-FTM',
    BPT_BEETS_FTM = 'BPT-BEETS-FTM',
    GRAND_ORCH = 'GRAND-ORCH',
    BATTLE_OF_THE_BANDS = 'BATTLE-OF-THE-BANDS',
    FANTOM_OF_THE_OPERA = 'FANTOM-OF-THE-OPERA',
    PAE_FTM = 'PAE-FTM',
    /* eslint camelcase: 0 */
    pFTM_FTM = 'pFTM-FTM',
    wETH = 'ETH',
    wBTC = 'BTC',
    fMATIC = 'MATIC',
    fAVAX = 'AVAX',
    fBNB = 'BNB',
    fLUNA = 'LUNA',
    fSOL = 'SOL',
    BOO_XBOO = 'BOO-xBOO',
    USDC_MIM = 'USDC-MIM',
    MIM = 'MIM',
    xBOO = 'xBOO',
    FTM_BSHARE = 'FTM-BSHARE',
    TOMB_BASED = 'TOMB-BASED',
    BSHARE = 'BSHARE',
    BASED = 'BASED',


    // POLYGON
    MATIC = 'MATIC',
    wMATIC = 'wMATIC',
    SUMMIT_MATIC = 'SUMMIT-MATIC',
    MAI_USDC = 'MAI-USDC',
    aTriCrypto = 'aTriCrypto',
    QI_MATIC = 'QI_MATIC',
    BIFI_MAXI = 'BIFI MAXI',
    QUICK = 'QUICK',
    MATIC_USDC = 'MATIC_USDC',
    ETH_MATIC = 'ETH_MATIC',
    EURt_DAI_USDC_USDT = 'EURt-DAI-USDC-USDT',
}

export const TokensWithCustomArtwork = {
    // SHARED
    [TokenSymbol.SUMMIT]: false,
    [TokenSymbol.EVEREST]: false,
    [TokenSymbol.USDC]: false,
    
    // BSC TESTNET
    [TokenSymbol.wBNB]: false,
    [TokenSymbol.CAKE]: false,
    [TokenSymbol.BIFI]: false,
    [TokenSymbol.GS0]: false,
    [TokenSymbol.GS1]: false,
    [TokenSymbol.GS2]: false,
    [TokenSymbol.GS3]: false,
    [TokenSymbol.GS4]: false,
    [TokenSymbol.GS5]: false,

    // FTM
    [TokenSymbol.FTM]: false,
    [TokenSymbol.wFTM]: false,
    [TokenSymbol.TOMB]: false,
    [TokenSymbol.TOMB_FTM]: false,
    [TokenSymbol.TSHARE_FTM]: false,
    [TokenSymbol.TSHARE]: false,
    [TokenSymbol.BOO]: false,
    [TokenSymbol.FTM_BOO]: false,
    [TokenSymbol['2OMB']]: false,
    [TokenSymbol['2SHARES']]: false,
    [TokenSymbol['2OMB_FTM']]: false,
    [TokenSymbol['2SHARES_FTM']]: false,
    [TokenSymbol.BPT_BEETS_FTM]: true,
    [TokenSymbol.GRAND_ORCH]: true,
    [TokenSymbol.BATTLE_OF_THE_BANDS]: true,
    [TokenSymbol.FANTOM_OF_THE_OPERA]: true,
    [TokenSymbol.wETH]: false,
    [TokenSymbol.wBTC]: false,
    [TokenSymbol.fMATIC]: false,
    [TokenSymbol.fAVAX]: false,
    [TokenSymbol.fBNB]: false,
    [TokenSymbol.fLUNA]: false,
    [TokenSymbol.fSOL]: false,
    [TokenSymbol.BOO_XBOO]: false,
    [TokenSymbol.USDC_MIM]: false,
    [TokenSymbol.MIM]: false,
    [TokenSymbol.xBOO]: false,
    [TokenSymbol.FTM_BSHARE]: false,
    [TokenSymbol.TOMB_BASED]: false,
    [TokenSymbol.BSHARE]: false,
    [TokenSymbol.BASED]: false,



    [TokenSymbol.BIFI_MAXI]: false,
    [TokenSymbol.aTriCrypto]: false,
    [TokenSymbol.EURt_DAI_USDC_USDT]: false,
}