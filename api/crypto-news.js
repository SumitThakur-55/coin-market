import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default async (req, res) => {
    const { currency, filter = 'hot', region = 'en', kind = 'news' } = req.query;

    // Validate the currency parameter
    if (!currency) {
        return res.status(400).json({ error: 'Currency parameter is required' });
    }

    try {
        const response = await axios.get(`https://cryptopanic.com/api/free/v1/posts/`, {
            params: {
                auth_token: process.env.CRYPTO_PANIC_API_KEY,
                currencies: currency,
                filter,
                regions: region,
                kind,
                public: true,
            },
        });

        // Return the response data
        res.status(200).json(response.data);
    } catch (error) {
        console.error('CryptoPanic API Error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch crypto news',
        });
    }
};
