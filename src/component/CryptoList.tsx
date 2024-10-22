import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface CryptoData {
    id: string;
    name: string;
    symbol: string;
    slug: string;
    quote: {
        USD: {
            price: number;
            percent_change_1h: number;
            percent_change_24h: number;
            percent_change_7d: number;
            market_cap: number;
            volume_24h: number;
        };
    };
    circulating_supply: number;
}

const PAGE_SIZE = 30;

function CryptoList() {
    const [cryptoData, setCryptoData] = useState<CryptoData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:5000/api/coin-data');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setCryptoData(data.data);
            } catch (error) {
                console.error('Error fetching cryptocurrency data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <p className="text-white text-2xl text-center py-10">Loading...</p>;
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
                        <tr className="text-left text-md uppercase tracking-wider">{/* Remove whitespace between th elements */}
                            <th className="px-5 py-8">#</th>
                            <th className="px-5 py-8">Name</th>
                            <th className="px-5 py-8">Price</th>
                            <th className="px-5 py-8">1h %</th>
                            <th className="px-5 py-8">24h %</th>
                            <th className="px-5 py-8">7d %</th>
                            <th className="px-5 py-8">Market Cap</th>
                            <th className="px-5 py-8">Volume (24h)</th>
                            <th className="px-5 py-8">Circulating Supply</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((crypto, index) => (
                            <tr key={crypto.id} className="hover:bg-[#292D3E] text-md tracking-wide">
                                <td className="px-6 py-8 text-white">
                                    <Link to={`/coins/${crypto.id}`}>{startIndex + index + 1}</Link>
                                </td>
                                <td className="px-6 py-8 flex items-center text-white">
                                    <Link to={`/coins/${crypto.id}`} className="w-full h-full flex items-center">
                                        <img
                                            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`}
                                            alt={`${crypto.name} logo`}
                                            className="w-6 h-6 mr-2"
                                        />
                                        {crypto.name} <span className="text-gray-400 ml-1">({crypto.symbol})</span>
                                    </Link>
                                </td>
                                <td className="px-6 py-8">
                                    <Link to={`/coins/${crypto.id}`}>${crypto.quote.USD.price.toFixed(2)}</Link>
                                </td>
                                <td className={`px-6 py-8 ${crypto.quote.USD.percent_change_1h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    <Link to={`/coins/${crypto.id}`}>{crypto.quote.USD.percent_change_1h.toFixed(2)}%</Link>
                                </td>
                                <td className={`px-6 py-8 ${crypto.quote.USD.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    <Link to={`/coins/${crypto.id}`}>{crypto.quote.USD.percent_change_24h.toFixed(2)}%</Link>
                                </td>
                                <td className={`px-6 py-8 ${crypto.quote.USD.percent_change_7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    <Link to={`/coins/${crypto.id}`}>{crypto.quote.USD.percent_change_7d.toFixed(2)}%</Link>
                                </td>
                                <td className="px-6 py-8">
                                    <Link to={`/coins/${crypto.id}`}>${crypto.quote.USD.market_cap.toLocaleString()}</Link>
                                </td>
                                <td className="px-6 py-8">
                                    <Link to={`/coins/${crypto.id}`}>${crypto.quote.USD.volume_24h.toLocaleString()}</Link>
                                </td>
                                <td className="px-6 py-8">
                                    <Link to={`/coins/${crypto.id}`}>{crypto.circulating_supply.toLocaleString()} {crypto.symbol}</Link>
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