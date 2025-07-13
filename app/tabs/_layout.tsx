import SafeScreenLayout from '@/components/SafeScreenLayout';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <SafeScreenLayout>
            <Tabs
                screenOptions={({ route }: { route: { name: string } }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: '#1E40AF',
                    tabBarInactiveTintColor: 'gray',
                    tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
                        let iconName: any;

                        if (route.name === 'index') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Discover') {
                            iconName = focused ? 'apps' : 'apps-outline';
                        } else if (route.name === 'Profile') {
                            iconName = focused ? 'person' : 'person-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
            >
                <Tabs.Screen name="index" options={{ title: 'Home' }} />
                <Tabs.Screen name="Discover" options={{ title: 'Discover' }} />
                <Tabs.Screen name="Profile" options={{ title: 'Profile' }} />
            </Tabs>
        </SafeScreenLayout>
    );
}
