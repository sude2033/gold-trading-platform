import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { formatCurrency, formatDateTime, formatWeight } from '../utils/formatting';
import styles from './HistoryPage.module.css';

const HistoryPage = () => {
    const { transactions } = usePortfolio();
    const [filter, setFilter] = useState('all'); // 'all', 'buy', 'sell'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

    const filteredTransactions = useMemo(() => {
        let filtered = [...transactions];

        // Apply filter
        if (filter !== 'all') {
            filtered = filtered.filter((txn) => txn.type === filter);
        }

        // Apply sort
        filtered.sort((a, b) => {
            const dateA = new Date(a.timestamp);
            const dateB = new Date(b.timestamp);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    }, [transactions, filter, sortOrder]);

    const stats = useMemo(() => {
        const buyTransactions = transactions.filter((t) => t.type === 'buy');
        const sellTransactions = transactions.filter((t) => t.type === 'sell');

        const totalBought = buyTransactions.reduce((sum, t) => sum + t.total, 0);
        const totalSold = sellTransactions.reduce((sum, t) => sum + t.total, 0);

        return {
            totalTransactions: transactions.length,
            buyCount: buyTransactions.length,
            sellCount: sellTransactions.length,
            totalBought,
            totalSold
        };
    }, [transactions]);

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-8)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-6)' }}>Transaction History</h1>

            <div className={styles['stats-grid']}>
                <div className={styles['stat-card']}>
                    <span className={styles['stat-label']}>Total Transactions</span>
                    <span className={styles['stat-value']}>{stats.totalTransactions}</span>
                </div>
                <div className={styles['stat-card']}>
                    <span className={styles['stat-label']}>Buy Orders</span>
                    <span className={`${styles['stat-value']} ${styles['success']}`}>{stats.buyCount}</span>
                </div>
                <div className={styles['stat-card']}>
                    <span className={styles['stat-label']}>Sell Orders</span>
                    <span className={`${styles['stat-value']} ${styles['error']}`}>{stats.sellCount}</span>
                </div>
                <div className={styles['stat-card']}>
                    <span className={styles['stat-label']}>Total Bought</span>
                    <span className={styles['stat-value']}>{formatCurrency(stats.totalBought)}</span>
                </div>
                <div className={styles['stat-card']}>
                    <span className={styles['stat-label']}>Total Sold</span>
                    <span className={styles['stat-value']}>{formatCurrency(stats.totalSold)}</span>
                </div>
            </div>

            <div className={styles['history-section']}>
                <div className={styles['history-header']}>
                    <h2>All Transactions</h2>
                    <div className={styles['controls']}>
                        <div className={styles['filter-buttons']}>
                            <button
                                className={filter === 'all' ? styles['active'] : ''}
                                onClick={() => setFilter('all')}
                            >
                                All
                            </button>
                            <button
                                className={filter === 'buy' ? styles['active'] : ''}
                                onClick={() => setFilter('buy')}
                            >
                                Buy
                            </button>
                            <button
                                className={filter === 'sell' ? styles['active'] : ''}
                                onClick={() => setFilter('sell')}
                            >
                                Sell
                            </button>
                        </div>
                        <button
                            className={styles['sort-button']}
                            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                        >
                            {sortOrder === 'desc' ? '↓ Newest First' : '↑ Oldest First'}
                        </button>
                    </div>
                </div>

                {filteredTransactions.length === 0 ? (
                    <div className={styles['empty-state']}>
                        <div className={styles['empty-icon']}>📝</div>
                        <h3>No Transactions Yet</h3>
                        <p>Your transaction history will appear here</p>
                    </div>
                ) : (
                    <div className={styles['table-container']}>
                        <table className={styles['history-table']}>
                            <thead>
                                <tr>
                                    <th>Date & Time</th>
                                    <th>Type</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price/gram</th>
                                    <th>Subtotal</th>
                                    <th>Fees</th>
                                    <th>GST</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((txn) => (
                                    <tr key={txn.id}>
                                        <td className={styles['timestamp']}>{formatDateTime(txn.timestamp)}</td>
                                        <td>
                                            <span className={`badge ${txn.type === 'buy' ? 'badge-success' : 'badge-error'}`}>
                                                {txn.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className={styles['product-name']}>
                                            {txn.product.name} ({txn.product.purity}K)
                                        </td>
                                        <td>{formatWeight(txn.quantity)}</td>
                                        <td>{formatCurrency(txn.pricePerGram)}</td>
                                        <td>{formatCurrency(txn.subtotal)}</td>
                                        <td>{formatCurrency(txn.processingFee)}</td>
                                        <td>{formatCurrency(txn.gst)}</td>
                                        <td className={styles['total']}>{formatCurrency(txn.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
