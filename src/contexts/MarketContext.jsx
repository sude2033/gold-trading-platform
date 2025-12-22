import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initializeMarketData, updateMarketPrices, getProductById } from '../utils/marketData';

const MarketContext = createContext(null);

export const useMarket = () => {
    const context = useContext(MarketContext);
    if (!context) {
        throw new Error('useMarket must be used within a MarketProvider');
    }
    return context;
};

export const MarketProvider = ({ children }) => {
    const [products, setProducts] = useState(() => initializeMarketData());
    const [isUpdating, setIsUpdating] = useState(false);

    // Simulate real-time price updates every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsUpdating(true);
            setProducts(prevProducts => {
                const updated = updateMarketPrices(prevProducts);
                setIsUpdating(false);
                return updated;
            });
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    // Get product by ID
    const getProduct = useCallback((productId) => {
        return getProductById(products, productId);
    }, [products]);

    // Get price history for a specific time period
    const getPriceHistory = useCallback((productId, days = 30) => {
        const product = getProductById(products, productId);
        if (!product) return [];

        return product.priceHistory.slice(-days);
    }, [products]);

    const value = {
        products,
        isUpdating,
        getProduct,
        getPriceHistory
    };

    return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
};
