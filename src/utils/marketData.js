import { getRealTimeGoldPrices } from './goldPriceAPI';

// Mock gold products with different purities
export const GOLD_PRODUCTS = [
    {
        id: 'gold-24k',
        name: '24K Gold',
        purity: 24,
        description: '99.9% pure gold',
        basePrice: 6500 // Base price per gram in INR (fallback)
    },
    {
        id: 'gold-22k',
        name: '22K Gold',
        purity: 22,
        description: '91.6% pure gold',
        basePrice: 5950 // Base price per gram in INR (fallback)
    },
    {
        id: 'gold-18k',
        name: '18K Gold',
        purity: 18,
        description: '75% pure gold',
        basePrice: 4875 // Base price per gram in INR (fallback)
    }
];

// Generate realistic price fluctuations
const generatePriceFluctuation = () => {
    // Random fluctuation between -2% to +2%
    return (Math.random() - 0.5) * 0.04;
};

// Generate price history for a product
export const generatePriceHistory = (basePrice, days = 30) => {
    const history = [];
    const now = new Date();
    let currentPrice = basePrice;

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Apply random fluctuation
        const fluctuation = generatePriceFluctuation();
        currentPrice = currentPrice * (1 + fluctuation);

        // Keep price within reasonable bounds (±15% of base)
        const minPrice = basePrice * 0.85;
        const maxPrice = basePrice * 1.15;
        currentPrice = Math.max(minPrice, Math.min(maxPrice, currentPrice));

        history.push({
            date: date.toISOString(),
            price: Math.round(currentPrice * 100) / 100
        });
    }

    return history;
};

// Initialize market data with price history
export const initializeMarketData = () => {
    return GOLD_PRODUCTS.map(product => ({
        ...product,
        currentPrice: product.basePrice,
        priceHistory: generatePriceHistory(product.basePrice, 90), // 90 days of history
        lastUpdated: new Date().toISOString(),
        priceChange24h: 0,
        priceChangePercent24h: 0,
        dataSource: 'Simulated'
    }));
};

// Simulate real-time price update with real API integration
export const updateMarketPrices = async (products) => {
    // Try to fetch real-time prices from API
    let realPrices = null;
    try {
        realPrices = await getRealTimeGoldPrices();
    } catch (error) {
        console.warn('Failed to fetch real-time prices, using simulated data:', error);
    }

    return products.map(product => {
        const oldPrice = product.currentPrice;
        let newPrice;
        let dataSource = 'Simulated';

        // Use real API data if available, otherwise simulate
        if (realPrices) {
            // Map product purity to API data
            const apiPriceKey = `gold${product.purity}k`;
            if (realPrices[apiPriceKey]) {
                // Convert USD to INR (approximate rate: 1 USD = 83 INR)
                newPrice = realPrices[apiPriceKey] * 83;
                newPrice = Math.round(newPrice * 100) / 100;
                dataSource = 'Real-Time API';
            } else {
                // Fallback to simulation if specific purity not available
                const fluctuation = generatePriceFluctuation();
                newPrice = oldPrice * (1 + fluctuation);
            }
        } else {
            // Fallback to simulation if API fails
            const fluctuation = generatePriceFluctuation();
            newPrice = oldPrice * (1 + fluctuation);
        }

        // Keep price within reasonable bounds
        const minPrice = product.basePrice * 0.85;
        const maxPrice = product.basePrice * 1.15;
        newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice));
        newPrice = Math.round(newPrice * 100) / 100;

        const priceChange = newPrice - oldPrice;
        const priceChangePercent = ((newPrice - oldPrice) / oldPrice) * 100;

        // Update price history (add new entry, keep last 90 days)
        const newHistory = [
            ...product.priceHistory.slice(-89),
            {
                date: new Date().toISOString(),
                price: newPrice
            }
        ];

        return {
            ...product,
            currentPrice: newPrice,
            priceHistory: newHistory,
            lastUpdated: new Date().toISOString(),
            priceChange24h: priceChange,
            priceChangePercent24h: priceChangePercent,
            dataSource
        };
    });
};

// Get product by ID
export const getProductById = (products, productId) => {
    return products.find(p => p.id === productId);
};

// Calculate transaction fees and taxes
export const calculateTransactionCosts = (subtotal, type = 'buy') => {
    const processingFee = subtotal * 0.02; // 2% processing fee
    const gstRate = 0.03; // 3% GST

    let gst, total;

    if (type === 'buy') {
        // For buying: GST on subtotal + fee
        gst = (subtotal + processingFee) * gstRate;
        total = subtotal + processingFee + gst;
    } else {
        // For selling: GST on subtotal - fee
        gst = (subtotal - processingFee) * gstRate;
        total = subtotal - processingFee - gst;
    }

    return {
        subtotal: Math.round(subtotal * 100) / 100,
        processingFee: Math.round(processingFee * 100) / 100,
        gst: Math.round(gst * 100) / 100,
        total: Math.round(total * 100) / 100
    };
};
