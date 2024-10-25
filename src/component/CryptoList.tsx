import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface CryptoData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    roi: null | any; // You might want to define a more specific type for ROI if it's not always null
    last_updated: string;
}

const PAGE_SIZE = 30;

function CryptoList() {
    const [cryptoData, setCryptoData] = useState<CryptoData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('https://coin-market-backend-production.up.railway.app/api/coin-data');
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}. ${errorText}`);
                }
                const data = await response.json();
                setCryptoData(data);
            } catch (error) {
                console.error('Error fetching cryptocurrency data:', error);
                setError(error instanceof Error ? error.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <p className="text-white text-2xl text-center py-10">Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-xl text-center py-10">{error}</p>; // Display error message
    }

    if (!cryptoData) {
        return <p className="text-white">No data available</p>;
    }

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const currentData = cryptoData.slice(startIndex, startIndex + PAGE_SIZE);
    const totalPages = Math.ceil(cryptoData.length / PAGE_SIZE);

    return (
        <div className="px-11">
            <div className="py-10">
                <h1 className="text-5xl font-bold text-center m-14 text-white">
                    Today's Cryptocurrency Prices by Market Cap
                </h1>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-white bg-[#222531] rounded-xl overflow-hidden">
                    <thead className="bg-[#0D1421]">
                        <tr className="text-left text-md uppercase tracking-wider">
                            <th className="px-5 py-8">#</th>
                            <th className="px-5 py-8">Name</th>
                            <th className="px-5 py-8">Price</th>
                            <th className="px-5 py-8">24h %</th>
                            <th className="px-5 py-8">7d High</th>
                            <th className="px-5 py-8">7d Low</th>
                            <th className="px-5 py-8">Market Cap</th>
                            <th className="px-5 py-8">Volume (24h)</th>
                            <th className="px-5 py-8">Circulating Supply</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((crypto) => (
                            <tr key={crypto.id} className="hover:bg-[#292D3E] text-md tracking-wide">
                                <td className="px-6 py-8 text-white">
                                    <Link to={`/coins/${crypto.id}`}>{crypto.market_cap_rank}</Link>
                                </td>
                                <td className="px-6 py-8 flex items-center text-white">
                                    <Link to={`/coins/${crypto.id}`} className="w-full h-full flex items-center">
                                        <img
                                            src={crypto.image}
                                            alt={`${crypto.name} logo`}
                                            className="w-6 h-6 mr-2"
                                        />
                                        {crypto.name} <span className="text-gray-400 ml-1">({crypto.symbol.toUpperCase()})</span>
                                    </Link>
                                </td>
                                <td className="px-6 py-8">
                                    <Link to={`/coins/${crypto.id}`}>${crypto.current_price.toFixed(2)}</Link>
                                </td>
                                <td className={`px-6 py-8 ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    <Link to={`/coins/${crypto.id}`}>{crypto.price_change_percentage_24h.toFixed(2)}%</Link>
                                </td>
                                <td className="px-6 py-8">
                                    <Link to={`/coins/${crypto.id}`}>${crypto.high_24h.toFixed(2)}</Link>
                                </td>
                                <td className="px-6 py-8">
                                    <Link to={`/coins/${crypto.id}`}>${crypto.low_24h.toFixed(2)}</Link>
                                </td>
                                <td className="px-6 py-8">
                                    <Link to={`/coins/${crypto.id}`}>${crypto.market_cap.toLocaleString()}</Link>
                                </td>
                                <td className="px-6 py-8">
                                    <Link to={`/coins/${crypto.id}`}>${crypto.total_volume.toLocaleString()}</Link>
                                </td>
                                <td className="px-6 py-8">
                                    <Link to={`/coins/${crypto.id}`}>{crypto.circulating_supply.toLocaleString()} {crypto.symbol.toUpperCase()}</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2"
                >
                    Previous
                </button>
                <span className="text-white">Page {currentPage} of {totalPages}</span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default CryptoList;
