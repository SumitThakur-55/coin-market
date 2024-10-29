import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default async (req, res) => {
    const { id } = req.query; // Get the coin ID from the query parameters
    const { vs_currency = 'usd', days = '30', interval = 'daily', precision = '7' } = req.query;

    // Validate that the coin ID is provided
    if (!id) {
        return res.status(400).json({ error: 'Coin ID is required' });
    }

    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
            headers: {
                'X-CG-API-KEY': process.env.X_CG_API_KEY, // Ensure the correct API key header
            },
            params: {
                vs_currency,
                days,
                interval,
                precision,
            },
        });

        // Set CORS headers if needed
        res.setHeader('Access-Control-Allow-Origin', '*'); // Update this to your frontend domain for security
        res.status(200).json(response.data); // Send the response data back
    } catch (error) {
        console.error(`Error fetching chart data for ${id}:`, error.response?.data || error.message);
        const status = error.response ? error.response.status : 500; // Determine status code
        res.status(status).json({
            error: 'Error fetching coin chart data',
            details: error.response?.data || error.message,
        });
    }
};
