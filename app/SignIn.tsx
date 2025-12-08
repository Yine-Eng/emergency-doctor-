import PasswordInput from '@/components/PasswordInput';
import PrimaryButton from '@/components/PrimaryButton';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import { useAuth } from '@/contexts/AuthContext';
import { globalStyles } from '@/styles/globalStyles';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function SignIn() {
    const router = useRouter();
    const { login, setUser } = useAuth();

    const [form, setForm] = useState({
        emailOrPhone: '',
        password: '',
    });

    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
        setErrors({ ...errors, [field]: '' });
    };

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!form.emailOrPhone.trim()) newErrors.emailOrPhone = 'Email or phone is required';
        if (!form.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignIn = async () => {
        if (!validate()) return;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const res = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: form.emailOrPhone,
                    password: form.password,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            console.log('Response status:', res.status);
            console.log('Response ok:', res.ok);

            const data = await res.json();
            console.log('Response data:', data);

            if (res.ok) {
                if (data.accessToken && data.refreshToken) {
                    await login(data.accessToken, data.refreshToken, rememberMe);
                    setUser(data.user);
                }
                router.replace('/tabs' as any);
            } else {
                console.log('Showing backend error:', data.message);
                alert(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Network error:', err);
            if (err instanceof Error && err.name === 'AbortError') {
                alert('Connection timeout. Please check if the server is running.');
            } else {
                alert('Unable to connect to server. Please check your connection.');
            }
        }
    };

    return (
        <KeyboardAvoidingView
            style={globalStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={globalStyles.inner} keyboardShouldPersistTaps="handled">
                <Text style={globalStyles.header}>Welcome Back</Text>

                {/* Email or Phone */}
                <Text style={globalStyles.label}>Email or Phone</Text>
                <TextInput
                    testID="input-emailOrPhone"
                    style={globalStyles.input}
                    value={form.emailOrPhone}
                    onChangeText={(text) => handleChange('emailOrPhone', text)}
                />
                {errors.emailOrPhone && <Text style={globalStyles.errorText}>{errors.emailOrPhone}</Text>}

                {/* Password */}
                <PasswordInput
                    testID="input-password"
                    label="Password"
                    value={form.password}
                    onChangeText={(text) => handleChange('password', text)}
                    error={errors.password}
                />

                {/* Forgot Password */}
                <TouchableOpacity onPress={() => console.log('Navigate to Forgot Password')}>
                    <Text style={globalStyles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>

                {/* Remember Me */}
                <View style={globalStyles.checkboxContainer}>
                    <Checkbox value={rememberMe} onValueChange={setRememberMe} color={rememberMe ? '#1E40AF' : undefined} />
                    <Text style={globalStyles.checkboxLabel}>Remember Me</Text>
                </View>

                {/* Submit */}
                <PrimaryButton title="Sign In" onPress={handleSignIn} />

                {/* Sign Up Link */}
                <TouchableOpacity onPress={() => router.replace('/SignUp')}>
                    <Text style={globalStyles.linkContainer}>
                        Don't have an account? <Text style={globalStyles.linkText}>Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
