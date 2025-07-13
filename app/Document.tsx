import BodyPartSelector from "@/components/document/BodyPartSelector";
import DateTimeSelector from "@/components/document/DateTimeSelector";
import LocationDisplay from "@/components/document/LocationDisplay";
import MediaUploader from "@/components/document/MediaUploader";
import SeveritySelector from "@/components/document/SeveritySelector";
import SubmitBar from "@/components/document/SubmitBar";
import SummaryInput from "@/components/document/SummaryInput";
import TagSelector from "@/components/document/TagSelector";
import VoiceNoteRecorder from "@/components/document/VoiceNoteRecorder";
import { API_ENDPOINTS } from "@/constants/ApiConfig";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    BackHandler,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function Document() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [summary, setSummary] = useState("");
    const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);
    const [location, setLocation] = useState(null);
    const [voiceNote, setVoiceNote] = useState<string | null>(null);
    const [mediaFiles, setMediaFiles] = useState<string[]>([]);
    const [severity, setSeverity] = useState<
        "mild" | "moderate" | "severe" | null
    >(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [incidentDateTime, setIncidentDateTime] = useState<Date>(new Date());
    const [originalReport, setOriginalReport] = useState<any>(null);

    const hasChanges = () => {
        if (!originalReport)
            return (
                summary ||
                selectedBodyParts.length ||
                voiceNote ||
                mediaFiles.length ||
                severity ||
                selectedTags.length
            );
        return (
            summary !== originalReport.summary ||
            JSON.stringify(selectedBodyParts) !==
                JSON.stringify(originalReport.bodyParts) ||
            location !== originalReport.location ||
            voiceNote !== originalReport.voiceNote ||
            JSON.stringify(mediaFiles) !==
                JSON.stringify(originalReport.media) ||
            severity !== originalReport.severity ||
            JSON.stringify(selectedTags) !==
                JSON.stringify(originalReport.tags) ||
            incidentDateTime.toISOString() !==
                new Date(originalReport.incidentDateTime).toISOString()
        );
    };

    useEffect(() => {
        const fetchReport = async () => {
            if (!id) return;
            try {
                const res = await fetchWithAuth(
                    `${API_ENDPOINTS.REPORTS}/${id}`
                );
                const data = await res.json();
                setOriginalReport(data);
                setSummary(data.summary);
                setSelectedBodyParts(data.bodyParts || []);
                setLocation(data.location);
                setVoiceNote(data.voiceNote);
                setMediaFiles(data.media || []);
                setSeverity(data.severity);
                setSelectedTags(data.tags || []);
                setIncidentDateTime(new Date(data.incidentDateTime));
            } catch (err) {
                console.error("Failed to fetch report for editing:", err);
            }
        };
        fetchReport();

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                if (hasChanges()) {
                    Alert.alert(
                        "Unsaved Changes",
                        "You have unsaved changes. Do you want to discard them?",
                        [
                            {
                                text: "Cancel",
                                style: "cancel",
                                onPress: () => {},
                            },
                            {
                                text: "Discard",
                                style: "destructive",
                                onPress: () => router.back(),
                            },
                        ]
                    );
                    return true;
                }
                return false;
            }
        );

        return () => backHandler.remove();
    }, [
        id,
        summary,
        selectedBodyParts,
        location,
        voiceNote,
        mediaFiles,
        severity,
        selectedTags,
        incidentDateTime,
    ]);

    const resetForm = () => {
        setSummary("");
        setSelectedBodyParts([]);
        setVoiceNote(null);
        setMediaFiles([]);
        setSeverity(null);
        setSelectedTags([]);
        setIncidentDateTime(new Date());
    };

    const handleSubmitReport = async () => {
        try {
            const res = await fetchWithAuth(
                `${API_ENDPOINTS.REPORTS}${id ? `/${id}` : ""}`,
                {
                    method: id ? "PUT" : "POST",
                    body: JSON.stringify({
                        title: summary.slice(0, 50) || "Untitled Report",
                        summary,
                        bodyParts: selectedBodyParts,
                        location,
                        voiceNote,
                        media: mediaFiles,
                        severity,
                        tags: selectedTags,
                        incidentDateTime,
                        isDraft: false,
                    }),
                }
            );

            if (res.ok) {
                console.log("Report submitted successfully.");
                resetForm();
                router.push("/SavedReports");
            } else {
                const data = await res.json();
                console.error("Submit failed:", data.message);
            }
        } catch (err) {
            console.error("Error submitting report:", err);
        }
    };

    const handleSaveDraft = async () => {
        try {
            const res = await fetchWithAuth(
                `${API_ENDPOINTS.REPORTS}${id ? `/${id}` : ""}`,
                {
                    method: id ? "PUT" : "POST",
                    body: JSON.stringify({
                        title: summary.slice(0, 50) || "Untitled Draft",
                        summary,
                        bodyParts: selectedBodyParts,
                        location,
                        voiceNote,
                        media: mediaFiles,
                        severity,
                        tags: selectedTags,
                        incidentDateTime,
                        isDraft: true,
                    }),
                }
            );

            if (res.ok) {
                console.log("Draft saved successfully.");
                resetForm();
                router.push("/SavedReports");
            } else {
                const data = await res.json();
                console.error("Save draft failed:", data.message);
            }
        } catch (err) {
            console.error("Error saving draft:", err);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.intro}>
                <Text style={styles.title}>Record an Incident</Text>
                <Text style={styles.description}>
                    Fill in as much information as you can. You can find your
                    saved reports and drafts in the “Saved Reports” section of
                    the Discover tab. You can also share them from there.
                </Text>
            </View>
            <SummaryInput value={summary} onChange={setSummary} />
            <BodyPartSelector
                selectedParts={selectedBodyParts}
                setSelectedParts={setSelectedBodyParts}
            />
            <LocationDisplay />
            <VoiceNoteRecorder onRecordingComplete={setVoiceNote} />
            <MediaUploader
                mediaFiles={mediaFiles}
                setMediaFiles={setMediaFiles}
            />
            <SeveritySelector onSelect={setSeverity} initialValue={severity} />
            <TagSelector
                selectedTags={selectedTags}
                onChange={setSelectedTags}
            />
            <DateTimeSelector
                date={incidentDateTime}
                onChange={setIncidentDateTime}
            />
            <SubmitBar
                summary={summary}
                selectedBodyParts={selectedBodyParts}
                media={mediaFiles}
                tags={selectedTags}
                voiceNote={voiceNote}
                onSubmit={handleSubmitReport}
                onSaveDraft={handleSaveDraft}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: "#F8FAFC",
    },
    intro: {
        marginBottom: 20,
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
        lineHeight: 20,
    },
});
