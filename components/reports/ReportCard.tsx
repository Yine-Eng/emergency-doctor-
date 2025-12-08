import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Alert,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ReportCardProps {
    id: string;
    title: string;
    date: string;
    isDraft?: boolean;
    onDelete: (id: string) => void;
    onEdit?: (id: string) => void;
}

export default function ReportCard({
    id,
    title,
    date,
    isDraft = false,
    onDelete,
    onEdit,
}: ReportCardProps) {
    const router = useRouter();

    const handleEdit = () => {
        if (onEdit) {
            onEdit(id);
        } else {
            router.push({ pathname: "/Document", params: { id } });
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Report",
            "Are you sure you want to delete this report?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => onDelete(id),
                },
            ]
        );
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Here is my emergency report: https://emergencydoc.app/reports/${id}`,
            });
        } catch (error) {
            console.error("Error sharing report:", error);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.date}>{date}</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={handleEdit}
                    style={styles.iconButton}
                >
                    <Ionicons name="create-outline" size={20} color="#1E40AF" />
                    <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>

                {!isDraft && (
                    <TouchableOpacity
                        onPress={handleShare}
                        style={styles.iconButton}
                    >
                        <Ionicons
                            name="share-social-outline"
                            size={20}
                            color="#1E40AF"
                        />
                        <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={handleDelete}
                    style={styles.iconButton}
                >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    <Text style={[styles.actionText, { color: "#EF4444" }]}>
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E293B",
    },
    date: {
        fontSize: 14,
        color: "#64748B",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    iconButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    actionText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#1E40AF",
    },
});
