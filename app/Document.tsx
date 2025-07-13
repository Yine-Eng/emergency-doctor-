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
import { fetchWithAuthDirect } from "@/utils/fetchWithAuth";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
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
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigatingAway, setIsNavigatingAway] = useState(false);
    const [isReturningToEdit, setIsReturningToEdit] = useState(false);

    // Cache functions for unsaved changes
    const getCacheKey = () => `unsaved_changes_${id || "new"}`;

    const saveToCache = async () => {
        const cacheData = {
            summary,
            selectedBodyParts,
            location,
            voiceNote,
            mediaFiles,
            severity,
            selectedTags,
            incidentDateTime: incidentDateTime.toISOString(),
            timestamp: Date.now(),
        };
        await SecureStore.setItemAsync(
            getCacheKey(),
            JSON.stringify(cacheData)
        );
        console.log("Saved to cache:", cacheData);
    };

    const loadFromCache = async () => {
        try {
            const cached = await SecureStore.getItemAsync(getCacheKey());
            if (cached) {
                const data = JSON.parse(cached);
                console.log("Loaded from cache:", data);
                setSummary(data.summary || "");
                setSelectedBodyParts(data.selectedBodyParts || []);
                setLocation(data.location);
                setVoiceNote(data.voiceNote);
                setMediaFiles(data.mediaFiles || []);
                setSeverity(data.severity);
                setSelectedTags(data.selectedTags || []);
                setIncidentDateTime(new Date(data.incidentDateTime));
                return true;
            }
        } catch (error) {
            console.error("Error loading from cache:", error);
        }
        return false;
    };

    const clearCache = async () => {
        await SecureStore.deleteItemAsync(getCacheKey());
        console.log("Cache cleared");
    };

    const hasChanges = () => {
        console.log("=== Checking for changes ===");
        console.log("Original report:", originalReport);
        console.log("Current state:", {
            summary,
            selectedBodyParts,
            location,
            voiceNote,
            mediaFiles,
            severity,
            selectedTags,
            incidentDateTime: incidentDateTime.toISOString(),
        });

        if (!originalReport) {
            const hasData =
                summary ||
                selectedBodyParts.length ||
                voiceNote ||
                mediaFiles.length ||
                severity ||
                selectedTags.length;
            console.log("No original report, has data:", hasData);
            return hasData;
        }

        // Handle both old and new field names for comparison
        const originalBodyParts =
            originalReport.bodyParts || originalReport.selectedBodyParts || [];
        const originalMedia =
            originalReport.media || originalReport.mediaUrls || [];
        const originalVoiceNote =
            originalReport.voiceNote || originalReport.voiceNoteUrl;

        const changes = {
            summary: summary !== originalReport.summary,
            bodyParts:
                JSON.stringify(selectedBodyParts) !==
                JSON.stringify(originalBodyParts),
            location:
                JSON.stringify(location) !==
                JSON.stringify(originalReport.location),
            voiceNote: voiceNote !== originalVoiceNote,
            media: JSON.stringify(mediaFiles) !== JSON.stringify(originalMedia),
            severity: severity !== originalReport.severity,
            tags:
                JSON.stringify(selectedTags) !==
                JSON.stringify(originalReport.tags || []),
            dateTime:
                incidentDateTime.toISOString() !==
                new Date(originalReport.incidentDateTime).toISOString(),
        };

        const hasChanges = Object.values(changes).some((change) => change);
        console.log("Change detection:", changes);
        console.log("Has changes:", hasChanges);

        return hasChanges;
    };

    const resetForm = () => {
        setSummary("");
        setSelectedBodyParts([]);
        setVoiceNote(null);
        setMediaFiles([]);
        setSeverity(null);
        setSelectedTags([]);
        setIncidentDateTime(new Date());
        setLocation(null);
    };

    const handleStartFresh = async () => {
        await clearCache();
        resetForm();
        setOriginalReport(null);
        setIsReturningToEdit(false);
    };

    useEffect(() => {
        const fetchReport = async () => {
            if (!id) {
                // For new reports, try to load from cache
                const hasCached = await loadFromCache();
                if (hasCached && !isReturningToEdit) {
                    Alert.alert(
                        "Unsaved Changes Found",
                        "We found unsaved changes from your previous session. Would you like to continue editing?",
                        [
                            {
                                text: "Start Fresh",
                                style: "destructive",
                                onPress: handleStartFresh,
                            },
                            {
                                text: "Continue Editing",
                                style: "default",
                                onPress: () => {},
                            },
                        ]
                    );
                }
                // Reset the flag after checking
                setIsReturningToEdit(false);
                return;
            }

            setIsLoading(true);
            try {
                console.log("Fetching report with ID:", id);
                const res = await fetchWithAuthDirect(
                    `${API_ENDPOINTS.REPORTS}/${id}`
                );
                console.log("Response status:", res.status);
                console.log("Response ok:", res.ok);

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("Error response:", errorText);
                    throw new Error(`HTTP ${res.status}: ${errorText}`);
                }

                const data = await res.json();
                console.log("Report data:", data);
                setOriginalReport(data);
                setSummary(data.summary);
                // Handle both old and new field names for backward compatibility
                setSelectedBodyParts(
                    data.bodyParts || data.selectedBodyParts || []
                );
                setLocation(data.location);
                setVoiceNote(data.voiceNote || data.voiceNoteUrl);
                setMediaFiles(data.media || data.mediaUrls || []);
                setSeverity(data.severity);
                setSelectedTags(data.tags || []);
                setIncidentDateTime(new Date(data.incidentDateTime));
            } catch (err) {
                console.error("Failed to fetch report for editing:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReport();

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                console.log("Hardware back button pressed");
                if (hasChanges() && !isNavigatingAway) {
                    Alert.alert(
                        "Unsaved Changes",
                        "You have unsaved changes. What would you like to do?",
                        [
                            {
                                text: "Keep Editing",
                                style: "cancel",
                                onPress: () => {},
                            },
                            {
                                text: "Save as Draft",
                                style: "default",
                                onPress: () => {
                                    setIsNavigatingAway(true);
                                    handleSaveDraft();
                                },
                            },
                            {
                                text: "Discard Changes",
                                style: "destructive",
                                onPress: () => {
                                    setIsNavigatingAway(true);
                                    clearCache();
                                    resetForm();
                                    router.back();
                                },
                            },
                        ]
                    );
                    return true;
                }
                return false;
            }
        );

        return () => backHandler.remove();
    }, [id, isReturningToEdit]);

    // Save to cache when changes are made
    useEffect(() => {
        if (
            !isLoading &&
            (summary ||
                selectedBodyParts.length ||
                voiceNote ||
                mediaFiles.length ||
                severity ||
                selectedTags.length)
        ) {
            saveToCache();
        }
    }, [
        summary,
        selectedBodyParts,
        location,
        voiceNote,
        mediaFiles,
        severity,
        selectedTags,
        incidentDateTime,
        isLoading,
    ]);

    // Handle navigation away from screen
    useFocusEffect(
        useCallback(() => {
            
            return () => {
                console.log("Screen losing focus, isNavigatingAway:", isNavigatingAway);
                if (hasChanges() && !isNavigatingAway) {
                    Alert.alert(
                        "Unsaved Changes",
                        "You have unsaved changes. What would you like to do?",
                        [
                            {
                                text: "Keep Editing",
                                style: "cancel",
                                onPress: () => {
                                    setIsNavigatingAway(true);
                                    setIsReturningToEdit(true);
                                    setTimeout(() => {
                                        router.push("/Document");
                                        setIsNavigatingAway(false);
                                    }, 100);
                                },
                            },
                            {
                                text: "Save as Draft",
                                style: "default",
                                onPress: () => {
                                    setIsNavigatingAway(true);
                                    handleSaveDraft();
                                },
                            },
                            {
                                text: "Discard Changes",
                                style: "destructive",
                                onPress: () => {
                                    // User chose to discard, so we can clear cache and stay on current screen
                                    setIsNavigatingAway(true);
                                    clearCache();
                                    resetForm();
                                    setIsNavigatingAway(false);
                                },
                            },
                        ]
                    );
                }
            };
        }, [
            summary,
            selectedBodyParts,
            location,
            voiceNote,
            mediaFiles,
            severity,
            selectedTags,
            incidentDateTime,
            isNavigatingAway,
        ])
    );

    const handleSubmitReport = async () => {
        try {
            const res = await fetchWithAuthDirect(
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
                await clearCache(); // Clear cache after successful save
                resetForm();
                setIsNavigatingAway(false);
                router.push("/SavedReports");
            } else {
                const data = await res.json();
                console.error("Submit failed:", data.message);
                setIsNavigatingAway(false);
            }
        } catch (err) {
            console.error("Error submitting report:", err);
            setIsNavigatingAway(false);
        }
    };

    const handleSaveDraft = async () => {
        try {
            const res = await fetchWithAuthDirect(
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
                await clearCache(); // Clear cache after successful save
                resetForm();
                setIsNavigatingAway(false);
                router.push("/SavedReports");
            } else {
                const data = await res.json();
                console.error("Save draft failed:", data.message);
                setIsNavigatingAway(false);
            }
        } catch (err) {
            console.error("Error saving draft:", err);
            setIsNavigatingAway(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading report...</Text>
                </View>
            ) : (
                <>
                    <View style={styles.intro}>
                        <Text style={styles.title}>Record an Incident</Text>
                        <Text style={styles.description}>
                            Fill in as much information as you can. You can find
                            your saved reports and drafts in the "Saved Reports"
                            section of the Discover tab. You can also share them
                            from there.
                        </Text>
                    </View>
                    <SummaryInput value={summary} onChange={setSummary} />
                    <BodyPartSelector
                        selectedParts={selectedBodyParts}
                        setSelectedParts={setSelectedBodyParts}
                    />
                    <LocationDisplay />
                    <VoiceNoteRecorder
                        onRecordingComplete={setVoiceNote}
                        initialValue={voiceNote}
                    />
                    <MediaUploader
                        mediaFiles={mediaFiles}
                        setMediaFiles={setMediaFiles}
                    />
                    <SeveritySelector
                        onSelect={setSeverity}
                        initialValue={severity}
                    />
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
                </>
            )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
    },
    loadingText: {
        fontSize: 18,
        color: "#475569",
    },
});
