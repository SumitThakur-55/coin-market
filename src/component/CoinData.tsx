import { useParams } from 'react-router-dom';
import CoinNews from './CoinNews';
import { useState } from 'react';
import CoinDetail from './CoinDetail';

export default function CoinData() {
    const { id } = useParams<{ id: string }>();
    const [coinName, setCoinName] = useState<string>(''); // Initialize as an empty string

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

    return (
        <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/6 bg-[#292D3E] text-white h-auto md:h-screen md:sticky top-0 md:overflow-hidden p-4 md:p-0 overflow-y-auto">
                {/* Pass the callback to CoinDetail */}
                <CoinDetail id={id} onCoinName={handleCoinName} />
            </div>
            <div className="flex-1 p-4  bg-[#323546] overflow-hidden sticky top-0">
                <CoinNews name={coinName} />
            </div>
        </div>
    );
}
