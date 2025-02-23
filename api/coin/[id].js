import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default async (req, res) => {
    const { id } = req.query; // Get the coin ID from the query parameters

    // Validate that the coin ID is provided
    if (!id) {
        return res.status(400).json({ error: 'Coin ID is required' });
    }

    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`, {
            headers: {
                'X-CG-API-KEY': process.env.X_CG_API_KEY, // Ensure the correct API key header
            },
        });

        // Set CORS headers if needed
        res.setHeader('Access-Control-Allow-Origin', '*'); // Update this to your frontend domain for security
        res.status(200).json(response.data); // Send the response data back
    } catch (error) {
        console.error('Error fetching coin details:', error.response?.data || error.message);
        const status = error.response ? error.response.status : 500; // Determine status code
        res.status(status).json({
            error: 'Error fetching coin details',
            details: error.response?.data || error.message,
        });
    }
};
