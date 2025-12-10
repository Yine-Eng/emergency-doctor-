import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
    value: string;
    onChangeText: (text: string) => void;
    onSubmit: () => void;
    placeholder?: string;
};

export default function SearchBar({
    value,
    onChangeText,
    onSubmit,
    placeholder,
}: Props) {
    return (
        <View style={styles.searchRow}>
            <TextInput
                placeholder={placeholder || "Search..."}
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmit}
                returnKeyType="search"
            />
            <TouchableOpacity
                style={styles.searchBtn}
                onPress={onSubmit}
                accessibilityLabel="Search"
            >
                <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
        justifyContent: "center",
        alignItems: "center",
    },
});
