import SafeScreenLayout from "@/components/SafeScreenLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
    return (
        <AuthProvider>
            <SafeAreaProvider>
                <SafeScreenLayout>
                    <Stack screenOptions={{ headerShown: false }} />
                </SafeScreenLayout>
            </SafeAreaProvider>
        </AuthProvider>
    );
}
