import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SeverityOption {
    label: string;
    emoji: string;
    value: "mild" | "moderate" | "severe";
}

const options: SeverityOption[] = [
    { label: "Mild", emoji: "🙂", value: "mild" },
    { label: "Moderate", emoji: "😐", value: "moderate" },
    { label: "Severe", emoji: "😟", value: "severe" },
];

export default function SeveritySelector({
    onSelect,
    initialValue = null,
}: {
    onSelect: (value: SeverityOption["value"]) => void;
    initialValue?: SeverityOption["value"] | null;
}) {
    const [selected, setSelected] = useState(initialValue);

    useEffect(() => {
        setSelected(initialValue);
    }, [initialValue]);

    const handleSelect = (value: SeverityOption["value"]) => {
        setSelected(value);
        onSelect(value);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Severity Level</Text>
            <View style={styles.options}>
                {options.map((opt) => {
                    const isSelected = selected === opt.value;
                    return (
                        <TouchableOpacity
                            key={opt.value}
                            onPress={() => handleSelect(opt.value)}
                            style={[
                                styles.option,
                                isSelected && styles.selectedOption,
                            ]}
                        >
                            <Text style={styles.emoji}>{opt.emoji}</Text>
                            <Text
                                style={[
                                    styles.text,
                                    isSelected && styles.selectedText,
                                ]}
                            >
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E293B",
        marginBottom: 8,
    },
    options: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    option: {
        alignItems: "center",
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#E2E8F0",
        width: 90,
    },
    selectedOption: {
        backgroundColor: "#1E40AF",
    },
    emoji: {
        fontSize: 24,
        marginBottom: 4,
    },
    text: {
        fontSize: 14,
        fontWeight: "500",
        color: "#1E293B",
    },
    selectedText: {
        color: "#FFFFFF",
    },
});
