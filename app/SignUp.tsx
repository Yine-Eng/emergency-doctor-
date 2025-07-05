import PasswordInput from '@/components/PasswordInput';
import PrimaryButton from '@/components/PrimaryButton';
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
    View,
} from 'react-native';

export default function SignUp() {
    const router = useRouter();

    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
        setErrors({ ...errors, [field]: '' });
    };

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
        if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = () => {
        if (!validate()) return;

        console.log('🚀 Secure Sign-Up:', form, 'Remember Me:', rememberMe);
        router.replace('/Home');
    };

    return (
        <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={globalStyles.inner} keyboardShouldPersistTaps="handled">
                <Text style={globalStyles.header}>Create Your Account</Text>

                {/* Full Name */}
                <Text style={globalStyles.label}>Full Name</Text>
                <TextInput
                    testID="input-fullName"
                    style={globalStyles.input}
                    value={form.fullName}
                    onChangeText={(text) => handleChange('fullName', text)}
                />
                {errors.fullName && <Text style={globalStyles.errorText}>{errors.fullName}</Text>}

                {/* Phone Number */}
                <Text style={globalStyles.label}>Phone Number</Text>
                <TextInput
                    testID="input-phone"
                    keyboardType="phone-pad"
                    style={globalStyles.input}
                    value={form.phone}
                    onChangeText={(text) => handleChange('phone', text)}
                />
                {errors.phone && <Text style={globalStyles.errorText}>{errors.phone}</Text>}

                {/* Email (optional) */}
                <Text style={globalStyles.label}>Email (optional)</Text>
                <TextInput
                    testID="input-email"
                    keyboardType="email-address"
                    style={globalStyles.input}
                    value={form.email}
                    onChangeText={(text) => handleChange('email', text)}
                />

                {/* Password */}
                <PasswordInput
                    testID="input-password"
                    label="Password"
                    value={form.password}
                    onChangeText={(text) => handleChange('password', text)}
                />
                {errors.password && <Text style={globalStyles.errorText}>{errors.password}</Text>}

                {/* Confirm Password */}
                <PasswordInput
                    testID="input-confirmPassword"
                    label="Confirm Password"
                    value={form.confirmPassword}
                    onChangeText={(text) => handleChange('confirmPassword', text)}
                    error={errors.confirmPassword}
                />  
                {errors.confirmPassword && <Text style={globalStyles.errorText}>{errors.confirmPassword}</Text>}

                {/* Remember Me */}
                <View style={globalStyles.checkboxContainer}>
                <Checkbox value={rememberMe} onValueChange={setRememberMe} color={rememberMe ? '#1E40AF' : undefined} />
                <Text style={globalStyles.checkboxLabel}>Remember Me</Text>
                </View>

                {/* Submit */}
                <PrimaryButton title="Sign Up" onPress={handleSignUp} />

                {/* Sign In Link */}
                <TouchableOpacity onPress={() => router.replace('/SignIn')}>
                    <Text style={globalStyles.linkContainer}>
                        Already have an account? <Text style={globalStyles.linkText}>Sign In</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
