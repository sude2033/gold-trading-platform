import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { validateEmail, validatePassword, validateName, sanitizeInput } from '../utils/validation';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [users, setUsers] = useLocalStorage('gold-trading-users', []);
    const [currentUser, setCurrentUser] = useLocalStorage('gold-trading-current-user', null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!currentUser);

    // Check session timeout (30 minutes)
    useEffect(() => {
        if (currentUser && currentUser.lastActivity) {
            const thirtyMinutes = 30 * 60 * 1000;
            const timeSinceActivity = Date.now() - currentUser.lastActivity;

            if (timeSinceActivity > thirtyMinutes) {
                logout();
            }
        }
    }, [currentUser]);

    // Update last activity timestamp
    const updateActivity = useCallback(() => {
        if (currentUser) {
            setCurrentUser({
                ...currentUser,
                lastActivity: Date.now()
            });
        }
    }, [currentUser, setCurrentUser]);

    // Register new user
    const register = useCallback((userData) => {
        const { name, email, password } = userData;

        // Validate inputs
        if (!validateEmail(email)) {
            return { success: false, error: 'Invalid email address' };
        }

        const nameValidation = validateName(name);
        if (!nameValidation.isValid) {
            return { success: false, error: nameValidation.error };
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return { success: false, error: passwordValidation.errors[0] };
        }

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return { success: false, error: 'User with this email already exists' };
        }

        // Create new user
        const newUser = {
            id: `user-${Date.now()}`,
            name: sanitizeInput(name),
            email: sanitizeInput(email),
            createdAt: new Date().toISOString(),
            lastActivity: Date.now()
        };

        // Save user (in production, password would be hashed on backend)
        setUsers([...users, { ...newUser, password }]);
        setCurrentUser(newUser);
        setIsAuthenticated(true);

        return { success: true, user: newUser };
    }, [users, setUsers, setCurrentUser]);

    // Login user
    const login = useCallback((email, password) => {
        // Validate inputs
        if (!validateEmail(email)) {
            return { success: false, error: 'Invalid email address' };
        }

        if (!password) {
            return { success: false, error: 'Password is required' };
        }

        // Find user
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return { success: false, error: 'Invalid email or password' };
        }

        // Update user session
        const userSession = {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            lastActivity: Date.now()
        };

        setCurrentUser(userSession);
        setIsAuthenticated(true);

        return { success: true, user: userSession };
    }, [users, setCurrentUser]);

    // Logout user
    const logout = useCallback(() => {
        setCurrentUser(null);
        setIsAuthenticated(false);
    }, [setCurrentUser]);

    const value = {
        user: currentUser,
        isAuthenticated,
        register,
        login,
        logout,
        updateActivity
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
