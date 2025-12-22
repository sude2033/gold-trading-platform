import React from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { formatCurrency, formatPercentage, formatWeight } from '../utils/formatting';
import styles from './PortfolioPage.module.css';

const PortfolioPage = () => {
    const { holdings, portfolioMetrics } = usePortfolio();

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-8)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-6)' }}>My Portfolio</h1>

            <div className={styles['summary-cards']}>
                <div className={`${styles['summary-card']} ${styles['primary']}`}>
                    <div className={styles['card-icon']}>💰</div>
                    <div className={styles['card-content']}>
                        <span className={styles['card-label']}>Total Portfolio Value</span>
                        <span className={styles['card-value']}>
                            {formatCurrency(portfolioMetrics.totalValue)}
                        </span>
                    </div>
                </div>

                <div className={`${styles['summary-card']} ${styles['secondary']}`}>
                    <div className={styles['card-icon']}>📊</div>
                    <div className={styles['card-content']}>
                        <span className={styles['card-label']}>Total Invested</span>
                        <span className={styles['card-value']}>
                            {formatCurrency(portfolioMetrics.totalInvested)}
                        </span>
                    </div>
                </div>

                <div
                    className={`${styles['summary-card']} ${portfolioMetrics.totalProfitLoss >= 0 ? styles['success'] : styles['error']
                        }`}
                >
                    <div className={styles['card-icon']}>
                        {portfolioMetrics.totalProfitLoss >= 0 ? '📈' : '📉'}
                    </div>
                    <div className={styles['card-content']}>
                        <span className={styles['card-label']}>Total Profit/Loss</span>
                        <span className={styles['card-value']}>
                            {formatCurrency(portfolioMetrics.totalProfitLoss)}
                            <span className={styles['card-percent']}>
                                ({formatPercentage(portfolioMetrics.totalProfitLossPercent)})
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles['holdings-section']}>
                <h2>My Holdings</h2>
                {holdings.length === 0 ? (
                    <div className={styles['empty-state']}>
                        <div className={styles['empty-icon']}>📦</div>
                        <h3>No Holdings Yet</h3>
                        <p>Start trading to build your gold portfolio</p>
                    </div>
                ) : (
                    <div className={styles['table-container']}>
                        <table className={styles['holdings-table']}>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Purity</th>
                                    <th>Quantity</th>
                                    <th>Avg. Buy Price</th>
                                    <th>Current Price</th>
                                    <th>Current Value</th>
                                    <th>Profit/Loss</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holdings.map((holding) => (
                                    <tr key={holding.productId}>
                                        <td className={styles['product-name']}>{holding.productName}</td>
                                        <td>
                                            <span className="badge badge-gold">{holding.purity}K</span>
                                        </td>
                                        <td>{formatWeight(holding.quantity)}</td>
                                        <td>{formatCurrency(holding.averageBuyPrice)}</td>
                                        <td>{formatCurrency(holding.currentPrice)}</td>
                                        <td className={styles['highlight']}>{formatCurrency(holding.currentValue)}</td>
                                        <td>
                                            <div
                                                className={`${styles['profit-loss']} ${holding.profitLoss >= 0 ? styles['positive'] : styles['negative']
                                                    }`}
                                            >
                                                <div>{formatCurrency(holding.profitLoss)}</div>
                                                <div className={styles['percent']}>
                                                    ({formatPercentage(holding.profitLossPercent)})
                                                </div>
                                            </div>
                                        </td>
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

export default PortfolioPage;
