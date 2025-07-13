import ReportCard from "@/components/reports/ReportCard";
import { API_ENDPOINTS } from "@/constants/ApiConfig";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

interface Report {
    _id: string;
    title: string;
    createdAt: string;
    isDraft: boolean;
}

export default function SavedReports() {
    const [submittedReports, setSubmittedReports] = useState<Report[]>([]);
    const [drafts, setDrafts] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchReports = async () => {
        try {
            const res = await fetchWithAuth(`${API_ENDPOINTS.REPORTS}`);
            const data = await res.json();
            const submitted = data.filter((r: Report) => !r.isDraft);
            const draft = data.filter((r: Report) => r.isDraft);
            setSubmittedReports(submitted);
            setDrafts(draft);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
            Alert.alert("Error", "Failed to load reports. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await fetchWithAuth(API_ENDPOINTS.REPORTS_DELETE(id), {
                method: "DELETE",
            });
            fetchReports();
        } catch (error) {
            console.error("Error deleting report:", error);
            Alert.alert("Error", "Failed to delete report. Please try again.");
        }
    };

    const handleEdit = (id: string) => {
        router.push({ pathname: "/Document", params: { id } });
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text style={styles.loadingText}>Loading reports...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.title}>Your Saved Reports</Text>
                <Text style={styles.subtitle}>
                    View, edit, or share your submitted reports. You can also
                    find saved drafts below. To create a new report, go to
                    "Document Injury" in the Discover tab.
                </Text>
            </View>

            <Text style={styles.sectionTitle}>Submitted Reports</Text>
            {submittedReports.length === 0 ? (
                <Text style={styles.emptyText}>No submitted reports yet.</Text>
            ) : (
                submittedReports.map((report) => (
                    <ReportCard
                        key={report._id}
                        id={report._id}
                        title={report.title}
                        date={new Date(report.createdAt).toLocaleDateString()}
                        onDelete={() => handleDelete(report._id)}
                        onEdit={() => handleEdit(report._id)}
                        isDraft={false}
                    />
                ))
            )}

            <Text style={styles.sectionTitle}>Drafts</Text>
            {drafts.length === 0 ? (
                <Text style={styles.emptyText}>You have no saved drafts.</Text>
            ) : (
                drafts.map((report) => (
                    <ReportCard
                        key={report._id}
                        id={report._id}
                        title={report.title}
                        date={new Date(report.createdAt).toLocaleDateString()}
                        onDelete={() => handleDelete(report._id)}
                        onEdit={() => handleEdit(report._id)}
                        isDraft={true}
                    />
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
        backgroundColor: "#F8FAFC",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        color: "#64748B",
    },
    headerBox: {
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#475569",
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1E293B",
        marginTop: 24,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: "#94A3B8",
        fontStyle: "italic",
    },
});
