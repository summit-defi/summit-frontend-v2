import React from 'react'
// import bsc, { UseWalletProvider } from '@binance-chain/bsc-use-wallet'
import * as bsc from '@binance-chain/bsc-use-wallet'
import { Provider } from 'react-redux'
import getRpcUrl from 'utils/getRpcUrl'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import store from 'state'
import { ToastsProvider } from 'contexts/ToastsContext'
import { ModalProvider } from 'uikit'
import { ThemeContextProvider } from 'contexts/ThemeContext'

const Providers: React.FC = ({ children }) => {
  const rpcUrl = getRpcUrl()
  const chainId = parseInt(process.env.REACT_APP_CHAIN_ID)
  return (
    <Provider store={store}>
      <ThemeContextProvider>
        <ToastsProvider>
          <bsc.UseWalletProvider
            chainId={chainId}
            connectors={{
              walletconnect: { rpcUrl },
              bsc,
            }}
          >
            <ModalProvider>
              <RefreshContextProvider>{children}</RefreshContextProvider>
            </ModalProvider>
          </bsc.UseWalletProvider>
        </ToastsProvider>
      </ThemeContextProvider>
    </Provider>
  )
}

export default Providers
