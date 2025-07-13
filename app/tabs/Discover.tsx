import FeatureCard from '@/components/FeatureCard';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Discover() {
    const features = [
        { title: 'Document Injury', icon: 'document-text-outline', to: '/Document' as any },
        { title: 'Emergency Contacts', icon: 'people-outline', to: '/EmergencyContacts' as any },
        { title: 'Alerts', icon: 'alert-outline', to: '/Alerts' as any },
        { title: 'Saved Reports', icon: 'folder-outline', to: '/SavedReports' as any },
        { title: 'AI Agent', icon: 'chatbox-ellipses-outline', to: '/AIHelper' as any },
        { title: 'Drugs Checker', icon: 'medkit-outline', to: '/Drugs' as any },
        { title: 'Insurance', icon: 'shield-checkmark-outline', to: '/Insurance' as any },
        { title: 'First Aid', icon: 'bandage-outline', to: '/FirstAid' as any },
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.grid}>
                {features.map((item, index) => (
                    <FeatureCard key={index} title={item.title} icon={item.icon as any} to={item.to} />
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});
