import React, { useEffect, useState } from 'react';
import { ExternalLink, Clock, Newspaper, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface CoinNewsProps {
    name: string;
    filter?: 'rising' | 'hot' | 'bullish' | 'bearish' | 'important' | 'saved' | 'lol';
    region?: string;
    kind?: 'news' | 'media';
}

interface NewsItem {
    id: number;
    kind: string;
    domain: string;
    title: string;
    published_at: string;
    slug: string;
    currencies: Array<{
        code: string;
        title: string;
        slug: string;
        url: string;
    }>;
    url: string;
    created_at: string;
    votes: {
        negative: number;
        positive: number;
        important: number;
        liked: number;
        disliked: number;
        lol: number;
        toxic: number;
        saved: number;
        comments: number;
    };
    source: {
        title: string;
        region: string;
        domain: string;
    };
}

interface ApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: NewsItem[];
}

const CoinNews: React.FC<CoinNewsProps> = ({
    name,
    filter = 'hot',
    region = 'en',
    kind = 'news'
}) => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState(filter); // State for the selected filter

    const fetchNews = async () => {
        if (!name) {
            console.warn('Coin name is required to fetch news.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`https://coin-market-backend-production.up.railway.app/api/crypto-news?currency=${name.toLowerCase()}&filter=${selectedFilter}&region=${region}&kind=${kind}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Check if the response is ok (status in the range 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse = await response.json();

            // Log the entire API response for debugging
            console.log('API Response:', data);

            if (data && data.results) {
                setNews(data.results);
                if (data.results.length === 0) {
                    setError(`No ${selectedFilter} news available for ${name}`);
                }
            } else {
                throw new Error('Invalid API response format');
            }

        } catch (error: any) {
            console.error('Error fetching news:', error);
            setError(error.message || 'Failed to fetch news. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, [name, selectedFilter, region, kind]); // Use selectedFilter here

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-4 bg-[#151c2b]">
            <div className="flex items-center text-white justify-between">
                <h2 className="text-2xl font-bold">
                    {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} News for {name.toUpperCase()}
                </h2>
                <div className="flex items-center">
                    <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value as 'rising' | 'hot' | 'bullish' | 'bearish' | 'important' | 'saved' | 'lol')}
                        className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2.5 pr-10 inline-flex items-center me-2 mb-2"
                    >
                        <option value="hot">Hot</option>
                        <option value="rising">Rising</option>
                        <option value="bullish">Bullish</option>
                        <option value="bearish">Bearish</option>
                        <option value="important">Important</option>
                        <option value="saved">Saved</option>
                        <option value="lol">LOL</option>
                    </select>
                    <button
                        onClick={fetchNews}
                        className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        <p>{error}</p>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {news.map((item) => (
                    <div
                        key={item.id}
                        className="bg-[#171924] rounded-lg border border-[#323546] hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="p-4">
                            <h3 className="text-lg text-white font-medium mb-2">
                                {item.title}
                            </h3>

                            <div className="flex flex-wrap gap-4 text-sm text-[#D3D3D3] mb-3">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {formatDate(item.published_at)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Newspaper className="h-4 w-4" />
                                    {item.source.title}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {item.currencies?.map((currency) => (
                                    <span
                                        key={currency.code}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        {currency.code}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between">
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                                >
                                    Read full article
                                    <ExternalLink className="h-4 w-4" />
                                </a>

                                <div className="flex gap-4 text-sm text-gray-500">
                                    {item.votes.positive > 0 && (
                                        <span>👍 {item.votes.positive}</span>
                                    )}
                                    {item.votes.negative > 0 && (
                                        <span>👎 {item.votes.negative}</span>
                                    )}
                                    {item.votes.important > 0 && (
                                        <span>⭐ {item.votes.important}</span>
                                    )}
                                    {item.votes.comments > 0 && (
                                        <span>💬 {item.votes.comments}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {news.length === 0 && !error && (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center text-gray-500">
                    No news available for {name} at the moment.
                </div>
            )}
        </div>
    );
};

export default CoinNews;
