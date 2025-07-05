import { useAuth } from '@/contexts/AuthContext';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AuthGate() {
    const { setUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const checkBiometricAuth = async () => {
            const remember = await SecureStore.getItemAsync('rememberMe');
            const token = await SecureStore.getItemAsync('authToken');

            if (remember && token) {
                const biometric = await LocalAuthentication.authenticateAsync({
                    promptMessage: 'Authenticate to continue',
            });

                if (biometric.success) {
                    setUser({});
                    router.replace('/Home');
                    return;
                }
            }

            router.replace('/SignIn');
        };

        checkBiometricAuth();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#1E40AF" />
        </View>
    );
}
