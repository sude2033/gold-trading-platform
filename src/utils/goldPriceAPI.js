// API Configuration
const METALS_API_KEY = import.meta.env.VITE_METALS_API_KEY || 'demo'; // Users can add their own key
const METALS_API_BASE_URL = 'https://api.metals.live/v1/spot';

// Fallback to mock data if API fails or no key provided
const USE_MOCK_DATA = !import.meta.env.VITE_METALS_API_KEY;

/**
 * Fetch real-time gold prices from Metals API
 * Free tier: https://metals.dev - Sign up for API key
 * Alternative: https://metals-api.com (60-second updates, free tier)
 */
export const fetchRealTimeGoldPrices = async () => {
    if (USE_MOCK_DATA) {
        console.warn('⚠️ Using mock data. Add VITE_METALS_API_KEY to .env for real-time prices');
        return null; // Will fall back to mock data
    }

    try {
        // Metals.live API (free, no key required for basic usage)
        // Fetches spot prices for gold in USD
        const response = await fetch('https://api.metals.live/v1/spot/gold');

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // The API returns price per troy ounce, convert to per gram
        // 1 troy ounce = 31.1035 grams
        const pricePerOunce = data[0]?.price || 0;
        const pricePerGram = pricePerOunce / 31.1035;

        return {
            gold24k: Math.round(pricePerGram * 100) / 100,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error fetching real-time gold prices:', error);
        return null; // Fall back to mock data
    }
};

/**
 * Alternative: GoldAPI.io (requires free API key)
 * Sign up at: https://www.goldapi.io/
 */
export const fetchFromGoldAPI = async () => {
    const apiKey = import.meta.env.VITE_GOLDAPI_KEY;

    if (!apiKey) {
        return null;
    }

    try {
        const response = await fetch('https://www.goldapi.io/api/XAU/USD', {
            headers: {
                'x-access-token': apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`GoldAPI Error: ${response.status}`);
        }

        const data = await response.json();

        // Convert from per troy ounce to per gram
        const pricePerGram = data.price / 31.1035;

        return {
            gold24k: Math.round(pricePerGram * 100) / 100,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error fetching from GoldAPI:', error);
        return null;
    }
};

/**
 * Calculate prices for different purities based on 24K price
 */
export const calculatePurityPrices = (gold24kPrice) => {
    return {
        gold24k: gold24kPrice,
        gold22k: Math.round((gold24kPrice * 0.916) * 100) / 100, // 22K is 91.6% pure
        gold18k: Math.round((gold24kPrice * 0.75) * 100) / 100   // 18K is 75% pure
    };
};

/**
 * Fetch and process real-time gold prices
 */
export const getRealTimeGoldPrices = async () => {
    // Try Metals.live first (no key required)
    let result = await fetchRealTimeGoldPrices();

    // If that fails, try GoldAPI if key is available
    if (!result) {
        result = await fetchFromGoldAPI();
    }

    // If both fail or no API key, return null to use mock data
    if (!result) {
        return null;
    }

    // Calculate prices for all purities
    const prices = calculatePurityPrices(result.gold24k);

    return {
        ...prices,
        timestamp: result.timestamp
    };
};
