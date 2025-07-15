import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const COMMON_CONDITIONS = [
    "Burns",
    "Cuts",
    "Choking",
    "Bleeding",
    "Fracture",
    "Allergic Reaction",
    "Shock",
];

export default function FirstAid() {
    const [search, setSearch] = useState("");
    const [selectedCondition, setSelectedCondition] = useState<string | null>(
        null
    );

    const handleSelect = (condition: string) => {
        setSelectedCondition(condition);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>First Aid Guide</Text>
            <Text style={styles.subtitle}>
                Search for common emergencies and learn how to respond. Tap a
                condition below to see guidance.
            </Text>

            <TextInput
                placeholder="Search first aid..."
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
            />

            <View style={styles.conditionList}>
                {COMMON_CONDITIONS.filter((cond) =>
                    cond.toLowerCase().includes(search.toLowerCase())
                ).map((condition) => (
                    <TouchableOpacity
                        key={condition}
                        onPress={() => handleSelect(condition)}
                        style={styles.conditionCard}
                    >
                        <Ionicons
                            name="medkit-outline"
                            size={20}
                            color="#1E40AF"
                        />
                        <Text style={styles.conditionText}>{condition}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {selectedCondition && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>{selectedCondition}</Text>
                    <Text style={styles.infoDesc}>
                        This is where step-by-step first aid instructions for{" "}
                        {selectedCondition.toLowerCase()} will appear. You can
                        enhance this with real data or media later.
                    </Text>
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
});
