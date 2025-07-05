import PasswordInput from '@/components/PasswordInput';
import PrimaryButton from '@/components/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { globalStyles } from '@/styles/globalStyles';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
    const [showPassword, setShowPassword] = useState(false);

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
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: form.emailOrPhone,
                    password: form.password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.accessToken && data.refreshToken) {
                    await login(data.accessToken, data.refreshToken, rememberMe);
                    setUser(data.user);
                }
                router.replace('/Home');
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong');
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
                        Don’t have an account? <Text style={globalStyles.linkText}>Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
