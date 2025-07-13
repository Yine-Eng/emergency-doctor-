import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const BODY_PARTS = [
    'Head', 'Neck', 'Chest', 'Abdomen', 'Back', 'Pelvis',
    'Left Arm', 'Right Arm', 'Left Hand', 'Right Hand',
    'Left Leg', 'Right Leg', 'Left Foot', 'Right Foot',
];

export default function BodyPartSelector({
    selectedParts,
    setSelectedParts,
}: {
    selectedParts: string[];
    setSelectedParts: (parts: string[]) => void;
}) {
    const togglePart = (part: string) => {
        if (selectedParts.includes(part)) {
            setSelectedParts(selectedParts.filter((p) => p !== part));
        } else {
            setSelectedParts([...selectedParts, part]);
        }
    };

    const renderItem = ({ item }: { item: string }) => {
        const isSelected = selectedParts.includes(item);
        return (
            <TouchableOpacity
                style={[styles.item, isSelected && styles.selectedItem]}
                onPress={() => togglePart(item)}
            >
                <Text style={[styles.itemText, isSelected && styles.selectedText]}>
                    {item}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Injured Body Parts</Text>
            <FlatList
                data={BODY_PARTS}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                numColumns={3}
                contentContainerStyle={styles.grid}
                scrollEnabled={false}
            />
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
        marginBottom: 10,
    },
    grid: {
        gap: 10,
    },
    item: {
        flex: 1,
        margin: 5,
        paddingVertical: 14,
        backgroundColor: '#F1F5F9',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedItem: {
        backgroundColor: '#1E40AF',
    },
    itemText: {
        fontSize: 14,
        color: '#1E293B',
    },
    selectedText: {
        color: '#FFF',
        fontWeight: '600',
    },
});
