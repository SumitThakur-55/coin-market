import { BrowserRouter, Route, Routes } from "react-router-dom";

import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  Coin98WalletAdapter,
  CloverWalletAdapter,
  NightlyWalletAdapter,
  AvanaWalletAdapter,
  BitpieWalletAdapter,
  CoinbaseWalletAdapter,
  CoinhubWalletAdapter,
  FractalWalletAdapter,
  HuobiWalletAdapter,
  KeystoneWalletAdapter,
  KrystalWalletAdapter,
  NekoWalletAdapter,
  NufiWalletAdapter,
  OntoWalletAdapter,
  SalmonWalletAdapter,
  SkyWalletAdapter,
  SolongWalletAdapter,
  SpotWalletAdapter,
  TokenaryWalletAdapter,
  TokenPocketWalletAdapter,
  TrustWalletAdapter,
  TrezorWalletAdapter,

  UnsafeBurnerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import Navbar from "./component/Navbar";
import HomePage from "./component/HomePage";
import CoinData from "./component/CoinData";
import Wallet from "./page/Wallet";
import '@solana/wallet-adapter-react-ui/styles.css'; // Import Wallet styles

function App() {
  const network = WalletAdapterNetwork.Devnet; // Set the network type explicitly
  const endpoint = clusterApiUrl(network);

  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new TorusWalletAdapter(),
    new LedgerWalletAdapter(),
    new MathWalletAdapter(),
    new Coin98WalletAdapter(),
    new CloverWalletAdapter(),
    new NightlyWalletAdapter(),
    new AvanaWalletAdapter(),

    new BitpieWalletAdapter(),
    new CoinbaseWalletAdapter(),
    new CoinhubWalletAdapter(),
    new FractalWalletAdapter(),
    new HuobiWalletAdapter(),

    new KeystoneWalletAdapter(),
    new KrystalWalletAdapter(),
    new NekoWalletAdapter(),
    new NufiWalletAdapter(),
    new OntoWalletAdapter(),

    new SalmonWalletAdapter(),
    new SkyWalletAdapter(),
    new SolongWalletAdapter(),
    new SpotWalletAdapter(),
    new TokenaryWalletAdapter(),
    new TokenPocketWalletAdapter(),
    new TrustWalletAdapter(),
    new TrezorWalletAdapter(),

    new UnsafeBurnerWalletAdapter(),

  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <div className="bg-[#0D1421] min-h-screen">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/coins/:id" element={<CoinData />} />
                <Route path="/wallet" element={<Wallet />} />
              </Routes>
            </div>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
