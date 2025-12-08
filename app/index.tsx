import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Landing() {
    const router = useRouter();

    const features = [
        {
            icon: 'alert-circle',
            title: 'Emergency Alerts',
            description: 'Notify contacts or emergency services in seconds.',
        },
        {
            icon: 'body',
            title: 'Injury Reporting',
            description: 'Log and share injuries using guided diagrams.',
        },
        {
            icon: 'people',
            title: 'Family Awareness',
            description: 'Keep loved ones informed during critical moments.',
        },
        {
            icon: 'location',
            title: 'Smart Location Sharing',
            description: 'Share location when it matters most.',
        },
        {
            icon: 'lock-closed',
            title: 'Your Data, Protected',
            description: 'We respect your privacy and encrypt your data.',
        },
    ];

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <LottieView
                source={require('../assets/animations/emergency-intro.json')}
                autoPlay
                loop
                style={styles.lottie}
            />

            <Text style={styles.title}>Emergencies happen. Be prepared.</Text>
            <Text style={styles.subtitle}>
                Emergency Doctor ensures you get help, stay connected, and feel safe — always.
            </Text>

            <View style={styles.featuresContainer}>
                {features.map((feature, index) => (
                    <View key={index} style={styles.featureCard}>
                        <Ionicons name={feature.icon as any} size={24} color="#1E3A8A" />
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>{feature.title}</Text>
                            <Text style={styles.featureDesc}>{feature.description}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.ctaButton} onPress={() => router.replace('/SignUp')}>
                <Text style={styles.ctaText}>Get Started</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
    },
    lottie: {
        width: 250,
        height: 250,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#334155',
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    featuresContainer: {
        width: '100%',
        marginBottom: 30,
    },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
    featureText: {
        marginLeft: 10,
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
    },
    featureDesc: {
        fontSize: 14,
        color: '#475569',
    },
    ctaButton: {
        backgroundColor: '#1E40AF',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
        alignItems: 'center',
    },
    ctaText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
