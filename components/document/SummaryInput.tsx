import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const WORD_LIMIT = 250;

export default function SummaryInput({
    value,
    onChange,
}: {
    value: string;
    onChange: (text: string) => void;
}) {
    const [height, setHeight] = useState(100);

    const handleTextChange = (text: string) => {
        const wordCount = text.trim().split(/\s+/).length;
        if (wordCount <= WORD_LIMIT) {
            onChange(text);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Summary (optional)</Text>
            <TextInput
                placeholder="Describe what happened..."
                value={value}
                onChangeText={handleTextChange}
                multiline
                onContentSizeChange={(e) =>
                    setHeight(e.nativeEvent.contentSize.height)
                }
                style={[styles.input, { height: Math.max(100, height) }]}
                textAlignVertical="top"
            />
            <Text style={styles.wordCount}>
                {value.trim().split(/\s+/).filter(Boolean).length}/{WORD_LIMIT} words
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        padding: 12,
        fontSize: 16,
        color: '#1E293B',
    },
    wordCount: {
        marginTop: 4,
        fontSize: 12,
        color: '#64748B',
        textAlign: 'right',
    },
});
