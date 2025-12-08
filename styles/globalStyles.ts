import { StyleSheet } from 'react-native';

export const colors = {
    background: '#F8FAFC',
    border: '#CBD5E1',
    textPrimary: '#1E293B',
    textSecondary: '#334155',
    link: '#1E40AF',
    white: '#FFFFFF',
    error: '#EF4444',
    icon: '#64748B',
};

export const fontSizes = {
    label: 14,
    error: 13,
    header: 24,
    link: 15,
    checkbox: 15,
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    inner: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        paddingTop: 40,
    },
    header: {
        fontSize: fontSizes.header,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 24,
        textAlign: 'center',
    },
    label: {
        fontSize: fontSizes.label,
        fontWeight: '500',
        marginBottom: 4,
        color: colors.textPrimary,
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderColor: colors.border,
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 10,
        fontSize: 16,
        color: colors.textPrimary,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        borderColor: colors.border,
        borderWidth: 1,
        backgroundColor: colors.white,
        marginBottom: 10,
    },
    inputWithIcon: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.textPrimary,
    },
    errorText: {
        color: colors.error,
        marginBottom: 10,
        fontSize: fontSizes.error,
    },
    forgotText: {
        color: colors.link,
        textAlign: 'right',
        marginBottom: 20,
        fontSize: fontSizes.error,
        fontWeight: '500',
    },
    linkContainer: {
        textAlign: 'center',
        marginTop: 20,
        color: colors.textSecondary,
    },
    linkText: {
        color: colors.link,
        fontWeight: '500',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 15,
        color: colors.textPrimary,
    },
});
