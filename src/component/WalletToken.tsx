import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { setTotalUSD } from '../feature/basicData/BasicDataSlice'
import { setTokenBalances } from '../feature/basicData/BasicDataSlice'
interface TokenAccount {
    account: string;
    balance: number;
    symbol: string;
    name: string;
    pricePerToken: number;
    decimals: number;
    [key: string]: any;
}

const WalletToken: React.FC = () => {
    const ownerAddress = useSelector((state: RootState) => state.wallet.publicKey);
    const totalUSD = useSelector((state: RootState) => state.wallet.totalUSD);  // Access totalUSD from Redux state
    const dispatch = useDispatch(); // Access totalUSD from Redux state
    const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const itemsPerPage = 7; // Number of rows per page
    // Total value in USD
    const apiKey = import.meta.env.VITE_HELIUS_API_KEY;
    const url = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;


    const getTokenAccounts = async () => {
        if (!ownerAddress) {
            setError("Owner address is missing.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: "my-id",
                    method: "getAssetsByOwner",
                    params: {
                        ownerAddress: ownerAddress,
                        page: 1,
                        limit: 1000,
                        displayOptions: {
                            showFungible: true,
                            showZeroBalance: false
                        },
                    },
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                setError(`Fetch failed with status ${response.status}: ${errorText}`);
                console.error("Response error:", errorText);
                return;
            }

            const data = await response.json();
            if (!data.result) {
                setError("No result in the response");
                console.error("No result in the response", data);
            } else {
                const fungibleTokens = data.result.items
                    .filter((item: any) => item.interface === "FungibleToken")
                    .map((item: any) => ({
                        account: item.id,
                        balance: item.token_info?.balance || 0,
                        symbol: item.content?.metadata?.symbol || "N/A",
                        name: item.content?.metadata?.name || "N/A",
                        pricePerToken: item.token_info?.price_info?.price_per_token || 0,
                        imageUrl: item.content?.links?.image || null,
                        decimals: item.token_info?.decimals || 0,
                    }));
                setTokenAccounts(fungibleTokens);
                dispatch(setTokenBalances(fungibleTokens))

                // console.log("Filtered fungible tokens:", fungibleTokens);

            }

        } catch (err) {
            setError("An error occurred while fetching data.");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatBalance = (rawBalance: number, decimals: number) => {
        return rawBalance / Math.pow(10, decimals);
    };

    useEffect(() => {
        if (ownerAddress) {
            getTokenAccounts();
        }
    }, [ownerAddress]);

    useEffect(() => {
        if (tokenAccounts) {
            const totalUSD = tokenAccounts.reduce((sum, token) => {
                const readableBalance = token.balance / Math.pow(10, token.decimals);
                return sum + readableBalance * token.pricePerToken;
            }, 0);
            dispatch(setTotalUSD(totalUSD));
        }
    }, [tokenAccounts]);
    // Filter and sort the token accounts
    const filteredAccounts = tokenAccounts
        ? [...tokenAccounts].sort((a, b) => {
            const totalValueA = (a.balance / 10 ** a.decimals) * a.pricePerToken;
            const totalValueB = (b.balance / 10 ** b.decimals) * b.pricePerToken;
            return totalValueB - totalValueA;
        })
        : null;

    // Pagination logic applied on the filtered results
    const totalPages = filteredAccounts ? Math.ceil(filteredAccounts.length / itemsPerPage) : 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAccounts = filteredAccounts?.slice(startIndex, endIndex);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="text-white px-4">

            <div>
                <div className="my-6">
                    <h2 className="text-2xl font-bold mb-2 text-gray-100">Wallet  Fungible Token</h2>
                </div>
                {error && <p className="text-red-500">{error}</p>}

                {paginatedAccounts && (
                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full table-auto text-white bg-[#222531] rounded-xl overflow-hidden">
                            <thead className="bg-[#0D1421]">
                                <tr className="text-left text-md uppercase tracking-wider">
                                    <th className="px-5 py-5">Name</th>
                                    <th className="px-5 py-5">Symbol</th>
                                    <th className="px-5 py-5">Balance</th>
                                    <th className="px-5 py-5">Price per Token</th>
                                    <th className="px-5 py-5">Total Value (USD)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedAccounts.map((account) => {
                                    const readableBalance = formatBalance(account.balance, account.decimals);
                                    const totalValueUSD = readableBalance * account.pricePerToken;

                                    return (
                                        <tr key={account.account} className="hover:bg-[#292D3E] text-md tracking-wide">
                                            <td className="px-6 py-5 flex items-center">
                                                {account.imageUrl ? (
                                                    <img
                                                        src={account.imageUrl}
                                                        alt={account.name}
                                                        className="w-6 h-6 mr-2 rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-6 mr-2 bg-gray-500 rounded-full flex items-center justify-center">
                                                        <span>N/A</span>
                                                    </div>
                                                )}
                                                <span className="text-xl font-semibold">{account.name}</span>
                                            </td>
                                            <td className="px-6 py-5">{account.symbol}</td>
                                            <td className="px-6 py-5">{readableBalance.toFixed(2)}</td>
                                            <td className="px-6 py-5">${account.pricePerToken}</td>
                                            <td className="px-6 py-5">${totalValueUSD}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div className="flex justify-center space-x-2 mt-4">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="px-3 py-2 bg-gray-700 rounded text-white"
                            >
                                Previous
                            </button>
                            <span className="text-white">{`Page ${currentPage} of ${totalPages}`}</span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 bg-gray-700 rounded text-white"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletToken;
