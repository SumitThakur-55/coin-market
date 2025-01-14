import React from 'react';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

interface AssetFile {
    cdn_uri: string;
}

interface AssetMetadata {
    name: string;
    symbol: string;
    description: string;
}

interface AssetContent {
    files: AssetFile[];
    metadata: AssetMetadata;
}

interface AssetOwnership {
    frozen: boolean;
    burnt: boolean;
}

interface AssetRoyalty {
    percent: number;
}

interface Asset {
    id: string;
    content: AssetContent;
    ownership: AssetOwnership;
    royalty: AssetRoyalty;
}

const Badge: React.FC<{ children: React.ReactNode; variant?: 'secondary' | 'destructive' | 'outline' }> = ({
    children,
    variant = 'secondary'
}) => {
    const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition duration-200";
    const variantStyles = {
        secondary: "bg-gray-100 text-gray-800",
        destructive: "bg-red-100 text-red-800",
        outline: "border border-gray-200 text-gray-100"
    };

    return (
        <span className={`${baseStyles} ${variantStyles[variant]}`}>
            {children}
        </span>
    );
};

const WalletAssets: React.FC = () => {
    const publicKey = useSelector((state: RootState) => state.wallet.publicKey);
    const [assets, setAssets] = React.useState<Asset[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const [currentPage, setCurrentPage] = React.useState(1);
    const assetsPerPage = 18;

    const indexOfLastAsset = currentPage * assetsPerPage;
    const indexOfFirstAsset = indexOfLastAsset - assetsPerPage;
    const currentAssets = assets.slice(indexOfFirstAsset, indexOfLastAsset);
    const totalPages = Math.ceil(assets.length / assetsPerPage);

    React.useEffect(() => {
        const fetchAssets = async () => {
            if (!publicKey) return;

            setLoading(true);
            setError(null);

            try {
                const response = await fetch('/api/fetchAssets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ publicKey }),
                });

                const data = await response.json();
                if (response.ok) {
                    setAssets(Array.isArray(data) ? data : []);
                } else {
                    setError(data.error || "Failed to fetch assets");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch assets");
            } finally {
                setLoading(false);
            }
        };

        fetchAssets();
    }, [publicKey]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500">Loading assets...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4 text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-gray-100">Wallet Assets</h2>
                <p className="text-gray-400">Connected Wallet: {publicKey}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentAssets.map((asset) => (
                    <div key={asset.id} className="bg-[#374151] rounded-lg shadow-lg overflow-hidden transform transition-all duration-200 hover:shadow-2xl hover:scale-105">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-100">
                                    {asset.content.metadata.name || 'Unnamed Asset'}
                                </h3>
                                {asset.content.metadata.symbol && (
                                    <Badge variant="outline">
                                        {asset.content.metadata.symbol}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="p-4">
                            {asset.content.files[0]?.cdn_uri ? (
                                <div className="relative w-full h-48 mb-4">
                                    <img
                                        src={asset.content.files[0].cdn_uri}
                                        alt={asset.content.metadata.name || 'Asset Image'}
                                        className="w-full h-full object-cover rounded-md transition-transform duration-200 hover:scale-105"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-48 mb-4 bg-gray-300 rounded-md flex items-center justify-center">
                                    <span className="text-gray-500">No image available</span>
                                </div>
                            )}

                            {asset.content.metadata.description && (
                                <p className="text-sm text-gray-300 mb-2">
                                    {asset.content.metadata.description.slice(0, 60)}...
                                </p>
                            )}
                            <div className="flex flex-col text-sm text-gray-400 mb-4 space-y-1">
                                <div>
                                    <span className="font-medium text-gray-100">ID:</span> {asset.id}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-100">Royalty:</span> {(asset.royalty.percent * 100).toFixed(2)}%
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {asset.ownership.frozen && (
                                    <Badge variant="secondary">Frozen</Badge>
                                )}
                                {asset.ownership.burnt && (
                                    <Badge variant="destructive">Burnt</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <span className="px-4 py-2 mx-1 text-gray-200">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default WalletAssets;
