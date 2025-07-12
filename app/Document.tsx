import BodyPartSelector from "@/components/document/BodyPartSelector";
import DateTimeSelector from "@/components/document/DateTimeSelector";
import LocationDisplay from "@/components/document/LocationDisplay";
import MediaUploader from "@/components/document/MediaUploader";
import SeveritySelector from "@/components/document/SeveritySelector";
import SubmitBar from "@/components/document/SubmitBar";
import SummaryInput from "@/components/document/SummaryInput";
import TagSelector from "@/components/document/TagSelector";
import VoiceNoteRecorder from "@/components/document/VoiceNoteRecorder";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Document() {
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

    const handleSubmitReport = () => {
        setSummary("");
        setSelectedBodyParts([]);
        setVoiceNote(null);
        setMediaFiles([]);
        setSeverity(null);
        setSelectedTags([]);
        setIncidentDateTime(new Date());
    };

    const handleSaveDraft = () => {};

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
