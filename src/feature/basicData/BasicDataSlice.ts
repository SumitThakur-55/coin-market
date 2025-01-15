import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cluster } from '@solana/web3.js';

interface TokenBalance {
    account: string; // Unique identifier for the token account
    name: string; // Name of the token
    symbol: string; // Symbol of the token (e.g., BTC, ETH)
    balance: number; // The balance of the token in human-readable format
    pricePerToken: number; // Price per token in USD
    decimals: number; // Decimals for the token (e.g., 18 for most ERC-20 tokens)
    imageUrl?: string; // Optional URL for the token's image
}

interface WalletState {
    publicKey: string | null;
    connected: boolean;
    network: Cluster;
    balance: number | null;
    tokenBalances: TokenBalance[];
    totalUSD: number;  // Added totalUSD state
}

const initialState: WalletState = {
    publicKey: "",
    connected: false,
    network: 'mainnet-beta',
    balance: null,
    tokenBalances: [],
    totalUSD: 0,  // Initialize totalUSD to 0
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setPublicKey: (state, action: PayloadAction<string | null>) => {
            state.publicKey = action.payload;
        },
        setConnected: (state, action: PayloadAction<boolean>) => {
            state.connected = action.payload;
        },
        setNetwork: (state, action: PayloadAction<Cluster>) => {
            state.network = action.payload;
        },
        setBalance: (state, action: PayloadAction<number | null>) => {
            state.balance = action.payload;
        },
        setTokenBalances: (state, action: PayloadAction<TokenBalance[]>) => {
            state.tokenBalances = action.payload;  // Store an array of tokens
        },
        setTotalUSD: (state, action: PayloadAction<number>) => {
            state.totalUSD = action.payload;  // Set totalUSD state
        },
    },
});

export const { setPublicKey, setConnected, setNetwork, setBalance, setTokenBalances, setTotalUSD } = walletSlice.actions;
export default walletSlice.reducer;