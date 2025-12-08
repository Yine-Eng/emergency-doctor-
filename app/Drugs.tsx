import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface DrugResult {
    name: string;
    approved: boolean;
    reason?: string;
}

export default function DrugsChecker() {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState<string | null>(null);
    const [results, setResults] = useState<DrugResult[]>([]);

    useEffect(() => {
        const getLocation = async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;
            const loc = await Location.getCurrentPositionAsync({});
            const coords = loc.coords;
            const res = await Location.reverseGeocodeAsync(coords);
            setLocation(res[0]?.country || null);
        };

        getLocation();
    }, []);

    const handleSearch = () => {
        if (!query.trim()) return;

        // Dummy data simulation
        const simulated: DrugResult[] = [
            {
                name: query,
                approved: query.toLowerCase() === "amoxicillin",
                reason:
                    query.toLowerCase() !== "amoxicillin"
                        ? `${query} is not approved in ${
                              location || "your location"
                          }`
                        : undefined,
            },
        ];

        setResults(simulated);
    };

    const openWikipedia = (drug: string) => {
        const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(drug)}`;
        Linking.openURL(url);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Drug Checker</Text>
            <Text style={styles.description}>
                Search to check if a drug is approved in your current country.
                This is not a substitute for professional medical advice.
            </Text>

            <View style={styles.searchRow}>
                <TextInput
                    style={styles.input}
                    value={query}
                    placeholder="Search drug name..."
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                <TouchableOpacity
                    style={styles.searchBtn}
                    onPress={handleSearch}
                >
                    <Ionicons name="search" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {results.map((result, index) => (
                <View
                    key={index}
                    style={[
                        styles.card,
                        result.approved ? styles.approved : styles.rejected,
                    ]}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons 
                            name="medical" 
                            size={40} 
                            color={result.approved ? "#22C55E" : "#EF4444"} 
                        />
                    </View>
                    <View style={styles.texts}>
                        <Text style={styles.name}>{result.name}</Text>
                        <Text style={styles.status}>
                            {result.approved
                                ? "✅ Approved"
                                : "❌ Not Approved"}
                        </Text>
                        {result.reason && (
                            <Text style={styles.reason}>{result.reason}</Text>
                        )}

                        <TouchableOpacity
                            onPress={() => openWikipedia(result.name)}
                            style={styles.wikiBtn}
                        >
                            <Text style={styles.wikiText}>
                                View more on Wikipedia
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            {results.length === 0 && query && (
                <Text style={styles.noResults}>
                    No results found for "{query}"
                </Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#F8FAFC",
        paddingBottom: 40,
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
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    input: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        borderColor: "#E2E8F0",
        borderWidth: 1,
    },
    searchBtn: {
        marginLeft: 8,
        backgroundColor: "#1E40AF",
        padding: 12,
        borderRadius: 8,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    approved: {
        borderLeftWidth: 6,
        borderLeftColor: "#22C55E",
    },
    rejected: {
        borderLeftWidth: 6,
        borderLeftColor: "#EF4444",
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 16,
    },
    iconContainer: {
        width: 50,
        height: 50,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    texts: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E293B",
        marginBottom: 4,
    },
    status: {
        fontSize: 14,
        color: "#475569",
    },
    reason: {
        fontSize: 13,
        color: "#EF4444",
        marginTop: 4,
    },
    wikiBtn: {
        marginTop: 6,
    },
    wikiText: {
        fontSize: 13,
        color: "#1E40AF",
        textDecorationLine: "underline",
    },
    noResults: {
        fontSize: 14,
        color: "#94A3B8",
        fontStyle: "italic",
        textAlign: "center",
    },
});
