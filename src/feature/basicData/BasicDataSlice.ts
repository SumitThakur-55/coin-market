import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cluster } from '@solana/web3.js';

interface TokenBalance {
    mint: string;      // The token mint address
    balance: number;   // The balance of the token in human-readable format
}

interface WalletState {
    publicKey: string | null;
    connected: boolean;
    network: Cluster;
    balance: number | null;
    tokenBalances: TokenBalance[];
}

const initialState: WalletState = {
    publicKey: "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY",
    connected: false,
    network: 'mainnet-beta',
    balance: null,
    tokenBalances: [],  // Changed to store only token balances
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
    },
});

export const { setPublicKey, setConnected, setNetwork, setBalance, setTokenBalances } = walletSlice.actions;
export default walletSlice.reducer;
