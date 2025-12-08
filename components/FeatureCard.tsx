import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';


interface FeatureCardProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    to: string;
}

// const screenWidth = Dimensions.get('window').width;
// const cardWidth = (screenWidth - 40) / 2;

export default function FeatureCard({ title, icon, to }: FeatureCardProps) {
    const router = useRouter();

    return (
        <TouchableOpacity style={styles.card} onPress={() => router.push(to as any)}>
            <Ionicons name={icon} size={32} color="#1E40AF" />
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        // width: cardWidth,
        width: '48%',
        aspectRatio: 1,
        marginBottom: 16,
        backgroundColor: '#FFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 3,
    },
    title: {
        marginTop: 8,
        fontSize: 14,
        textAlign: 'center',
        color: '#1E293B',
        fontWeight: '500',
    },
});
