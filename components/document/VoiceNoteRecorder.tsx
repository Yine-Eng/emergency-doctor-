import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VoiceNoteRecorder({
    onRecordingComplete,
}: {
    onRecordingComplete?: (uri: string | null) => void;
}) {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [uri, setUri] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const recordingRef = useRef<Audio.Recording | null>(null);

    useEffect(() => {
        return sound
            ? () => {
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

    const startRecording = async () => {
        try {
            const { granted } = await Audio.requestPermissionsAsync();
            if (!granted) {
                alert("Permission to access microphone is required!");
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            recordingRef.current = recording;
            setRecording(recording);
            setIsRecording(true);
        } catch (err) {
            console.error("Failed to start recording", err);
        }
    };

    const stopRecording = async () => {
        try {
            const recording = recordingRef.current;
            if (!recording) return;

            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setUri(uri || null);
            setRecording(null);
            setIsRecording(false);
            recordingRef.current = null;

            onRecordingComplete?.(uri || null);
        } catch (err) {
            console.error("Failed to stop recording", err);
        }
    };

    const togglePlayback = async () => {
        if (!uri) return;

        if (isPlaying) {
            await sound?.pauseAsync();
            setIsPlaying(false);
        } else {
            const { sound: playbackObject } = await Audio.Sound.createAsync({
                uri,
            });
            setSound(playbackObject);

            playbackObject.setOnPlaybackStatusUpdate((status) => {
                if (!status.isLoaded) return;
                if (status.didJustFinish) setIsPlaying(false);
            });

            await playbackObject.playAsync();
            setIsPlaying(true);
        }
    };

    const deleteRecording = () => {
        setUri(null);
        setSound(null);
        onRecordingComplete?.(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Voice Note</Text>

            {uri ? (
                <View style={styles.controls}>
                    <TouchableOpacity
                        onPress={togglePlayback}
                        style={styles.iconButton}
                    >
                        <Ionicons
                            name={isPlaying ? "pause" : "play"}
                            size={28}
                            color="#1E40AF"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={deleteRecording}
                        style={styles.iconButton}
                    >
                        <Ionicons name="trash" size={28} color="red" />
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    onPress={isRecording ? stopRecording : startRecording}
                    style={styles.recordButton}
                >
                    <Ionicons
                        name={isRecording ? "stop" : "mic"}
                        size={28}
                        color="#fff"
                    />
                    <Text style={styles.recordText}>
                        {isRecording ? "Stop" : "Record"}
                    </Text>
                </TouchableOpacity>
            )}
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
    controls: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    iconButton: {
        backgroundColor: "#E2E8F0",
        padding: 12,
        borderRadius: 50,
    },
    recordButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1E40AF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    recordText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
        marginLeft: 8,
    },
});
