import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SubmitBarProps {
    summary: string;
    selectedBodyParts: string[];
    media: string[];
    tags: string[];
    voiceNote: string | null;
    onSubmit: () => void;
    onSaveDraft: () => void;
}

export default function SubmitBar({
    summary,
    selectedBodyParts,
    media,
    tags,
    voiceNote,
    onSubmit,
    onSaveDraft,
}: SubmitBarProps) {
    const isValid =
        summary.trim().length > 0 ||
        selectedBodyParts.length > 0 ||
        media.length > 0 ||
        tags.length > 0 ||
        !!voiceNote;

    const handleDraft = () => {
        if (!isValid) {
            Alert.alert(
                "Draft not saved",
                "Please fill in some information to save."
            );
            return;
        }

        onSaveDraft();
        Alert.alert(
            "Draft Saved",
            "You can find it in the Saved Reports screen."
        );
    };

    const handleSubmit = () => {
        if (!isValid) {
            Alert.alert(
                "Submission Incomplete",
                "Please add at least one detail to report."
            );
            return;
        }

        onSubmit();
        Alert.alert(
            "Report Submitted",
            "Your report has been successfully saved."
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, styles.draftButton]}
                onPress={handleDraft}
                disabled={!isValid}
            >
                <Text
                    style={[
                        styles.buttonText,
                        !isValid ? styles.disabledText : styles.draftTextActive,
                    ]}
                >
                    Save as Draft
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.button,
                    isValid ? styles.submitButton : styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={!isValid}
            >
                <Text style={styles.buttonText}>Submit Report</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        paddingHorizontal: 16,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: "center",
    },
    draftButton: {
        backgroundColor: "#E5E7EB",
    },
    submitButton: {
        backgroundColor: "#1E40AF",
    },
    disabledButton: {
        backgroundColor: "#CBD5E1",
    },
    buttonText: {
        fontWeight: "600",
        fontSize: 16,
        color: "#FFF",
    },
    disabledText: {
        color: "#94A3B8",
    },
    draftTextActive: {
        color: "#1E40AF",
    },
});
