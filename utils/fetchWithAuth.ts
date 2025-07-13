import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../constants/ApiConfig";
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
                const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
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
                } else {
                    // Refresh token is invalid/expired, clear tokens
                    console.log("Refresh token expired, clearing tokens");
                    await SecureStore.deleteItemAsync("authToken");
                    await SecureStore.deleteItemAsync("refreshToken");
                    throw new Error("Authentication expired. Please login again.");
                }
            } catch (error) {
                console.error("Token refresh failed:", error);
                // Clear tokens on any error
                await SecureStore.deleteItemAsync("authToken");
                await SecureStore.deleteItemAsync("refreshToken");
                throw new Error("Authentication failed. Please login again.");
            }
        } else {
            throw new Error("No refresh token available. Please login again.");
        }
    }

    return res;
};
