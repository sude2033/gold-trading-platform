import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';
import { useMarket } from './MarketContext';
import { calculateTransactionCosts } from '../utils/marketData';

const PortfolioContext = createContext(null);

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error('usePortfolio must be used within a PortfolioProvider');
    }
    return context;
};

export const PortfolioProvider = ({ children }) => {
    const { user } = useAuth();
    const { products, getProduct } = useMarket();
    const [portfolios, setPortfolios] = useLocalStorage('gold-trading-portfolios', {});

    // Get current user's portfolio
    const userPortfolio = useMemo(() => {
        if (!user) return { holdings: [], transactions: [] };
        return portfolios[user.id] || { holdings: [], transactions: [] };
    }, [user, portfolios]);

    // Calculate portfolio value and metrics
    const portfolioMetrics = useMemo(() => {
        if (!user || !userPortfolio.holdings.length) {
            return {
                totalValue: 0,
                totalInvested: 0,
                totalProfitLoss: 0,
                totalProfitLossPercent: 0
            };
        }

        let totalValue = 0;
        let totalInvested = 0;

        userPortfolio.holdings.forEach(holding => {
            const product = getProduct(holding.productId);
            if (product) {
                const currentValue = holding.quantity * product.currentPrice;
                const investedValue = holding.quantity * holding.averageBuyPrice;

                totalValue += currentValue;
                totalInvested += investedValue;
            }
        });

        const totalProfitLoss = totalValue - totalInvested;
        const totalProfitLossPercent = totalInvested > 0
            ? (totalProfitLoss / totalInvested) * 100
            : 0;

        return {
            totalValue: Math.round(totalValue * 100) / 100,
            totalInvested: Math.round(totalInvested * 100) / 100,
            totalProfitLoss: Math.round(totalProfitLoss * 100) / 100,
            totalProfitLossPercent: Math.round(totalProfitLossPercent * 100) / 100
        };
    }, [user, userPortfolio.holdings, products, getProduct]);

    // Get holdings with current values
    const holdings = useMemo(() => {
        if (!user || !userPortfolio.holdings.length) return [];

        return userPortfolio.holdings.map(holding => {
            const product = getProduct(holding.productId);
            if (!product) return null;

            const currentValue = holding.quantity * product.currentPrice;
            const investedValue = holding.quantity * holding.averageBuyPrice;
            const profitLoss = currentValue - investedValue;
            const profitLossPercent = investedValue > 0
                ? (profitLoss / investedValue) * 100
                : 0;

            return {
                ...holding,
                productName: product.name,
                purity: product.purity,
                currentPrice: product.currentPrice,
                currentValue: Math.round(currentValue * 100) / 100,
                profitLoss: Math.round(profitLoss * 100) / 100,
                profitLossPercent: Math.round(profitLossPercent * 100) / 100
            };
        }).filter(Boolean);
    }, [user, userPortfolio.holdings, products, getProduct]);

    // Buy gold
    const buyGold = useCallback((productId, quantity) => {
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        const product = getProduct(productId);
        if (!product) {
            return { success: false, error: 'Product not found' };
        }

        if (quantity <= 0) {
            return { success: false, error: 'Quantity must be greater than 0' };
        }

        // Calculate costs
        const subtotal = quantity * product.currentPrice;
        const costs = calculateTransactionCosts(subtotal, 'buy');

        // Create transaction
        const transaction = {
            id: `txn-${Date.now()}`,
            type: 'buy',
            product: {
                id: product.id,
                name: product.name,
                purity: product.purity
            },
            quantity,
            pricePerGram: product.currentPrice,
            ...costs,
            timestamp: new Date().toISOString()
        };

        // Update holdings
        const currentHoldings = userPortfolio.holdings || [];
        const existingHoldingIndex = currentHoldings.findIndex(h => h.productId === productId);

        let newHoldings;
        if (existingHoldingIndex >= 0) {
            // Update existing holding
            const existingHolding = currentHoldings[existingHoldingIndex];
            const totalQuantity = existingHolding.quantity + quantity;
            const totalCost = (existingHolding.quantity * existingHolding.averageBuyPrice) +
                (quantity * product.currentPrice);
            const newAverageBuyPrice = totalCost / totalQuantity;

            newHoldings = [...currentHoldings];
            newHoldings[existingHoldingIndex] = {
                ...existingHolding,
                quantity: totalQuantity,
                averageBuyPrice: Math.round(newAverageBuyPrice * 100) / 100
            };
        } else {
            // Create new holding
            newHoldings = [
                ...currentHoldings,
                {
                    productId: product.id,
                    quantity,
                    averageBuyPrice: product.currentPrice,
                    purchaseDate: new Date().toISOString()
                }
            ];
        }

        // Update portfolio
        const newPortfolio = {
            holdings: newHoldings,
            transactions: [...(userPortfolio.transactions || []), transaction]
        };

        setPortfolios({
            ...portfolios,
            [user.id]: newPortfolio
        });

        return { success: true, transaction };
    }, [user, getProduct, userPortfolio, portfolios, setPortfolios]);

    // Sell gold
    const sellGold = useCallback((productId, quantity) => {
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        const product = getProduct(productId);
        if (!product) {
            return { success: false, error: 'Product not found' };
        }

        if (quantity <= 0) {
            return { success: false, error: 'Quantity must be greater than 0' };
        }

        // Check if user has enough holdings
        const holding = userPortfolio.holdings.find(h => h.productId === productId);
        if (!holding || holding.quantity < quantity) {
            return { success: false, error: 'Insufficient holdings' };
        }

        // Calculate costs
        const subtotal = quantity * product.currentPrice;
        const costs = calculateTransactionCosts(subtotal, 'sell');

        // Create transaction
        const transaction = {
            id: `txn-${Date.now()}`,
            type: 'sell',
            product: {
                id: product.id,
                name: product.name,
                purity: product.purity
            },
            quantity,
            pricePerGram: product.currentPrice,
            ...costs,
            timestamp: new Date().toISOString()
        };

        // Update holdings
        const newHoldings = userPortfolio.holdings
            .map(h => {
                if (h.productId === productId) {
                    const newQuantity = h.quantity - quantity;
                    if (newQuantity <= 0) return null; // Remove holding if quantity is 0
                    return { ...h, quantity: newQuantity };
                }
                return h;
            })
            .filter(Boolean);

        // Update portfolio
        const newPortfolio = {
            holdings: newHoldings,
            transactions: [...(userPortfolio.transactions || []), transaction]
        };

        setPortfolios({
            ...portfolios,
            [user.id]: newPortfolio
        });

        return { success: true, transaction };
    }, [user, getProduct, userPortfolio, portfolios, setPortfolios]);

    const value = {
        holdings,
        transactions: userPortfolio.transactions || [],
        portfolioMetrics,
        buyGold,
        sellGold
    };

    return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};
