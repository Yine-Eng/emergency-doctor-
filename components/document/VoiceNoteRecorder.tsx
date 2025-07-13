import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function VoiceNoteRecorder({
    onRecordingComplete,
    initialValue = null,
}: {
    onRecordingComplete?: (uri: string | null) => void;
    initialValue?: string | null;
}) {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [uri, setUri] = useState<string | null>(initialValue);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const recordingRef = useRef<Audio.Recording | null>(null);

    const MAX_DURATION = 300;
    const [recordDuration, setRecordDuration] = useState(MAX_DURATION);
    const durationIntervalRef = useRef<number | null>(null);

    // Update uri when initialValue changes
    useEffect(() => {
        setUri(initialValue);
    }, [initialValue]);

    useEffect(() => {
        return sound
            ? () => {
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.3,
                        duration: 500,
                        useNativeDriver: true,
                        easing: Easing.ease,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                        easing: Easing.ease,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.stopAnimation();
        }
    }, [isRecording]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
            2,
            "0"
        )}`;
    };

    const startRecording = async () => {
        try {
            const { granted } = await Audio.requestPermissionsAsync();
            if (!granted) {
                alert("Permission to access microphone is required!");
                return;
            }

            setRecordDuration(MAX_DURATION);
            durationIntervalRef.current = setInterval(() => {
                setRecordDuration((prev) => {
                    if (prev <= 1) {
                        stopRecording(); // auto-stop
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

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
            setSound(null);
            setIsRecording(false);
            setIsPlaying(false);
            recordingRef.current = null;

            if (durationIntervalRef.current) {
                clearInterval(durationIntervalRef.current);
                durationIntervalRef.current = null;
            }

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
            if (sound) {
                await sound.unloadAsync();
                setSound(null);
            }

            const { sound: playbackObject } = await Audio.Sound.createAsync({
                uri,
            });
            setSound(playbackObject);

            playbackObject.setOnPlaybackStatusUpdate((status) => {
                if (!status.isLoaded) return;
                if (status.didJustFinish) {
                    setIsPlaying(false);
                    playbackObject.unloadAsync();
                    setSound(null);
                }
            });

            await playbackObject.playAsync();
            setIsPlaying(true);
        }
    };

    const deleteRecording = () => {
        setUri(null);
        setSound(null);
        setIsPlaying(false);
        onRecordingComplete?.(null);

        setRecordDuration(0);
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Voice Note</Text>

            {uri ? (
                <View style={styles.controls}>
                    <TouchableOpacity
                        onPress={togglePlayback}
                        style={styles.iconWrapper}
                    >
                        <Ionicons
                            name={isPlaying ? "pause" : "play"}
                            size={28}
                            color="#1E40AF"
                        />
                        <Text style={styles.controlLabel}>
                            {isPlaying ? "Pause" : "Play"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={deleteRecording}
                        style={styles.iconWrapper}
                    >
                        <Ionicons name="trash" size={28} color="red" />
                        <Text style={styles.controlLabel}>Delete</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    onPress={isRecording ? stopRecording : startRecording}
                    style={styles.recordButton}
                >
                    {isRecording ? (
                        <View style={styles.recordRow}>
                            <Animated.View
                                style={[
                                    styles.pulseCircle,
                                    { transform: [{ scale: pulseAnim }] },
                                ]}
                            />
                            <View style={styles.recordContent}>
                                <Ionicons name="stop" size={28} color="#fff" />
                                <Text style={styles.recordText}>Stop</Text>
                            </View>
                            <Text style={styles.durationText}>
                                {formatDuration(recordDuration)}
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.recordContent}>
                            <Ionicons name="mic" size={28} color="#fff" />
                            <Text style={styles.recordText}>Record</Text>
                        </View>
                    )}
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
    recordButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1E40AF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        overflow: "hidden",
    },
    pulseCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#F87171",
        marginRight: 12,
    },
    recordContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    recordText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
        marginLeft: 8,
    },
    controls: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "space-between",
    },
    recordRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
    durationText: {
        color: "#FFF",
        fontWeight: "500",
        fontSize: 14,
    },
    iconWrapper: {
        flex: 1,
        backgroundColor: "#E2E8F0",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    controlLabel: {
        fontSize: 12,
        color: "#1E293B",
        fontWeight: "500",
        marginTop: 4,
    },
});
