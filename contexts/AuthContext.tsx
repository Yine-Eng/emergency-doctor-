import { API_ENDPOINTS } from '@/constants/ApiConfig';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
    authToken: string | null;
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
    login: (token: string, refreshToken: string, remember?: boolean) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null); 

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync('authToken');
            if (token) setAuthToken(token);
        };
        loadToken();
    }, []);

    const login = async (token: string, refreshToken: string, remember = false) => {
        await SecureStore.setItemAsync('authToken', token);
        await SecureStore.setItemAsync('refreshToken', refreshToken);
        if (remember) await SecureStore.setItemAsync('rememberMe', 'true');
        setAuthToken(token);
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('rememberMe');
        setAuthToken(null);
    };

    const refresh = async () => {
        const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!storedRefreshToken) return;

        try {
            const res = await fetch(API_ENDPOINTS.REFRESH_TOKEN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: storedRefreshToken }),
            });

            const data = await res.json();
            if (res.ok && data.accessToken) {
                await SecureStore.setItemAsync('authToken', data.accessToken);
                setAuthToken(data.accessToken);
            } else {
                console.warn('Token refresh failed:', data.message);
                await logout();
            }
        } catch (err) {
            console.error('Token refresh error:', err);
        }
    };

    return (
        <AuthContext.Provider value={{ authToken, user, setUser, login, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
};
