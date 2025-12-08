import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Contact {
    id: string;
    name: string;
    phone: string;
}

export default function EmergencyContacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [location, setLocation] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentEdit, setCurrentEdit] = useState<Contact | null>(null);
    const [nameInput, setNameInput] = useState("");
    const [phoneInput, setPhoneInput] = useState("");

    useEffect(() => {
        setContacts([
            { id: "1", name: "Mom", phone: "+123456789" },
            { id: "2", name: "Dad", phone: "+987654321" },
        ]);
    }, []);

    const fetchLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission denied",
                "Location access is needed to send emergency alerts."
            );
            return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        const coords = loc.coords;
        return `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;
    };

    const handleSendHelpMessage = async (contact: Contact) => {
        const currentLocation = await fetchLocation();
        const message = `Emergency! I need help. My current location: ${currentLocation}`;
        Alert.alert(
            "Sending Message",
            `To: ${contact.name}\nNumber: ${contact.phone}\n\nMessage: ${message}`
        );
    };

    const handleEditContact = (contact: Contact) => {
        setCurrentEdit(contact);
        setNameInput(contact.name);
        setPhoneInput(contact.phone);
        setModalVisible(true);
    };

    const handleDeleteContact = (id: string) => {
        setContacts((prev) => prev.filter((c) => c.id !== id));
    };

    const saveEditedContact = () => {
        if (!currentEdit) return;
        setContacts((prev) =>
            prev.map((c) =>
                c.id === currentEdit.id
                    ? { ...c, name: nameInput, phone: phoneInput }
                    : c
            )
        );
        setModalVisible(false);
        setCurrentEdit(null);
    };

    const addNewContact = () => {
        const newContact: Contact = {
            id: Date.now().toString(),
            name: nameInput,
            phone: phoneInput,
        };
        setContacts((prev) => [...prev, newContact]);
        setModalVisible(false);
        setNameInput("");
        setPhoneInput("");
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Emergency Contacts</Text>
            <Text style={styles.description}>
                Tap a contact to send a help message with your location. You can
                add and manage contacts here. This feature will connect to the
                emergency button in the Home screen.
            </Text>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    setCurrentEdit(null);
                    setNameInput("");
                    setPhoneInput("");
                    setModalVisible(true);
                }}
            >
                <Ionicons name="add-circle-outline" size={24} color="#1E40AF" />
                <Text style={styles.addText}>Add Contact</Text>
            </TouchableOpacity>

            {contacts.map((contact) => (
                <View key={contact.id} style={styles.cardContainer}>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleSendHelpMessage(contact)}
                    >
                        <Ionicons name="call" size={24} color="#1E40AF" />
                        <View style={styles.cardContent}>
                            <Text style={styles.contactName}>
                                {contact.name}
                            </Text>
                            <Text style={styles.contactPhone}>
                                {contact.phone}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.actionIcons}>
                        <TouchableOpacity
                            onPress={() => handleEditContact(contact)}
                        >
                            <Ionicons
                                name="create-outline"
                                size={20}
                                color="#1E40AF"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleDeleteContact(contact.id)}
                        >
                            <Ionicons
                                name="trash-outline"
                                size={20}
                                color="#EF4444"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            placeholder="Name"
                            style={styles.input}
                            value={nameInput}
                            onChangeText={setNameInput}
                        />
                        <TextInput
                            placeholder="Phone"
                            style={styles.input}
                            value={phoneInput}
                            onChangeText={setPhoneInput}
                            keyboardType="phone-pad"
                        />
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={
                                currentEdit ? saveEditedContact : addNewContact
                            }
                        >
                            <Text style={styles.saveButtonText}>
                                {currentEdit ? "Update" : "Add"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                { backgroundColor: "#CBD5E1", marginTop: 10 },
                            ]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text
                                style={[
                                    styles.saveButtonText,
                                    { color: "#1E293B" },
                                ]}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#F8FAFC",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: "#475569",
        marginBottom: 20,
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    addText: {
        fontSize: 16,
        color: "#1E40AF",
        marginLeft: 8,
        fontWeight: "600",
    },
    cardContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    cardContent: {
        marginLeft: 12,
    },
    contactName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E293B",
    },
    contactPhone: {
        fontSize: 14,
        color: "#64748B",
    },
    actionIcons: {
        flexDirection: "row",
        gap: 12,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        width: "80%",
    },
    input: {
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    saveButton: {
        backgroundColor: "#1E40AF",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
