import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export default async (req, res) => {
    const { publicKey } = req.body;

    if (!publicKey) {
        return res.status(400).json({ error: 'Wallet address is required.' });
    }

    try {
        const response = await axios.post(`https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`, {
            id: 1,
            jsonrpc: "2.0",
            method: "getAssetsByOwner",
            params: {
                ownerAddress: publicKey,
                displayOptions: {
                    showFungible: false
                }
            }

        });

        // Log the full response for debugging
        console.log('API Response:', response.data);

        if (response.data && response.data.result) {
            const { items } = response.data.result; // Extract the items

            // Optionally, log the number of items fetched
            // console.log(`Total items fetched: ${items.length}`);

            // Return only the items to the client
            return res.status(200).json(items);
        } else {
            return res.status(404).json({ error: 'No assets found for the provided wallet address.' });
        }
    } catch (error) {
        console.error('Helius API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({
            error: error.response ? error.response.data : error.message || 'Failed to fetch assets. Please try again.',
        });
    }
};
