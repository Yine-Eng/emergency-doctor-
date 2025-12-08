import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const mockAlerts = [
    {
        id: "1",
        location: "New York, NY",
        message: "Severe thunderstorm warning issued.",
    },
    {
        id: "2",
        location: "Los Angeles, CA",
        message: "Extreme heat alert in effect.",
    },
    {
        id: "3",
        location: "Miami, FL",
        message: "Flood watch for coastal areas.",
    },
];

export default function Alerts() {
    const [savedLocations, setSavedLocations] = useState<string[]>([]);
    const [currentLocation, setCurrentLocation] = useState<string | null>(null);
    const [input, setInput] = useState("");

    useEffect(() => {
        (async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                const loc = await Location.getCurrentPositionAsync({});
                const address = await Location.reverseGeocodeAsync(loc.coords);
                const city = address[0]?.city || address[0]?.region;
                setCurrentLocation(city);
            }
        })();
    }, []);

    const filteredAlerts = mockAlerts.filter((alert) =>
        [currentLocation, ...savedLocations].some((loc) =>
            alert.location.toLowerCase().includes(loc?.toLowerCase() || "")
        )
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Area Alerts</Text>
            <Text style={styles.description}>
                View alerts for your current area or add other locations to
                monitor.
            </Text>

            <View style={styles.inputRow}>
                <Ionicons
                    name="add"
                    size={20}
                    color="#1E40AF"
                    style={{ marginRight: 6 }}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Add a location (e.g. Chicago, IL)"
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={() => {
                        if (input.trim()) {
                            setSavedLocations((prev) => [
                                ...prev,
                                input.trim(),
                            ]);
                            setInput("");
                        }
                    }}
                    returnKeyType="done"
                />
            </View>

            {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                    <View key={alert.id} style={styles.alertCard}>
                        <Ionicons name="warning" size={20} color="#B91C1C" />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.alertLocation}>
                                {alert.location}
                            </Text>
                            <Text style={styles.alertMessage}>
                                {alert.message}
                            </Text>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={styles.emptyText}>
                    No alerts for your saved areas.
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
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: "#1E293B",
    },
    alertCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#FEE2E2",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    alertLocation: {
        fontWeight: "600",
        color: "#991B1B",
    },
    alertMessage: {
        fontSize: 14,
        color: "#B91C1C",
    },
    emptyText: {
        fontSize: 14,
        color: "#64748B",
        fontStyle: "italic",
    },
});
