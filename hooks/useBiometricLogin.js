import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../contexts/AuthContext';

export const useBiometricLogin = async () => {
    const { login } = useAuth();

    const remember = await SecureStore.getItemAsync('rememberMe');
    const token = await SecureStore.getItemAsync('authToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');

    if (remember && token && refreshToken) {
        const authResult = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to continue',
            fallbackLabel: 'Use device PIN',
        });

        if (authResult.success) {
            await login(token, refreshToken, true);
        }
    }
};
