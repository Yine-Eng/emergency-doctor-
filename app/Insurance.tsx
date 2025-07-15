import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

interface Contact {
    id: string;
    name: string;
    phone: string;
}

export default function InsuranceScreen() {
    const [location, setLocation] = useState<string | null>(null);
    const [insurers, setInsurers] = useState<any[]>([]);

    useEffect(() => {
        const fetchLocationAndInsurance = async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission denied",
                    "Location access is needed to show insurance providers in your area."
                );
                return;
            }
            const loc = await Location.getCurrentPositionAsync({});
            const coords = loc.coords;
            const userLocation = `${coords.latitude},${coords.longitude}`;
            setLocation(userLocation);

            setInsurers([
                {
                    id: "1",
                    name: "SafeHealth Insurance",
                    price: "$45/mo",
                    coverage: "Emergency, Dental, Routine",
                },
                {
                    id: "2",
                    name: "MediTrust",
                    price: "$38/mo",
                    coverage: "Emergency, Maternity",
                },
                {
                    id: "3",
                    name: "AllCare Basic",
                    price: "$30/mo",
                    coverage: "Emergency Only",
                },
            ]);
        };

        fetchLocationAndInsurance();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Insurance Finder</Text>
            <Text style={styles.description}>
                Discover health insurance providers available in your region.
                Use filters in the future to refine by monthly cost, coverage,
                and benefits.
            </Text>

            {insurers.map((provider) => (
                <View key={provider.id} style={styles.card}>
                    <Ionicons
                        name="shield-checkmark-outline"
                        size={24}
                        color="#1E40AF"
                    />
                    <View style={styles.cardContent}>
                        <Text style={styles.name}>{provider.name}</Text>
                        <Text style={styles.price}>{provider.price}</Text>
                        <Text style={styles.coverage}>
                            Covers: {provider.coverage}
                        </Text>
                    </View>
                </View>
            ))}

            {insurers.length === 0 && (
                <Text style={styles.emptyText}>
                    No providers found for your region yet.
                </Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#F8FAFC",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: "#475569",
        marginBottom: 20,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    cardContent: {
        marginLeft: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E293B",
    },
    price: {
        fontSize: 14,
        color: "#1E40AF",
    },
    coverage: {
        fontSize: 13,
        color: "#64748B",
        marginTop: 4,
    },
    emptyText: {
        fontSize: 14,
        color: "#94A3B8",
        fontStyle: "italic",
        marginTop: 20,
    },
});
