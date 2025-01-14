// import { FC, useEffect } from 'react';
// import { useWallet } from '@solana/wallet-adapter-react';
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import { Connection, clusterApiUrl } from '@solana/web3.js';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState, AppDispatch } from '../app/store';
// import { setPublicKey, setConnected, setNetwork, setBalance } from '../feature/basicData/BasicDataSlice';

// const Wallet: FC = () => {

//     const { connected, publicKey, disconnect, wallet } = useWallet();
//     const dispatch = useDispatch<AppDispatch>();
//     const { network, balance } = useSelector((state: RootState) => state.wallet);

//     const connection = new Connection(clusterApiUrl(network));

//     useEffect(() => {
//         const fetchBalance = async () => {
//             if (connected && publicKey) {
//                 try {
//                     const lamports = await connection.getBalance(publicKey);
//                     const sol = lamports / 1e9; // Convert lamports to SOL
//                     dispatch(setBalance(sol));
//                     console.log('Connected to wallet:', publicKey.toBase58(), 'Balance:', sol);
//                 } catch (error) {
//                     console.error('Failed to fetch balance:', error);
//                     dispatch(setBalance(null)); // Reset balance on error
//                 }
//             } else {
//                 dispatch(setBalance(null)); // Reset balance when not connected
//             }
//         };

//         if (connected && publicKey) {
//             dispatch(setPublicKey(publicKey.toBase58()));
//             dispatch(setConnected(true));
//             fetchBalance();
//         } else {
//             dispatch(setPublicKey(null));
//             dispatch(setConnected(false));
//         }
//     }, [connected, publicKey, dispatch, connection]);

//     const handleDisconnect = async () => {
//         if (connected) {
//             try {
//                 await disconnect();
//                 dispatch(setBalance(null)); // Clear balance when disconnected
//                 console.log('Disconnected from wallet');
//             } catch (error) {
//                 console.error('Failed to disconnect:', error);
//             }
//         }
//     };

//     const handleNetworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         dispatch(setNetwork(event.target.value as 'mainnet-beta' | 'devnet'));
//     };

//     return (
//         <div className='p-10'>
//             <h1 className="text-2xl font-semibold mb-6">Connected Wallet</h1>
//             <WalletMultiButton className="mb-4 w-full" />
//             <div className="flex flex-col space-y-4">
//                 <div>
//                     <label htmlFor="network-select" className="block font-medium mb-2">Network:</label>
//                     <select
//                         id="network-select"
//                         value={network}
//                         onChange={handleNetworkChange}
//                         className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none"
//                     >
//                         <option value="mainnet-beta">Mainnet</option>
//                         <option value="devnet">Devnet</option>
//                     </select>
//                 </div>
//                 <p className="text-sm font-medium">Connection Status: <span className={connected ? "text-green-400" : "text-red-500"}>{connected ? 'Connected' : 'Disconnected'}</span></p>
//                 {connected && publicKey && (
//                     <div className="space-y-2">
//                         <div>
//                             <p className="text-sm font-medium">Connected Wallet Address:</p>
//                             <p className="text-xs break-all">{publicKey.toBase58()}</p>
//                         </div>
//                         <p className="text-sm font-medium">Total Coins (SOL): <span className="font-bold">{balance !== null ? balance : '0'}</span></p>
//                         <p className="text-sm font-medium">Connected Wallet Name: <span className="font-bold">{wallet?.adapter.name || 'Unknown'}</span></p>
//                         <button onClick={handleDisconnect} className="w-full mt-4 p-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded">
//                             Disconnect
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Wallet;

import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { setPublicKey, setConnected, setNetwork, setBalance } from '../feature/basicData/BasicDataSlice';

// Helius API balance fetcher
const getWalletBalance = async (walletAddress: string, network: 'devnet' | 'mainnet' = 'devnet') => {
    const endpoints: Record<'devnet' | 'mainnet', string> = {
        devnet: 'https://devnet.helius-rpc.com/?api-key=7d9f567a-c6e4-4b94-8ad3-4f8ab1bee448',
        mainnet: 'https://mainnet.helius-rpc.com/?api-key=7d9f567a-c6e4-4b94-8ad3-4f8ab1bee448',
    };

    if (!['devnet', 'mainnet-beta'].includes(network)) {
        throw new Error('Invalid network. Use either "devnet" or "mainnet-beta".');
    }

    if (!walletAddress || typeof walletAddress !== 'string') {
        throw new Error('Invalid wallet address.');
    }

    try {
        const response = await fetch(endpoints[network], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'helius-balance',
                method: 'getBalance',
                params: [walletAddress],
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(`API error: ${data.error.message}`);
        }

        const balanceInSol = data.result / 1e9; // Convert lamports to SOL
        return balanceInSol;
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        throw error;
    }
};

const Wallet: FC = () => {
    const { connected, disconnect, wallet, publicKey } = useWallet();
    const dispatch = useDispatch<AppDispatch>();
    const { network, balance } = useSelector((state: RootState) => state.wallet);

    const defaultPublicKey = '3PpVyzPmwsoJasW3yCeeJpoXtEfpVcHQKz3hYJG2knJU';

    useEffect(() => {
        const fetchBalance = async () => {
            const keyToUse = publicKey?.toBase58() || defaultPublicKey;

            try {
                const solBalance = await getWalletBalance(keyToUse, network as 'devnet' | 'mainnet');
                dispatch(setBalance(solBalance));
                console.log('Wallet public key:', keyToUse, 'Balance:', solBalance);
            } catch (error) {
                console.error('Failed to fetch balance:', error);
                dispatch(setBalance(null)); // Reset balance on error
            }
        };

        if (connected && publicKey) {
            dispatch(setPublicKey(publicKey.toBase58()));
            dispatch(setConnected(true));
            fetchBalance();
        } else {
            dispatch(setPublicKey(defaultPublicKey));
            dispatch(setConnected(false));
            fetchBalance(); // Fetch balance for the default key
        }
    }, [dispatch, connected, publicKey, network]);

    const handleDisconnect = async () => {
        try {
            await disconnect();
            dispatch(setBalance(null)); // Clear balance when disconnected
            dispatch(setConnected(false));
            console.log('Disconnected from wallet');
        } catch (error) {
            console.error('Failed to disconnect:', error);
        }
    };

    const handleNetworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setNetwork(event.target.value as 'mainnet-beta' | 'devnet'));
    };

    return (
        <div className='p-10'>
            <h1 className="text-2xl font-semibold mb-6">Connected Wallet</h1>
            <WalletMultiButton className="mb-4 w-full" />
            <div className="flex flex-col space-y-4">
                <div>
                    <label htmlFor="network-select" className="block font-medium mb-2">Network:</label>
                    <select
                        id="network-select"
                        value={network}
                        onChange={handleNetworkChange}
                        className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none"
                    >
                        <option value="mainnet-beta">Mainnet</option>
                        <option value="devnet">Devnet</option>
                    </select>
                </div>
                <p className="text-sm font-medium">Connection Status: <span className={connected ? "text-green-400" : "text-red-500"}>{connected ? 'Connected' : 'Disconnected'}</span></p>
                <div className="space-y-2">
                    <div>
                        <p className="text-sm font-medium">Wallet Address:</p>
                        <p className="text-xs break-all">{publicKey?.toBase58() || defaultPublicKey}</p>
                    </div>
                    <p className="text-sm font-medium">Total Coins (SOL): <span className="font-bold">{balance !== null ? balance : '0'}</span></p>
                    <p className="text-sm font-medium">Wallet Name: <span className="font-bold">{wallet?.adapter.name || 'Default'}</span></p>
                    {connected && (
                        <button onClick={handleDisconnect} className="w-full mt-4 p-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded">
                            Disconnect
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wallet;
