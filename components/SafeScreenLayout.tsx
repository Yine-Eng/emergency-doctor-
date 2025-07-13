import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

interface SafeScreenLayoutProps {
    children: ReactNode;
}

export default function SafeScreenLayout({ children }: SafeScreenLayoutProps) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="dark" backgroundColor="#F8FAFC" />
            <View style={styles.container}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    container: {
        flex: 1,
    },
});
