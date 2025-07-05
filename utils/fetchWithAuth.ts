import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../contexts/AuthContext';

export const fetchWithAuth = async (url: string, options = {}) => {
  const { authToken, refresh } = useAuth();

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options as any).headers,
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (res.status === 401 || res.status === 403) {
    await refresh();
    const newToken = await SecureStore.getItemAsync('authToken');

    res = await fetch(url, {
      ...options,
      headers: {
        ...(options as any).headers,
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  return res;
};
