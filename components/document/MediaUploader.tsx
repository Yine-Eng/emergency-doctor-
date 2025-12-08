import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function MediaUploader({
    mediaFiles,
    setMediaFiles,
}: {
    mediaFiles: string[];
    setMediaFiles: (files: string[]) => void;
}) {
    const pickMedia = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Permission is required to access media.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            quality: 0.7,
            allowsMultipleSelection: false,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            if (mediaFiles.length < 4) {
                setMediaFiles([...mediaFiles, uri]);
            } else {
                Alert.alert(
                    "Limit Reached",
                    "You can only upload up to 4 items."
                );
            }
        }
    };

    const removeMedia = (uriToRemove: string) => {
        setMediaFiles(mediaFiles.filter((uri) => uri !== uriToRemove));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Attach Media (optional)</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scroll}
            >
                {mediaFiles.map((uri, index) => (
                    <View key={index} style={styles.previewWrapper}>
                        <Image source={{ uri }} style={styles.preview} />
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeMedia(uri)}
                        >
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color="#EF4444"
                            />
                        </TouchableOpacity>
                    </View>
                ))}
                {mediaFiles.length < 4 && (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={pickMedia}
                    >
                        <Ionicons name="add" size={28} color="#1E40AF" />
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E293B",
        marginBottom: 8,
    },
    scroll: {
        flexDirection: "row",
    },
    previewWrapper: {
        marginRight: 10,
        position: "relative",
    },
    preview: {
        width: 100,
        height: 100,
        borderRadius: 10,
        backgroundColor: "#E2E8F0",
    },
    removeButton: {
        position: "absolute",
        top: -6,
        right: -6,
        backgroundColor: "#FFF",
        borderRadius: 12,
    },
    addButton: {
        width: 100,
        height: 100,
        borderRadius: 10,
        backgroundColor: "#F1F5F9",
        justifyContent: "center",
        alignItems: "center",
    },
});
