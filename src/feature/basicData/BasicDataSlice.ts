import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cluster } from '@solana/web3.js';

interface WalletState {
    publicKey: string | null;
    connected: boolean;
    network: Cluster; // Could use 'mainnet-beta' | 'devnet' for better type safety
    balance: number | null;
}

const initialState: WalletState = {
    publicKey: null,
    connected: false,
    network: 'mainnet-beta',
    balance: null,
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
    },
});

export const { setPublicKey, setConnected, setNetwork, setBalance } = walletSlice.actions;
export default walletSlice.reducer;
