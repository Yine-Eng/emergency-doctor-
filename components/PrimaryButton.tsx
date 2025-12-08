import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
}

export default function PrimaryButton({ title, onPress, style }: PrimaryButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#1E40AF',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
        alignItems: 'center',
    },
    text: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
