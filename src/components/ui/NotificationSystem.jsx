import React from 'react';
import styles from './NotificationSystem.module.css';

const NotificationSystem = ({ notifications, onClose }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '!';
            case 'info':
            default:
                return 'i';
        }
    };

    return (
        <div className={styles['notifications-container']} role="region" aria-live="polite" aria-label="Notifications">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`${styles.notification} ${styles[`notification-${notification.type}`]}`}
                    role="alert"
                >
                    <div className={styles['notification-icon']}>
                        {getIcon(notification.type)}
                    </div>
                    <div className={styles['notification-content']}>
                        <p className={styles['notification-message']}>{notification.message}</p>
                    </div>
                    <button
                        className={styles['notification-close']}
                        onClick={() => onClose(notification.id)}
                        aria-label="Close notification"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationSystem;
