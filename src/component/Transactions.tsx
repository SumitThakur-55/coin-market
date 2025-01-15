// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import WalletDetail from './WalletDetail';
// type Transaction = {
//     id: string;
//     type: string;
//     amount: number;
//     // Add other properties based on the response structure
// };
// function Transactions() {
//     const [transactions, setTransactions] = useState<Transaction[]>([]);
//     const [nftMints, setNftMints] = useState<Transaction[]>([]);
//     const [transfers, setTransfers] = useState<Transaction[]>([]);
//     const address = '3PpVyzPmwsoJasW3yCeeJpoXtEfpVcHQKz3hYJG2knJU'; // Wallet address
//     const apiKey = '7d9f567a-c6e4-4b94-8ad3-4f8ab1bee448'; // API Key

//     // Fetch data from API
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get(
//                     `https://api.helius.xyz/v0/addresses/${address}/transactions`, {
//                     params: {
//                         'api-key': apiKey, // Pass the API key as a query parameter
//                     },
//                 });
//                 console.log("API Response: ", response.data); // Log the response to check the structure
//                 setTransactions(response.data); // Store data in state
//             } catch (error) {
//                 console.error('Error fetching transactions:', error);
//             }
//         };

//         fetchData();
//         console.log("Transactions state updated: ", transactions.map(item => item.type));
//     }, [address, apiKey]);

//     // Separate transactions into NFT Mint and Transfer based on the 'type'
//     useEffect(() => {
//         if (transactions.length > 0) {
//             const nftMintsArray = transactions.filter(item => item.type === 'COMPRESSED_NFT_MINT');
//             const transfersArray = transactions.filter(item => item.type === 'TRANSFER');

//             // Optionally, you can sort them if needed, e.g., by date or amount
//             // nftMintsArray.sort((a, b) => new Date(b.date) - new Date(a.date)); // Example sorting by date
//             // transfersArray.sort((a, b) => a.amount - b.amount); // Example sorting by amount

//             setNftMints(nftMintsArray);
//             setTransfers(transfersArray);
//         }
//     }, [transactions]);

//     // Log the transactions state whenever it changes
//     useEffect(() => {
//         console.log("NFT Mint transactions: ", nftMints);
//         console.log("Transfer transactions: ", transfers);
//     }, [nftMints, transfers]);

//     return (
//         <div className="flex flex-col sm:flex-row">
//             <div className="sm:w-1/4 bg-[#0D1421] text-white sm:h-screen sm:sticky top-0 overflow-y-auto scrollbar-hide p-4 sm:p-0 no-scrollbar">
//                 <WalletDetail />
//             </div>
//             <div className="flex-1 p-4 bg-[#151c2b] overflow-hidden sticky">
//                 <h1 className='text-4xl text-white mb-4'>Transactions</h1>



//             </div>
//         </div>

//     );
// }

// export default Transactions;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WalletDetail from './WalletDetail';
import { Banknote, ImagePlus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

type Transaction = {
    id: string;
    type: string;
    timestamp: number;
    signature: string;
    amount?: number;
    sourceAddress?: string;
    destinationAddress?: string;
    nftMint?: string;
    fee?: number;
    status?: string;
};

function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [nftMints, setNftMints] = useState<Transaction[]>([]);
    const [transfers, setTransfers] = useState<Transaction[]>([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true); // Loading state
    const address = useSelector((state: RootState) => state.wallet.publicKey);
    const apiKey = import.meta.env.VITE_HELIUS_API_KEY;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading to true before fetching data
            try {
                const response = await axios.get(
                    `https://api.helius.xyz/v0/addresses/${address}/transactions`,
                    { params: { 'api-key': apiKey } }
                );
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };
        fetchData();
    }, [address, apiKey]);

    useEffect(() => {
        if (transactions.length > 0) {
            setNftMints(transactions.filter(item => item.type === 'COMPRESSED_NFT_MINT'));
            setTransfers(transactions.filter(item => item.type === 'TRANSFER'));
        }
    }, [transactions]);

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'TRANSFER':
                return <Banknote style={{ color: 'green', fontSize: '24px' }} />;
            case 'COMPRESSED_NFT_MINT':
                return <ImagePlus style={{ color: 'blue', fontSize: '24px' }} />;
            default:
                return '📝';
        }
    };

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'success':
                return 'text-green-400';
            case 'failed':
                return 'text-red-400';
            default:
                return 'text-gray-400';
        }
    };

    const formatDistanceToNow = (timestamp: number) => {
        const now = Date.now();
        const diffInSeconds = Math.floor((now - timestamp * 1000) / 1000);
        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
        }
    };

    // Loader component (simple spinner)
    const Loader = () => (
        <div className="flex justify-center items-center">
            <div className="spinner-border animate-spin border-4 border-t-4 border-blue-500 rounded-full w-12 h-12"></div>
        </div>
    );

    return (
        <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/4 bg-[#0D1421] text-white sm:h-screen sm:sticky top-0 overflow-y-auto p-4 sm:p-0">
                <WalletDetail />
            </div>
            <div className="flex-1 p-6 bg-[#151c2b] min-h-screen">
                <h1 className="text-3xl font-bold text-white mb-6">Transactions</h1>

                {/* Tabs */}
                <div className="flex space-x-4 mb-6 border-b border-gray-700">
                    <button
                        className={`pb-2 px-4 ${activeTab === 'all' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Transactions
                    </button>
                    <button
                        className={`pb-2 px-4 ${activeTab === 'transfers' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('transfers')}
                    >
                        Transfers
                    </button>
                    <button
                        className={`pb-2 px-4 ${activeTab === 'nftMints' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('nftMints')}
                    >
                        NFT Mints
                    </button>
                </div>

                {/* Transaction List or Loader */}
                {loading ? (
                    <Loader /> // Show loader while data is loading
                ) : (
                    <div className="space-y-4">
                        {(activeTab === 'all' ? transactions :
                            activeTab === 'transfers' ? transfers :
                                nftMints).map((tx) => (
                                    <div key={tx.id} className="bg-[#1A1F2E] rounded-lg p-4 hover:bg-[#242B3D] transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4">
                                                <div className="text-2xl mt-1">{getTransactionIcon(tx.type)}</div>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-white font-medium">
                                                            {tx.type.split('_').map(word =>
                                                                word.charAt(0) + word.slice(1).toLowerCase()
                                                            ).join(' ')}
                                                        </span>
                                                        <span className={`text-sm ${getStatusColor(tx.status || 'success')}`}>
                                                            {tx.status || 'Success'}
                                                        </span>
                                                    </div>

                                                    <div className="text-sm text-gray-400 mt-1">
                                                        {tx.sourceAddress && (
                                                            <span>From: {shortenAddress(tx.sourceAddress)} </span>
                                                        )}
                                                        {tx.destinationAddress && (
                                                            <span>To: {shortenAddress(tx.destinationAddress)}</span>
                                                        )}
                                                    </div>

                                                    <div className="text-sm text-gray-400 mt-1">
                                                        <a
                                                            href={`https://solscan.io/tx/${tx.signature}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-400 hover:underline"
                                                        >
                                                            View on Solscan
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-white">
                                                    {tx.amount ? `${tx.amount} SOL` : 'N/A'}
                                                </div>
                                                <div className="text-sm text-gray-400 mt-1">
                                                    {tx.timestamp ? formatDistanceToNow(tx.timestamp) : 'N/A'}
                                                </div>
                                                {tx.fee && (
                                                    <div className="text-xs text-gray-400">
                                                        Fee: {tx.fee} SOL
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Transactions;
