import { StatusBar } from "expo-status-bar";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SafeScreenLayoutProps {
    children: ReactNode;
}

export default function SafeScreenLayout({ children }: SafeScreenLayoutProps) {
    return (
        // Only apply top safe area here; tab bar / bottom insets are handled by navigation/tab components.
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <StatusBar style="dark" backgroundColor="#F8FAFC" />
            <View style={styles.container}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    container: {
        flex: 1,
    },
});
