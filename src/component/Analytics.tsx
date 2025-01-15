import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import WalletDetail from "../component/WalletDetail";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function Analytics() {
    const tokens = useSelector((state: RootState) => state.wallet.tokenBalances);

    const filteredAccounts = React.useMemo(() => {
        if (!tokens || !Array.isArray(tokens)) return [];

        return tokens
            .filter(token => token && typeof token.pricePerToken === 'number' && token.pricePerToken > 0)
            .sort((a, b) => {
                const totalValueA = (a.balance / Math.pow(10, a.decimals)) * a.pricePerToken;
                const totalValueB = (b.balance / Math.pow(10, b.decimals)) * b.pricePerToken;
                return totalValueB - totalValueA;
            });
    }, [tokens]);

    // Calculate total portfolio value
    const totalValue = React.useMemo(() => {
        return filteredAccounts.reduce((sum, token) => {
            return sum + (token.balance / Math.pow(10, token.decimals)) * token.pricePerToken;
        }, 0);
    }, [filteredAccounts]);

    // Calculate percentages and prepare data
    const tokenData = React.useMemo(() => {
        return filteredAccounts.map(token => {
            const value = (token.balance / Math.pow(10, token.decimals)) * token.pricePerToken;
            const percentage = (value / totalValue * 100).toFixed(2);
            return {
                ...token,
                percentage,
                value
            };
        });
    }, [filteredAccounts, totalValue]);

    const chartData = {
        labels: tokenData.map(token => token.name),
        datasets: [{
            data: tokenData.map(token => token.percentage),
            backgroundColor: [
                '#9945FF', // Purple for main token
                '#14F195', // Green
                '#00C2FF', // Light blue
                '#FF9C32', // Orange
                '#FF7676', // Pink
                '#6CB6FF', // Sky blue
                '#FFD600', // Yellow
                '#00FFA3', // Mint
                '#DC1FFF'  // Bright purple
            ],
            borderWidth: 0,
            spacing: 2
        }]
    };

    const chartOptions = {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return ` ${context.label}: ${context.raw}%`;
                    }
                }
            }
        }
    };

    return (
        <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/4 bg-[#0D1421] text-white sm:h-screen sm:sticky top-0 overflow-y-auto scrollbar-hide p-4 sm:p-0 no-scrollbar">
                <WalletDetail />
            </div>
            <div className="flex-1 p-4 bg-[#151c2b] overflow-hidden sticky ">

                <div className="flex flex-col min-h-screen ">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-2xl font-bold mb-8 text-white">Coin Allocation</h1>

                        <div className=" rounded-xl p-6 max-w-4xl mx-auto">
                            {/* Chart Container */}
                            <div className="relative w-full max-w-2xl mx-auto aspect-square mb-12">
                                <Doughnut data={chartData} options={chartOptions} />
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
                                    <div className="text-4xl font-bold">${totalValue.toLocaleString(undefined, {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 1
                                    })}</div>
                                </div>
                            </div>

                            {/* Token List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4  ">
                                {tokenData.map((token, index) => (
                                    <div key={token.account} className="flex items-center justify-between bg-[#0D1421] p-6 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {token.imageUrl ? (
                                                <img src={token.imageUrl} alt={token.name} className="w-8 h-8 rounded-full" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-700" />
                                            )}
                                            <span className="font-medium text-white">{token.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-white">{token.percentage}%</span>
                                            <div className="w-3 h-3 rounded-sm" style={{
                                                backgroundColor: chartData.datasets[0].backgroundColor[index]
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Analytics;