import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles['footer-content']}>
                <div className={styles['footer-section']}>
                    <h3>GoldTrade</h3>
                    <p>Professional gold trading platform for modern investors.</p>
                    <div className={styles.disclaimer}>
                        ⚠️ This is a demo application. Market data is simulated for demonstration purposes only.
                    </div>
                </div>

                <div className={styles['footer-section']}>
                    <h3>Quick Links</h3>
                    <ul className={styles['footer-links']}>
                        <li>
                            <a href="#" className={styles['footer-link']}>
                                About Us
                            </a>
                        </li>
                        <li>
                            <a href="#" className={styles['footer-link']}>
                                Contact
                            </a>
                        </li>
                        <li>
                            <a href="#" className={styles['footer-link']}>
                                FAQ
                            </a>
                        </li>
                    </ul>
                </div>

                <div className={styles['footer-section']}>
                    <h3>Legal</h3>
                    <ul className={styles['footer-links']}>
                        <li>
                            <a href="#" className={styles['footer-link']}>
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a href="#" className={styles['footer-link']}>
                                Terms of Service
                            </a>
                        </li>
                        <li>
                            <a href="#" className={styles['footer-link']}>
                                Disclaimer
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className={styles['footer-bottom']}>
                <p>&copy; {new Date().getFullYear()} GoldTrade. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
