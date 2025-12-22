import { useMemo } from 'react';
import { calculateTransactionCosts } from '../utils/marketData';

export const useTransactionCalculation = (quantity, pricePerGram, type = 'buy') => {
    const calculation = useMemo(() => {
        if (!quantity || !pricePerGram || quantity <= 0 || pricePerGram <= 0) {
            return {
                subtotal: 0,
                processingFee: 0,
                gst: 0,
                total: 0,
                isValid: false
            };
        }

        const subtotal = quantity * pricePerGram;
        const costs = calculateTransactionCosts(subtotal, type);

        return {
            ...costs,
            quantity,
            pricePerGram,
            isValid: true
        };
    }, [quantity, pricePerGram, type]);

    return calculation;
};
