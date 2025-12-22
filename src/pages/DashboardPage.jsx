import React, { useState, useMemo } from 'react';
import { useMarket } from '../contexts/MarketContext';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useNotification } from '../hooks/useNotification';
import { useTransactionCalculation } from '../hooks/useTransactionCalculation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatPercentage, formatDate } from '../utils/formatting';
import Modal from '../components/ui/Modal';
import styles from './DashboardPage.module.css';

const PriceTicker = React.memo(({ products }) => {
    return (
        <div className={styles['price-ticker']}>
            <h2>Live Gold Prices</h2>
            <div className={styles['ticker-grid']}>
                {products.map((product) => (
                    <div key={product.id} className={styles['ticker-card']}>
                        <div className={styles['ticker-header']}>
                            <h3>{product.name}</h3>
                            <span className={styles['ticker-purity']}>{product.purity}K</span>
                        </div>
                        <div className={styles['ticker-price']}>
                            {formatCurrency(product.currentPrice)}
                            <span className={styles['ticker-unit']}>/gram</span>
                        </div>
                        <div
                            className={`${styles['ticker-change']} ${product.priceChangePercent24h >= 0 ? styles['positive'] : styles['negative']
                                }`}
                        >
                            {product.priceChangePercent24h >= 0 ? '↑' : '↓'}{' '}
                            {formatPercentage(Math.abs(product.priceChangePercent24h))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

const PriceChart = React.memo(({ products }) => {
    const [selectedProduct, setSelectedProduct] = useState(products[0]?.id);
    const [timePeriod, setTimePeriod] = useState(30);

    const chartData = useMemo(() => {
        const product = products.find((p) => p.id === selectedProduct);
        if (!product) return [];

        return product.priceHistory.slice(-timePeriod).map((entry) => ({
            date: formatDate(entry.date, 'MMM dd'),
            price: entry.price
        }));
    }, [products, selectedProduct, timePeriod]);

    return (
        <div className={styles['chart-container']}>
            <div className={styles['chart-header']}>
                <h2>Price History</h2>
                <div className={styles['chart-controls']}>
                    <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className={styles['chart-select']}
                    >
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                    <div className={styles['period-buttons']}>
                        <button
                            className={timePeriod === 7 ? styles['active'] : ''}
                            onClick={() => setTimePeriod(7)}
                        >
                            7D
                        </button>
                        <button
                            className={timePeriod === 30 ? styles['active'] : ''}
                            onClick={() => setTimePeriod(30)}
                        >
                            30D
                        </button>
                        <button
                            className={timePeriod === 90 ? styles['active'] : ''}
                            onClick={() => setTimePeriod(90)}
                        >
                            90D
                        </button>
                    </div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value) => [formatCurrency(value), 'Price']}
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#F59E0B"
                        strokeWidth={3}
                        dot={false}
                        fill="url(#colorPrice)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
});

const TransactionPanel = () => {
    const [activeTab, setActiveTab] = useState('buy');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [pendingTransaction, setPendingTransaction] = useState(null);

    const { products, getProduct } = useMarket();
    const { buyGold, sellGold, holdings } = usePortfolio();
    const { success, error } = useNotification();

    const product = selectedProduct ? getProduct(selectedProduct) : null;
    const calculation = useTransactionCalculation(
        parseFloat(quantity) || 0,
        product?.currentPrice || 0,
        activeTab
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedProduct || !quantity || parseFloat(quantity) <= 0) {
            error('Please select a product and enter a valid quantity');
            return;
        }

        setPendingTransaction({
            productId: selectedProduct,
            quantity: parseFloat(quantity),
            type: activeTab
        });
        setShowConfirmation(true);
    };

    const confirmTransaction = () => {
        const result =
            pendingTransaction.type === 'buy'
                ? buyGold(pendingTransaction.productId, pendingTransaction.quantity)
                : sellGold(pendingTransaction.productId, pendingTransaction.quantity);

        if (result.success) {
            success(
                `Successfully ${pendingTransaction.type === 'buy' ? 'purchased' : 'sold'} ${pendingTransaction.quantity
                }g of ${product.name}`
            );
            setSelectedProduct('');
            setQuantity('');
            setShowConfirmation(false);
            setPendingTransaction(null);
        } else {
            error(result.error);
            setShowConfirmation(false);
        }
    };

    const availableProducts = activeTab === 'sell' ? holdings : products;

    return (
        <div className={styles['transaction-panel']}>
            <div className={styles['transaction-tabs']}>
                <button
                    className={`${styles['tab']} ${activeTab === 'buy' ? styles['active'] : ''}`}
                    onClick={() => {
                        setActiveTab('buy');
                        setSelectedProduct('');
                        setQuantity('');
                    }}
                >
                    Buy Gold
                </button>
                <button
                    className={`${styles['tab']} ${activeTab === 'sell' ? styles['active'] : ''}`}
                    onClick={() => {
                        setActiveTab('sell');
                        setSelectedProduct('');
                        setQuantity('');
                    }}
                >
                    Sell Gold
                </button>
            </div>

            <form onSubmit={handleSubmit} className={styles['transaction-form']}>
                <div className={styles['form-group']}>
                    <label htmlFor="product">
                        {activeTab === 'buy' ? 'Select Product' : 'Select Holding'}
                    </label>
                    <select
                        id="product"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        required
                    >
                        <option value="">-- Select --</option>
                        {activeTab === 'buy'
                            ? products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} ({p.purity}K) - {formatCurrency(p.currentPrice)}/g
                                </option>
                            ))
                            : holdings.map((h) => (
                                <option key={h.productId} value={h.productId}>
                                    {h.productName} ({h.purity}K) - Available: {h.quantity}g
                                </option>
                            ))}
                    </select>
                </div>

                <div className={styles['form-group']}>
                    <label htmlFor="quantity">Quantity (grams)</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="0.01"
                        step="0.01"
                        placeholder="Enter quantity"
                        required
                    />
                </div>

                {calculation.isValid && (
                    <div className={styles['calculation-summary']}>
                        <div className={styles['calc-row']}>
                            <span>Subtotal:</span>
                            <span>{formatCurrency(calculation.subtotal)}</span>
                        </div>
                        <div className={styles['calc-row']}>
                            <span>Processing Fee (2%):</span>
                            <span>{formatCurrency(calculation.processingFee)}</span>
                        </div>
                        <div className={styles['calc-row']}>
                            <span>GST (3%):</span>
                            <span>{formatCurrency(calculation.gst)}</span>
                        </div>
                        <div className={`${styles['calc-row']} ${styles['total']}`}>
                            <span>{activeTab === 'buy' ? 'Total Amount:' : 'Net Proceeds:'}</span>
                            <span className={styles['total-amount']}>{formatCurrency(calculation.total)}</span>
                        </div>
                    </div>
                )}

                <button type="submit" className={`btn ${activeTab === 'buy' ? 'btn-success' : 'btn-error'} btn-lg`} style={{ width: '100%' }}>
                    {activeTab === 'buy' ? 'Buy Now' : 'Sell Now'}
                </button>
            </form>

            <Modal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                title="Confirm Transaction"
                footer={
                    <>
                        <button className="btn btn-outline" onClick={() => setShowConfirmation(false)}>
                            Cancel
                        </button>
                        <button
                            className={`btn ${activeTab === 'buy' ? 'btn-success' : 'btn-error'}`}
                            onClick={confirmTransaction}
                        >
                            Confirm {activeTab === 'buy' ? 'Purchase' : 'Sale'}
                        </button>
                    </>
                }
            >
                {pendingTransaction && product && (
                    <div>
                        <p>
                            You are about to {activeTab} <strong>{pendingTransaction.quantity}g</strong> of{' '}
                            <strong>{product.name}</strong> at{' '}
                            <strong>{formatCurrency(product.currentPrice)}/g</strong>.
                        </p>
                        <div className={styles['confirmation-details']}>
                            <p>
                                <strong>
                                    {activeTab === 'buy' ? 'Total Amount:' : 'Net Proceeds:'}
                                </strong>{' '}
                                {formatCurrency(calculation.total)}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

const PortfolioOverview = () => {
    const { portfolioMetrics } = usePortfolio();

    return (
        <div className={styles['portfolio-overview']}>
            <h2>Portfolio Overview</h2>
            <div className={styles['metrics-grid']}>
                <div className={styles['metric-card']}>
                    <span className={styles['metric-label']}>Total Value</span>
                    <span className={styles['metric-value']}>
                        {formatCurrency(portfolioMetrics.totalValue)}
                    </span>
                </div>
                <div className={styles['metric-card']}>
                    <span className={styles['metric-label']}>Total Invested</span>
                    <span className={styles['metric-value']}>
                        {formatCurrency(portfolioMetrics.totalInvested)}
                    </span>
                </div>
                <div className={styles['metric-card']}>
                    <span className={styles['metric-label']}>Profit/Loss</span>
                    <span
                        className={`${styles['metric-value']} ${portfolioMetrics.totalProfitLoss >= 0 ? styles['positive'] : styles['negative']
                            }`}
                    >
                        {formatCurrency(portfolioMetrics.totalProfitLoss)}
                        <span className={styles['metric-percent']}>
                            ({formatPercentage(portfolioMetrics.totalProfitLossPercent)})
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const { products } = useMarket();

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-8)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-6)' }}>Trading Dashboard</h1>

            <PriceTicker products={products} />

            <div className={styles['dashboard-grid']}>
                <div className={styles['chart-section']}>
                    <PriceChart products={products} />
                </div>
                <div className={styles['transaction-section']}>
                    <TransactionPanel />
                </div>
            </div>

            <PortfolioOverview />
        </div>
    );
};

export default DashboardPage;
