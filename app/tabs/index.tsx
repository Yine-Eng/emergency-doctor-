import PrimaryButton from "@/components/PrimaryButton";
import { useRouter } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function Home() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Top Branding */}
            <View style={styles.header}>
                <Text style={styles.brand}>E-Doc</Text>
            </View>

            {/* Emergency Button */}
            <View style={styles.main}>
                <PrimaryButton
                    title="EMERGENCY"
                    onPress={() => {
                        router.push("/EmergencyContacts");
                    }}
                    style={styles.emergencyButton}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 4,
    },
    brand: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1E40AF",
        fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
        letterSpacing: 0.5,
        fontStyle: "italic",
    },
    main: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emergencyButton: {
        width: 200,
        height: 200,
        borderRadius: 100,
        justifyContent: "center",
        backgroundColor: "#DC2626",
    },
});
