import SafeScreenLayout from "@/components/SafeScreenLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <AuthProvider>
            <SafeScreenLayout>
                <Stack screenOptions={{ headerShown: false }} />
            </SafeScreenLayout>
        </AuthProvider>
    );
}
