import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Header.module.css';

const Header = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles['header-container']}>
                <Link to="/dashboard" className={styles.logo}>
                    <span className={styles['logo-icon']}>⚜</span>
                    <span>GoldTrade</span>
                </Link>

                <nav className={styles.nav}>
                    <Link
                        to="/dashboard"
                        className={`${styles['nav-link']} ${isActive('/dashboard') ? styles['nav-link-active'] : ''}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/portfolio"
                        className={`${styles['nav-link']} ${isActive('/portfolio') ? styles['nav-link-active'] : ''}`}
                    >
                        Portfolio
                    </Link>
                    <Link
                        to="/history"
                        className={`${styles['nav-link']} ${isActive('/history') ? styles['nav-link-active'] : ''}`}
                    >
                        History
                    </Link>
                </nav>

                <div className={styles['user-menu']}>
                    {user && <span className={styles['user-name']}>Welcome, {user.name}</span>}
                    <button className={styles['logout-btn']} onClick={handleLogout}>
                        Logout
                    </button>
                    <button
                        className={styles['mobile-menu-btn']}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        ☰
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <nav className={styles['mobile-nav']}>
                    <Link
                        to="/dashboard"
                        className={`${styles['nav-link']} ${isActive('/dashboard') ? styles['nav-link-active'] : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/portfolio"
                        className={`${styles['nav-link']} ${isActive('/portfolio') ? styles['nav-link-active'] : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Portfolio
                    </Link>
                    <Link
                        to="/history"
                        className={`${styles['nav-link']} ${isActive('/history') ? styles['nav-link-active'] : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        History
                    </Link>
                </nav>
            )}
        </header>
    );
};

export default Header;
