// CoinDetail.tsx
import { useEffect, useState } from 'react';
import numeral from 'numeral';


interface CoinData {
    id: string;
    symbol: string;
    name: string;
    web_slug: string;
    asset_platform_id: string;
    platforms: object;
    detail_platforms: object;
    block_time_in_minutes: number;
    hashing_algorithm: string;
    categories: string[];
    preview_listing: boolean;
    public_notice: string;
    additional_notices: string[];
    localization: object;
    description: object;
    links: {
        homepage: string[];
        whitepaper: string[];
        blockchain_site: string[];
        official_forum_url: string[];
        chat_url: string[];
        announcement_url: string[];
        twitter_screen_name: string;
        facebook_username: string;
        bitcointalk_thread_identifier: string;
        telegram_channel_identifier: string;
        subreddit_url: string;
        repos_url: {
            github: string[];
            bitbucket: string[];
        };
    };
    image: {
        thumb: string;
        small: string;
        large: string;
    };
    country_origin: string;
    genesis_date: string;
    sentiment_votes_up_percentage: number;
    sentiment_votes_down_percentage: number;
    market_cap_rank: number;
    market_data: {
        current_price: { [key: string]: number };
        total_value_locked: number;
        mcap_to_tvl_ratio: number;
        fdv_to_tvl_ratio: number;
        roi: number;
        ath: { [key: string]: number };
        ath_change_percentage: { [key: string]: number };
        ath_date: { [key: string]: string };
        atl: { [key: string]: number };
        atl_change_percentage: { [key: string]: number };
        atl_date: { [key: string]: string };
        market_cap: { [key: string]: number };
        market_cap_rank: number;
        fully_diluted_valuation: { [key: string]: number };
        market_cap_fdv_ratio: number;
        total_volume: { [key: string]: number };
        high_24h: { [key: string]: number };
        low_24h: { [key: string]: number };
        price_change_24h: number;
        price_change_percentage_24h: number;
        price_change_percentage_7d: number;
        price_change_percentage_14d: number;
        price_change_percentage_30d: number;
        price_change_percentage_60d: number;
        price_change_percentage_200d: number;
        price_change_percentage_1y: number;
        market_cap_change_24h: number;
        market_cap_change_percentage_24h: number;
        price_change_percentage_1h_in_currency: { [key: string]: number };
        price_change_percentage_24h_in_currency: { [key: string]: number };
        price_change_percentage_7d_in_currency: { [key: string]: number };
        price_change_percentage_14d_in_currency: { [key: string]: number };
        price_change_percentage_30d_in_currency: { [key: string]: number };
        price_change_percentage_60d_in_currency: { [key: string]: number };
        price_change_percentage_200d_in_currency: { [key: string]: number };
        price_change_percentage_1y_in_currency: { [key: string]: number };
        market_cap_change_24h_in_currency: { [key: string]: number };
        market_cap_change_percentage_24h_in_currency: { [key: string]: number };
        total_supply: number;
        max_supply: number;
        circulating_supply: number;

    };
    last_updated: string;
    community_data: {
        facebook_likes: number;
        twitter_followers: number;
        reddit_average_posts_48h: number;
        reddit_average_comments_48h: number;
        reddit_subscribers: number;
        reddit_accounts_active_48h: number;
        telegram_channel_user_count: number;
    };
    developer_data: {
        forks: number;
        stars: number;
        subscribers: number;
        total_issues: number;
        closed_issues: number;
        pull_requests_merged: number;
        pull_request_contributors: number;
        code_additions_deletions_4_weeks: {
            additions: number;
            deletions: number;
        };
        commit_count_4_weeks: number;
        last_4_weeks_commit_activity_series: number[];
    };
    status_updates: object[];
    tickers: object[];
}

interface CoinDetailProps {
    id: string;
    onCoinName: (name: string) => void;
    onCurrentPrice: (price: number) => void; // Add this line
}

const CoinDetail = ({ id, onCoinName, onCurrentPrice }: CoinDetailProps) => {
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
                const response = await fetch(`https://coin-market-backend-production.up.railway.app/api/coin/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: CoinData = await response.json();
                setCoin(data);
                onCoinName(data.symbol);
                onCurrentPrice(data.market_data.current_price.usd); // Add this line
            } catch (error) {
                setError('Failed to fetch coin data');
            } finally {
                setLoading(false);
            }
        }

        fetchCoinDetail();
    }, [id, onCoinName, onCurrentPrice]); // Add onCurrentPrice to the dependency array

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
    function formatBigValue(value: number) {
        return numeral(value).format('0.0a'); // 'a' for abbreviated formatting
    }
    return (
        <div className='pb-10'>
            <div className='flex flex-col items-left mt-4 p-2 pl-5'>
                <div className='flex items-left mb-2'>
                    <img src={coin.image.small} alt={`${coin.name} icon`} className='w-12 h-12 mr-4' />
                    <div>
                        <div className='flex items-center'>
                            <h1 className='text-3xl font-bold mr-2'>{coin.name}</h1>
                            <span className='text-xl text-gray-500'>({coin.symbol.toUpperCase()})</span>
                        </div>
                        <p className='text-gray-600'>{coin.market_cap_rank ? `#${coin.market_cap_rank}` : ''}</p>
                    </div>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='text-4xl font-bold mb-2 mr-2'>${(coin.market_data.current_price as { [key: string]: number })['usd']?.toLocaleString() || 'N/A'}</p>
                    <div className='flex flex-row items-center align-middle'>
                        <span className={`text-md font-medium ${coin.market_data.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {coin.market_data.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                            {Math.abs(coin.market_data.price_change_percentage_24h).toFixed(4)}%
                        </span>
                        <span className='text-sm text-gray-500 ml-2'>1d</span>
                    </div>
                </div>
            </div>

            {/* detail */}
            <div className='grid grid-cols-2 gap-4 p-4  text-white rounded-lg '>
                <div className='flex flex-col items-center bg-[#1E2633] p-2 rounded-xl border-2 border-gray-500' >
                    <p className='text-sm text-gray-400'>Market cap</p>
                    <div className='flex items-center'>
                        <p className='text-lg font-bold mr-2'>
                            {formatBigValue(coin.market_data.market_cap?.usd).toUpperCase() || 'N/A'}
                        </p>
                        <p className={`text-sm ${coin.market_data.market_cap_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {Math.abs(coin.market_data.market_cap_change_percentage_24h).toFixed(2)}%
                            {coin.market_data.market_cap_change_percentage_24h >= 0 ? '▲' : '▼'}
                        </p>
                    </div>
                </div>
                <div className='flex flex-col items-center bg-[#1E2633] p-2 rounded-xl border-2 border-gray-500'>
                    <p className='text-sm text-gray-400'>Volume (24h)</p>
                    <div className='flex items-center'>
                        <p className='text-lg font-bold mr-2'>
                            {formatBigValue(coin.market_data.total_volume?.usd).toUpperCase() || 'N/A'}
                        </p>
                        <p className={`text-sm ${coin.market_data.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {Math.abs(coin.market_data.price_change_percentage_24h).toFixed(2)}%
                            {coin.market_data.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                        </p>
                    </div>
                </div>
                <div className='flex flex-col items-center bg-[#1E2633] p-2 rounded-xl border-2 border-gray-500'>
                    <p className='text-sm text-gray-400'>FDV</p>
                    <p className='text-lg font-bold'>
                        {formatBigValue(coin.market_data.fully_diluted_valuation?.usd).toUpperCase() || 'N/A'}
                    </p>
                </div>
                <div className='flex flex-col items-center bg-[#1E2633] p-2 rounded-xl border-2 border-gray-500'>
                    <p className='text-sm text-gray-400'>Vol/Mkt Cap (24h)</p>
                    <p className='text-lg font-bold'>
                        {(coin.market_data.total_volume?.usd / coin.market_data.market_cap?.usd * 100).toFixed(2) || 'N/A'}%
                    </p>
                </div>
                <div className='flex flex-col items-center bg-[#1E2633] rounded-xl border-2 border-gray-500  '>
                    <p className='text-sm text-gray-400'>Total supply</p>
                    <p className='text-lg font-bold'>
                        {formatBigValue(coin.market_data.total_supply).toUpperCase()} {coin.symbol.toUpperCase()}
                    </p>
                </div>
                <div className='flex flex-col items-center  bg-[#1E2633] p-2 rounded-xl border-2 border-gray-500'>
                    <p className='text-sm text-gray-400'>Max. supply</p>
                    <p className='text-lg font-bold'>
                        {formatBigValue(coin.market_data.max_supply).toUpperCase()} {coin.symbol.toUpperCase()}
                    </p>
                </div>
                <div className='col-span-2 flex flex-col items-center p-2 bg-[#1E2633] rounded-xl border-2 border-gray-500'>
                    <p className='text-sm text-gray-400'>Circulating supply</p>
                    <p className='text-lg font-bold'>
                        {formatBigValue(coin.market_data.circulating_supply).toUpperCase()} {coin.symbol.toUpperCase()}
                    </p>
                </div>
            </div>

            {/* Info Section */}
            <div className='mt-8 bg-[#1E2633] border-2 border-gray-500 rounded-xl p-4 m-2 mx-4'>
                <h2 className='text-xl font-bold mb-4 text-white'>Info</h2>
                <div className='grid grid-cols-1 sm:grid-cols-1 gap-4'>
                    {coin.links?.homepage?.[0] && (
                        <div>
                            <p className='text-md text-gray-400 mb-2'>Website</p>
                            <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer" className='text-white bg-gray-700 px-2 py-1 rounded-full text-sm  hover:bg-gray-600 transition-colors duration-200'>{coin.links.homepage[0]}</a>
                        </div>
                    )}
                    {coin.links?.blockchain_site && coin.links.blockchain_site.length > 0 && (
                        <div>
                            <p className='text-md text-gray-400 mb-2'>Explorers</p>
                            <div className='flex flex-wrap gap-2'>
                                {coin.links.blockchain_site.slice(0, 3).map((site, index) => (
                                    site && (
                                        <a key={index} href={site} target="_blank" rel="noopener noreferrer" className='text-white bg-gray-700 px-2 py-1 rounded-full text-sm  hover:bg-gray-600 transition-colors duration-200'>
                                            {new URL(site).hostname}
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                    {coin.links?.official_forum_url && coin.links.official_forum_url.length > 0 && (
                        <div>
                            <p className='text-md text-gray-400 mb-2'>Community</p>
                            <div className='flex flex-wrap gap-2'>
                                {coin.links.official_forum_url.slice(0, 3).map((forum, index) => (
                                    forum && (
                                        <a key={index} href={forum} target="_blank" rel="noopener noreferrer" className='text-white bg-gray-700 px-2 py-1 rounded-full text-sm  hover:bg-gray-600 transition-colors duration-200'>
                                            {new URL(forum).hostname}
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                    {coin.links?.repos_url?.github && coin.links.repos_url.github.length > 0 && (
                        <div>
                            <p className='text-md text-gray-400 mb-2'>Source Code</p>
                            <div className='flex flex-wrap gap-2'>
                                {coin.links.repos_url.github.slice(0, 3).map((repo, index) => (
                                    <a key={index} href={repo} target="_blank" rel="noopener noreferrer" className='text-white bg-gray-700 px-2 py-1 rounded-full text-sm  hover:bg-gray-600 transition-colors duration-200'>
                                        GitHub
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                    {coin.id && (
                        <div>
                            <p className='text-md text-gray-400 mb-2'>API ID</p>
                            <p className='text-white'>
                                <span className='bg-gray-700 px-2 py-1 rounded-full text-sm inline-block'>
                                    {coin.id}
                                </span>
                            </p>
                        </div>
                    )}
                    {coin.asset_platform_id && (
                        <div>
                            <p className='text-md text-gray-400 mb-2'>Chains</p>
                            <p className='text-white '>{coin.asset_platform_id}</p>
                        </div>
                    )}
                    {coin.categories && coin.categories.length > 0 && (
                        <div>
                            <p className='text-md text-gray-400 mb-2'>Categories</p>
                            <div className='flex flex-wrap gap-2'>
                                {coin.categories.map((category, index) => (
                                    <span key={index} className='text-white bg-gray-700 px-2 py-1 rounded-full text-sm'>
                                        {category}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* historical data */}


            <div className='mt-8 bg-[#1E2633] rounded-xl border-2 border-gray-500 p-4 m-2 mx-4'>
                <h2 className='text-xl font-bold mb-4 text-white'>{coin.symbol.toUpperCase()} Historical Price</h2>
                <div className='grid grid-cols-1 gap-4'>
                    <div>
                        <p className='text-sm text-gray-400'>24h Range</p>
                        <p className='text-lg font-bold text-white'>
                            ${numeral(coin.market_data.low_24h.usd).format('0,0.00')} - ${numeral(coin.market_data.high_24h.usd).format('0,0.00')}
                        </p>
                    </div>
                    <div>
                        <p className='text-sm text-gray-400'>All-Time High</p>
                        <p className='text-lg font-bold text-green-500'>
                            ${numeral(coin.market_data.ath.usd).format('0,0.00')}
                            <span className='text-sm ml-2'>
                                ▲ {numeral(coin.market_data.ath_change_percentage.usd / 100).format('0.0%')}
                            </span>
                        </p>
                        <p className='text-xs text-gray-400'>
                            {new Date(coin.market_data.ath_date.usd).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className='text-sm text-gray-400'>All-Time Low</p>
                        <p className='text-lg font-bold text-red-500'>
                            ${numeral(coin.market_data.atl.usd).format('0,0.00')}
                            <span className='text-sm ml-2'>
                                ▼ {numeral(Math.abs(coin.market_data.atl_change_percentage.usd) / 100).format('0.0%')}
                            </span>
                        </p>
                        <p className='text-xs text-gray-400'>
                            {new Date(coin.market_data.atl_date.usd).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Price Change Percentages */}
            <div className='mt-8 bg-[#1E2633] rounded-xl border-2 border-gray-500 p-4 m-2 mx-4'>
                <h2 className='text-xl font-bold mb-4 text-white'>Price Change</h2>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-4'>
                    {['24h', '7d', '14d', '30d', '60d', '1y'].map((period) => {
                        const key = `price_change_percentage_${period}` as keyof typeof coin.market_data;
                        const value = coin.market_data[key];
                        return (
                            <div key={period} className='bg-[#2C3E50] p-3 rounded-lg'>
                                <p className='text-sm text-gray-400'>{period}</p>
                                <p className={`text-lg font-bold ${typeof value === 'number' && value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {typeof value === 'number' ? (value >= 0 ? '▲' : '▼') : '-'} {typeof value === 'number' ? Math.abs(value).toFixed(1) : '0.00'}%
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>


        </div>
    );
};

export default CoinDetail;
