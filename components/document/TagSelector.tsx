import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TAGS = [
    "Burn",
    "Fracture",
    "Bleeding",
    "Car Accident",
    "Head Injury",
    "Fall",
    "Allergic Reaction",
    "Heart Issue",
    "Poisoning",
];

export default function TagSelector({
    selectedTags,
    onChange,
}: {
    selectedTags: string[];
    onChange: (updated: string[]) => void;
}) {
    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            onChange(selectedTags.filter((t) => t !== tag));
        } else {
            onChange([...selectedTags, tag]);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Tags</Text>
            <View style={styles.tagContainer}>
                {TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                        <TouchableOpacity
                            key={tag}
                            onPress={() => toggleTag(tag)}
                            style={[
                                styles.tag,
                                isSelected && styles.selectedTag,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tagText,
                                    isSelected && styles.selectedTagText,
                                ]}
                            >
                                {tag}
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
    tagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    tag: {
        backgroundColor: "#E2E8F0",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    selectedTag: {
        backgroundColor: "#1E40AF",
    },
    tagText: {
        fontSize: 14,
        color: "#1E293B",
    },
    selectedTagText: {
        color: "white",
    },
});
