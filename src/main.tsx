import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui.js/client'
import { registerWallet } from '@mysten/enoki'; // Fixed import path
import { enokiFlow } from './lib/enoki';
import { NETWORK_CONFIG } from './config'
import App from './App.tsx'
import './index.css'
import '@mysten/dapp-kit/dist/index.css'

// Register Enoki Flow as a wallet
registerWallet(enokiFlow);

const queryClient = new QueryClient()

const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
  devnet: { url: getFullnodeUrl('devnet') },
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork={NETWORK_CONFIG.NETWORK}>
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </StrictMode>,
)
