import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function LocationDisplay({
    onLocationChange,
}: {
    onLocationChange?: (location: { coords: Location.LocationObjectCoords; address?: Location.LocationGeocodedAddress }) => void;
}) {
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [address, setAddress] = useState<Location.LocationGeocodedAddress | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setError('Permission denied');
                    return;
                }

                const loc = await Location.getCurrentPositionAsync({});
                setLocation(loc);

                const [addr] = await Location.reverseGeocodeAsync(loc.coords);
                setAddress(addr);
                onLocationChange?.({ coords: loc.coords, address: addr });
            } catch (e) {
                setError('Could not fetch location');
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Location</Text>
            {loading ? (
                <ActivityIndicator color="#1E40AF" />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <View>
                    <Text style={styles.locationText}>
                        {address?.city || address?.region || 'Unknown City'}, {address?.region || 'Unknown Region'}
                    </Text>
                    <Text style={styles.coords}>
                        Lat: {location?.coords.latitude.toFixed(4)} | Lon: {location?.coords.longitude.toFixed(4)}
                    </Text>
                </View>
            )}
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
        marginBottom: 8,
    },
    locationText: {
        fontSize: 15,
        color: '#1E40AF',
        fontWeight: '500',
    },
    coords: {
        fontSize: 12,
        color: '#64748B',
    },
    error: {
        color: 'red',
    },
});
