import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../hooks/useNotification';
import styles from './AuthPages.module.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { login } = useAuth();
    const { error: showError, success: showSuccess } = useNotification();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        // Validate
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Attempt login
        const result = login(email, password);

        if (result.success) {
            showSuccess('Login successful! Welcome back.');
            navigate('/dashboard');
        } else {
            showError(result.error);
            setErrors({ general: result.error });
        }
    };

    return (
        <div className={styles['auth-container']}>
            <div className={styles['auth-card']}>
                <div className={styles['auth-header']}>
                    <h1 className={styles['auth-logo']}>⚜ GoldTrade</h1>
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account to continue trading</p>
                </div>

                <form onSubmit={handleSubmit} className={styles['auth-form']}>
                    {errors.general && (
                        <div className={styles['error-message']}>{errors.general}</div>
                    )}

                    <div className={styles['form-group']}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                        {errors.email && <span className={styles['field-error']}>{errors.email}</span>}
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                        {errors.password && <span className={styles['field-error']}>{errors.password}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                        Sign In
                    </button>
                </form>

                <div className={styles['auth-footer']}>
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className={styles['auth-link']}>
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
