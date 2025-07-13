import * as SecureStore from "expo-secure-store";
import { useAuth } from "../contexts/AuthContext";

export const fetchWithAuth = async (url: string, options = {}) => {
    const { authToken, refresh } = useAuth();

    let res = await fetch(url, {
        ...options,
        headers: {
            ...(options as any).headers,
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
        },
    });

    if (res.status === 401 || res.status === 403) {
        await refresh();
        const newToken = await SecureStore.getItemAsync("authToken");

        res = await fetch(url, {
            ...options,
            headers: {
                ...(options as any).headers,
                Authorization: `Bearer ${newToken}`,
                "Content-Type": "application/json",
            },
        });
    }

    return res;
};

// Separate function for use outside of React components
export const fetchWithAuthDirect = async (url: string, options = {}) => {
    const authToken = await SecureStore.getItemAsync("authToken");

    let res = await fetch(url, {
        ...options,
        headers: {
            ...(options as any).headers,
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
        },
    });

    if (res.status === 401 || res.status === 403) {
        // Try to refresh token
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (refreshToken) {
            try {
                const refreshRes = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/auth/refresh-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken }),
                });

                if (refreshRes.ok) {
                    const { accessToken } = await refreshRes.json();
                    await SecureStore.setItemAsync("authToken", accessToken);
                    
                    // Retry the original request with new token
                    res = await fetch(url, {
                        ...options,
                        headers: {
                            ...(options as any).headers,
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    });
                }
            } catch (error) {
                console.error("Token refresh failed:", error);
            }
        }
    }

    return res;
};
