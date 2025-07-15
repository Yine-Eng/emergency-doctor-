import { API_ENDPOINTS } from "@/constants/ApiConfig";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function FirstAid() {
    const [search, setSearch] = useState("");
    const [conditions, setConditions] = useState<any[]>([]);
    const [selectedCondition, setSelectedCondition] = useState<any | null>(
        null
    );

    const loadConditions = async () => {
        try {
            const res = await fetchWithAuth(
                `${API_ENDPOINTS.FIRST_AID}?search=${encodeURIComponent(
                    search
                )}`
            );
            const data = await res.json();
            setConditions(data);
        } catch (err) {
            console.error("Error fetching conditions", err);
        }
    };

    const handleSelect = async (condition: string) => {
        try {
            const res = await fetchWithAuth(
                API_ENDPOINTS.FIRST_AID_CONDITION(condition)
            );
            const data = await res.json();
            setSelectedCondition(data);
        } catch (err) {
            console.error("Error fetching guide:", err);
        }
    };

    useEffect(() => {
        loadConditions();
    }, [search]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>First Aid Guide</Text>
            <Text style={styles.subtitle}>
                Search for common emergencies and learn how to respond.
            </Text>

            <TextInput
                placeholder="Search first aid..."
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
            />

            <View style={styles.conditionList}>
                {conditions.map((cond) => (
                    <TouchableOpacity
                        key={cond._id}
                        onPress={() => handleSelect(cond.condition)}
                        style={styles.conditionCard}
                    >
                        <Ionicons
                            name="medkit-outline"
                            size={20}
                            color="#1E40AF"
                        />
                        <Text style={styles.conditionText}>
                            {cond.condition}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {selectedCondition && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>
                        {selectedCondition.condition}
                    </Text>

                    {selectedCondition.imageUrl && (
                        <Image
                            source={{ uri: selectedCondition.imageUrl }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}

                    {selectedCondition.steps?.map(
                        (step: string, index: number) => (
                            <Text key={index} style={styles.infoDesc}>
                                {index + 1}. {step}
                            </Text>
                        )
                    )}

                    {selectedCondition.source && (
                        <TouchableOpacity
                            onPress={() =>
                                Linking.openURL(selectedCondition.source).catch(
                                    (err) =>
                                        console.error(
                                            "Failed to open link",
                                            err
                                        )
                                )
                            }
                        >
                            <Text style={styles.link}>View Source ↗</Text>
                        </TouchableOpacity>
                    )}
                </View>
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
    subtitle: {
        fontSize: 14,
        color: "#475569",
        marginBottom: 16,
    },
    searchInput: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    conditionList: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    conditionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E0E7FF",
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
        marginRight: 8,
    },
    conditionText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: "500",
        color: "#1E293B",
    },
    infoBox: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginTop: 24,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E40AF",
        marginBottom: 8,
    },
    infoDesc: {
        fontSize: 14,
        color: "#475569",
    },
    image: {
        width: "100%",
        height: 160,
        borderRadius: 8,
        marginBottom: 12,
    },
    link: {
        color: "#1D4ED8",
        marginTop: 12,
        fontWeight: "600",
        fontSize: 14,
    },
});
