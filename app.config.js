import 'dotenv/config';

export default {
    expo: {
        name: "emergency-doctor-fixed",
        slug: "emergency-doctor-fixed",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "emergencydoctorfixed",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
        supportsTablet: true
        },
        android: {
        adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#ffffff"
        },
        edgeToEdgeEnabled: true
        },
        web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/favicon.png"
        },
    plugins: [
      "expo-router",
      "expo-secure-store"
    ],
        experiments: {
        typedRoutes: true
        },
        extra: {
        API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000',
        }
    }
};
