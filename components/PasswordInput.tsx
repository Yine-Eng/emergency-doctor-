import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface PasswordInputProps {
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    label?: string;
    testID?: string;
}

export default function PasswordInput({
    value,
    onChangeText,
    error,
    label = 'Password',
    testID,
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    testID={testID}
                    style={styles.inputWithIcon}
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChangeText}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={22}
                        color="#64748B"
                        style={{ marginRight: 12 }}
                    />
                </TouchableOpacity>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
        color: '#1E293B',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        borderColor: '#CBD5E1',
        borderWidth: 1,
        backgroundColor: '#FFF',
        marginBottom: 10,
    },
    inputWithIcon: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#0F172A',
    },
    error: {
        color: '#EF4444',
        marginBottom: 10,
        fontSize: 13,
    },
});
