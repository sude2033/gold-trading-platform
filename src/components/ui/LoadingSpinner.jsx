import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeClass = size === 'sm' ? styles['spinner-sm'] : size === 'lg' ? styles['spinner-lg'] : '';

    return (
        <div className={`${styles['spinner-container']} ${className}`}>
            <div className={`${styles.spinner} ${sizeClass}`} role="status" aria-label="Loading">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default LoadingSpinner;
