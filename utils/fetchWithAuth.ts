import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../constants/ApiConfig";

export const fetchWithAuth = async (url: string, options = {}) => {
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
                }
            } catch (error) {
                console.error("Token refresh failed:", error);
            }
        }
    }

    return res;
};
