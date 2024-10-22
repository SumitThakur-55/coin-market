// CoinDetail.tsx

import { useEffect, useState } from 'react';

// Update interfaces to match exact API response
interface CoinApiResponse {
    data: {
        [key: string]: CoinData;
    };
    status: {
        timestamp: string;
        error_code: number;
        error_message: string | null;
        elapsed: number;
        credit_count: number;
    };
}

interface CoinData {
    id: number;
    name: string;
    symbol: string;
    category: string;
    description: string;
    slug: string;
    logo: string;
    subreddit: string;
    urls: {
        website: string[];
        technical_doc: string[];
        twitter?: string[];
        reddit?: string[];
        message_board?: string[];
        announcement?: string[];
        chat?: string[];
        explorer: string[];
        source_code: string[];
    };
    date_added: string;
    date_launched: string;
    twitter_username: string;
    is_hidden: number;
}

interface CoinDetailProps {
    id: string; // Take id as prop
    onCoinName: (name: string) => void; // Callback prop for the coin name
}

const CoinDetail = ({ id, onCoinName }: CoinDetailProps) => {
    const [coin, setCoin] = useState<CoinData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError('Coin ID is missing.');
            setLoading(false);
            return;
        }

        async function fetchCoinDetail() {
            try {
                const response = await fetch(`http://localhost:5000/api/coin/${id}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const jsonResponse: CoinApiResponse = await response.json();
                console.log('API Response:', jsonResponse);

                // Check for API error
                if (jsonResponse.status.error_code !== 0) {
                    throw new Error(jsonResponse.status.error_message || 'API Error');
                }

                // Check if data exists and has the coin with the specified ID
                const coinData = jsonResponse.data[id];
                if (coinData) {
                    setCoin(coinData);
                    onCoinName(coinData.symbol); // Call the callback with the coin name
                } else {
                    throw new Error('Coin not found.');
                }
            } catch (error) {
                console.error('Error fetching coin detail:', error);
                setError(error instanceof Error ? error.message : 'Could not fetch coin details. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchCoinDetail();
    }, [id, onCoinName]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!coin) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>No data available</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className=" p-3">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
                    <img
                        src={coin.logo}
                        alt={`${coin.name} logo`}
                        className="w-16 h-16 rounded-full"
                    />
                    <div>
                        <h1 className="text-2xl font-bold">
                            {coin.name} ({coin.symbol})
                        </h1>
                        <p className="text-[#D3D3D3]">
                            Category: {coin.category}
                        </p>
                    </div>
                </div>

                {/* Description Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">About</h2>
                    <p className="text-[#D3D3D3]">{coin.description}</p>
                </div>

                {/* Links Section */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Links</h2>

                    {/* Use grid-cols-1 for mobile and grid-cols-2 for larger screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                        {/* Website Links */}
                        {coin.urls.website && coin.urls.website.length > 0 && (
                            <div>
                                <h3 className="font-medium text-lg text-gray-300 mb-2">Website</h3>
                                <ul className="list-none list-inside space-y-1">
                                    {coin.urls.website.map((url, index) => (
                                        <li key={index}>
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-500 hover:underline transition duration-200 ease-in-out"
                                            >
                                                {url}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Source Code Links */}
                        {coin.urls.source_code && coin.urls.source_code.length > 0 && (
                            <div>
                                <h3 className="font-medium text-lg text-gray-300 mb-2">Source Code</h3>
                                <ul className="list-none list-inside space-y-1">
                                    {coin.urls.source_code.map((url, index) => (
                                        <li key={index}>
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-500 hover:underline transition duration-200 ease-in-out"
                                            >
                                                {url}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Reddit Links */}
                        {coin.subreddit && (
                            <div>
                                <h3 className="font-medium text-lg text-gray-300 mb-2">Reddit</h3>
                                <ul className="list-none list-inside space-y-1">
                                    <li>
                                        <a
                                            href={`https://reddit.com/r/${coin.subreddit}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-500 hover:underline transition duration-200 ease-in-out"
                                        >
                                            r/{coin.subreddit}

                                        </a>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Information */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-[#FFD700]">Launch Date</p>
                            <p>{new Date(coin.date_launched).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-[#FFD700]">Added to CMC</p>
                            <p>{new Date(coin.date_added).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CoinDetail;
