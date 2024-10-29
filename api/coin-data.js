import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export default async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            headers: { // Corrected from 'header' to 'headers'
                'X-CMC_PRO_API_KEY': process.env.X_CG_API_KEY,
            },
            params: {
                vs_currency: 'inr',
                order: 'market_cap_desc',
                per_page: 120,
                page: 1,
                sparkline: false,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching from CoinGecko:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Error fetching data from CoinGecko API',
            details: error.response?.data || error.message,
        });
    }
};
