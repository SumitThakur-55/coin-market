import { useParams } from 'react-router-dom';
import CoinNews from './CoinNews';
import { useState } from 'react';
import CoinDetail from './CoinDetail';
import CoinChart from './CoinChart';


export default function CoinData() {
    const { id } = useParams<{ id: string }>();
    const [coinName, setCoinName] = useState<string>('');
    const [currentPrice, setCurrentPrice] = useState<number>(0); // Add this line

    if (!id) {
        return (
            <div className='bg-white text-black'>
                <p>No Coin ID provided.</p>
            </div>
        );
    }

    // Callback function to receive the coin name
    const handleCoinName = (name: string) => {
        setCoinName(name);
    };

    // Callback function to receive the current price
    const handleCurrentPrice = (price: number) => {
        setCurrentPrice(price);
    };

    return (
        <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/4 bg-[#0D1421] text-white sm:h-screen sm:sticky top-0 overflow-y-auto scrollbar-hide p-4 sm:p-0 no-scrollbar">
                <CoinDetail
                    id={id}
                    onCoinName={handleCoinName}
                    onCurrentPrice={handleCurrentPrice} // Add this line
                />
            </div>
            <div className="flex-1 p-4 bg-[#151c2b] overflow-hidden sticky top-0">
                <CoinChart coinId={id} currentPrice={currentPrice} /> {/* Pass currentPrice here */}
                <CoinNews name={coinName} />
            </div>
        </div>
    );
}
