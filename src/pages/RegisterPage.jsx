import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../hooks/useNotification';
import { validatePassword } from '../utils/validation';
import styles from './AuthPages.module.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const { register } = useAuth();
    const { error: showError, success: showSuccess } = useNotification();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error for this field
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: null
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        // Validate
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.errors[0];
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Attempt registration
        const result = register({
            name: formData.name,
            email: formData.email,
            password: formData.password
        });

        if (result.success) {
            showSuccess('Registration successful! Welcome to GoldTrade.');
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
                    <h2>Create Account</h2>
                    <p>Start your gold trading journey today</p>
                </div>

                <form onSubmit={handleSubmit} className={styles['auth-form']}>
                    {errors.general && (
                        <div className={styles['error-message']}>{errors.general}</div>
                    )}

                    <div className={styles['form-group']}>
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            autoComplete="name"
                        />
                        {errors.name && <span className={styles['field-error']}>{errors.name}</span>}
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
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
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                        {errors.password && <span className={styles['field-error']}>{errors.password}</span>}
                        <div className={styles['password-requirements']}>
                            <strong>Password must contain:</strong>
                            <ul>
                                <li>At least 8 characters</li>
                                <li>One uppercase letter</li>
                                <li>One lowercase letter</li>
                                <li>One number</li>
                            </ul>
                        </div>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                        {errors.confirmPassword && (
                            <span className={styles['field-error']}>{errors.confirmPassword}</span>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                        Create Account
                    </button>
                </form>

                <div className={styles['auth-footer']}>
                    <p>
                        Already have an account?{' '}
                        <Link to="/" className={styles['auth-link']}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
