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
}

const CoinDetail = ({ id }: CoinDetailProps) => {
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
    }, [id]);

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
            <div className="bg-[white] rounded-lg shadow-lg p-6">
                {/* Header Section */}
                <div className="flex items-center space-x-4 mb-6">
                    <img
                        src={coin.logo}
                        alt={`${coin.name} logo`}
                        className="w-16 h-16 rounded-full"
                    />
                    <div>
                        <h1 className="text-2xl font-bold">
                            {coin.name} ({coin.symbol})
                        </h1>
                        <p className="text-gray-600">
                            Category: {coin.category}
                        </p>
                    </div>
                </div>

                {/* Description Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">About</h2>
                    <p className="text-gray-700">{coin.description}</p>
                </div>

                {/* Links Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {coin.urls.website && coin.urls.website.length > 0 && (
                            <div>
                                <h3 className="font-medium">Website</h3>
                                <ul className="list-disc list-inside">
                                    {coin.urls.website.map((url, index) => (
                                        <li key={index}>
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {url}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {coin.urls.source_code && coin.urls.source_code.length > 0 && (
                            <div>
                                <h3 className="font-medium">Source Code</h3>
                                <ul className="list-disc list-inside">
                                    {coin.urls.source_code.map((url, index) => (
                                        <li key={index}>
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {url}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {coin.subreddit && (
                            <div>
                                <h3 className="font-medium">Reddit</h3>
                                <a
                                    href={`https://reddit.com/r/${coin.subreddit}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    r/{coin.subreddit}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Information */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Launch Date</p>
                            <p>{new Date(coin.date_launched).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Added to CMC</p>
                            <p>{new Date(coin.date_added).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoinDetail;
