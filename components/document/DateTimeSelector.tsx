import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function DateTimeSelector({
    date,
    onChange,
}: {
    date: Date;
    onChange: (newDate: Date) => void;
}) {
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState<"date" | "time">("date");

    const showPicker = (type: "date" | "time") => {
        setMode(type);
        setShow(true);
    };

    const handleChange = (_event: any, selectedDate?: Date) => {
        setShow(Platform.OS === "ios");
        if (selectedDate) {
            const newDate = new Date(date);
            if (mode === "date") {
                newDate.setFullYear(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate()
                );
            } else {
                newDate.setHours(
                    selectedDate.getHours(),
                    selectedDate.getMinutes()
                );
            }
            onChange(newDate);
        }
    };

    const formatDate = (d: Date) =>
        `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })}`;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>When did this happen? (optional)</Text>
            <View style={styles.row}>
                <Ionicons name="calendar-outline" size={20} color="#1E40AF" />
                <Text style={styles.dateText}>{formatDate(date)}</Text>
            </View>
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => showPicker("date")}
                >
                    <Text style={styles.buttonText}>Change Date</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => showPicker("time")}
                >
                    <Text style={styles.buttonText}>Change Time</Text>
                </TouchableOpacity>
            </View>

            {show && (
                <DateTimePicker
                    value={date}
                    mode={mode}
                    display="default"
                    onChange={handleChange}
                />
            )}
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
        marginBottom: 6,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    dateText: {
        marginLeft: 6,
        fontSize: 16,
        color: "#1E293B",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        backgroundColor: "#1E40AF",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 14,
    },
});
