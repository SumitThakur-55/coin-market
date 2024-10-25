import React, { useEffect, useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    Filler,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    annotationPlugin
);

// Define your props and data types
interface CoinChartProps {
    coinId: string;
    currentPrice: number;
}

interface ChartData {
    prices: [number, number][];
    market_caps: [number, number][];
    total_volumes: [number, number][];
}

type ChartType = 'price' | 'market_cap' | 'volume';

const CoinChart: React.FC<CoinChartProps> = ({ coinId, currentPrice }) => {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [chartType, setChartType] = useState<ChartType>('price');

    const getChartData = useMemo(() => {
        if (!chartData) return [];
        switch (chartType) {
            case 'price':
                return chartData.prices;
            case 'market_cap':
                return chartData.market_caps;
            case 'volume':
                return chartData.total_volumes;
            default:
                return chartData.prices;
        }
    }, [chartData, chartType]);

    const prepareChartData = useMemo(() => {
        if (!chartData) return null;

        const data = getChartData;
        const labels = data.map(([timestamp]) => new Date(timestamp).toLocaleDateString());
        const values = data.map(([, value]) => value);

        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const range = maxValue - minValue;

        return {
            labels,
            datasets: [{
                label: `${chartType.replace('_', ' ').charAt(0).toUpperCase() + chartType.replace('_', ' ').slice(1)} (USD)`,
                data: values,
                borderColor: (context: any) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return '#10B981'; // Default to green

                    const normalizedCurrentPrice = Math.max(0, Math.min(1, (currentPrice - minValue) / range));

                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, '#EF4444'); // Red
                    gradient.addColorStop(normalizedCurrentPrice, '#EF4444'); // Red
                    gradient.addColorStop(normalizedCurrentPrice, '#10B981'); // Green
                    gradient.addColorStop(1, '#10B981'); // Green

                    return gradient;
                },
                backgroundColor: (context: any) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return 'rgba(16, 185, 129, 0.1)'; // Default to light green

                    const normalizedCurrentPrice = Math.max(0, Math.min(1, (currentPrice - minValue) / range));

                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.1)'); // Light red
                    gradient.addColorStop(normalizedCurrentPrice, 'rgba(239, 68, 68, 0.1)'); // Light red
                    gradient.addColorStop(normalizedCurrentPrice, 'rgba(16, 185, 129, 0.1)'); // Light green
                    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.1)'); // Light green

                    return gradient;
                },
                borderWidth: 2,
                pointRadius: 0,
                fill: {
                    target: {
                        value: currentPrice,
                    },
                    above: 'rgba(16, 185, 129, 0.1)', // Light green for area above the current price
                    below: 'rgba(239, 68, 68, 0.1)',  // Light red for area below the current price
                },
            }],
        };
    }, [chartData, chartType, getChartData, currentPrice]);

    useEffect(() => {
        const fetchChartData = async () => {
            const url = `https://coin-market-backend-production.up.railway.app/api/coin-chart/${coinId}`; // Replace :id with the actual coinId
            console.log('Fetching chart data from:', url);
            setLoading(true); // Start loading state

            try {
                const response = await axios.get<ChartData>(url); // Specify expected response type
                console.log('Chart data response status:', response.status);
                setChartData(response.data);
            } catch (err) {
                console.error('Error fetching chart data:', err);
                if (axios.isAxiosError(err) && err.response) {
                    setError(err.response.data.error || 'Error fetching chart data');
                } else {
                    setError('Error fetching chart data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [coinId]);

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#1F2937',
                titleColor: '#F3F4F6',
                bodyColor: '#D1D5DB',
                borderColor: '#4B5563',
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 8 }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: currentPrice,
                        yMax: currentPrice,
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        borderWidth: 1,
                        borderDash: [5, 5],
                        label: {
                            display: false
                        }
                    }
                }
            }
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#6B7280',
                    maxTicksLimit: 6,
                    font: {
                        size: 14,
                    },
                },
            },
            y: {
                display: true,
                position: 'right',
                grid: {
                    color: 'rgba(107, 114, 128, 0.1)',
                    drawOnChartArea: true,
                },
                ticks: {
                    color: '#6B7280',
                    callback: function (value) {
                        return '$' + value.toLocaleString();
                    },
                    font: {
                        size: 14,
                    },
                    padding: 8,
                },
            },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    if (loading) return <div className="mt-8 bg-[#1E2633] rounded-xl border-2 border-gray-500 p-4 m-2 mx-4">Loading chart...</div>;
    if (error) return <div className="mt-8 bg-[#1E2633] rounded-xl border-2 border-gray-500 p-4 m-2 mx-4">Error: {error}</div>;
    if (!chartData) return <div className="mt-8 bg-[#1E2633] rounded-xl border-2 border-gray-500 p-4 m-2 mx-4">No chart data available</div>;


    if (loading) return <div className="mt-8 bg-[#1E2633] rounded-xl border-2 border-gray-500 p-4 m-2 mx-4">Loading chart...</div>;
    if (error) return <div className="mt-8 bg-[#1E2633] rounded-xl border-2 border-gray-500 p-4 m-2 mx-4">Error: {error}</div>;
    if (!chartData) return <div className="mt-8 bg-[#1E2633] rounded-xl border-2 border-gray-500 p-4 m-2 mx-4">No chart data available</div>;

    return (
        <div>
            <h2 className="m-2 text-3xl font-bold text-white mb-4 ">{coinId.charAt(0).toUpperCase() + coinId.slice(1)} Price Chart</h2>
            <div className="my-8  bg-[#0D1421] rounded-xl border-2 border-gray-500 p-4 m-2 mx-4">

                <div className="flex justify-between items-center mb-4">
                    <div className="flex justify-start space-x-2">
                        <button
                            className={`px-3 py-1 rounded ${chartType === 'price' ? 'bg-gray-300 text-gray-700' : 'bg-[#151c2b] border-2 border-gray-500 text-white'}`}
                            onClick={() => setChartType('price')}
                        >
                            Price
                        </button>
                        <button
                            className={`px-3 py-1 rounded ${chartType === 'market_cap' ? 'bg-gray-300 text-gray-700' : 'bg-[#151c2b] border-2 border-gray-500 text-white'}`}
                            onClick={() => setChartType('market_cap')}
                        >
                            Market Cap
                        </button>
                        <button
                            className={`px-3 py-1 rounded ${chartType === 'volume' ? 'bg-gray-300 text-gray-700' : 'bg-[#151c2b] border-2 border-gray-500 text-white'}`}
                            onClick={() => setChartType('volume')}
                        >
                            Volume
                        </button>
                    </div>
                    <div className="text-white">
                        Current Price: ${currentPrice.toLocaleString()}
                    </div>
                </div>
                <div style={{ height: '400px' }}> {/* Set a fixed height for the chart container */}
                    {prepareChartData && (
                        <Line
                            options={chartOptions}
                            data={prepareChartData}
                            key={`${coinId}-${chartType}`} // Add this line
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoinChart;
