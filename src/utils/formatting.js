import { format, formatDistanceToNow } from 'date-fns';

// Format currency in Indian Rupees
export const formatCurrency = (amount, decimals = 2) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(amount);
};

// Format number with commas
export const formatNumber = (number, decimals = 2) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
};

// Format percentage
export const formatPercentage = (value, decimals = 2) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatNumber(value, decimals)}%`;
};

// Format date
export const formatDate = (date, formatString = 'PPP') => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatString);
};

// Format date and time
export const formatDateTime = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'PPP p');
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
};

// Format weight in grams
export const formatWeight = (grams, decimals = 2) => {
    return `${formatNumber(grams, decimals)} g`;
};

// Format purity
export const formatPurity = (purity) => {
    return `${purity}K`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Format transaction type
export const formatTransactionType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
};
