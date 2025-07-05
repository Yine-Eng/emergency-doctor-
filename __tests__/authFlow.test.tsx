import SignIn from '@/app/SignIn';
import SignUp from '@/app/SignUp';
import { AuthProvider } from '@/contexts/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

const TEST_PHONE = '0550000000';
const TEST_PASSWORD = 'Test@123';
const TEST_NAME = 'Test User';
let createdUserId: string | null = null;

beforeAll(() => {
    global.alert = jest.fn();
});

afterAll(async () => {
    if (createdUserId) {
        await fetch(`http://localhost:5000/api/auth/delete-test-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: TEST_PHONE }),
        });
    }
});

global.alert = jest.fn();

describe('Auth Flow', () => {
    it('signs up a user', async () => {
        const { getByText, getByTestId } = render(
            <AuthProvider>
                <NavigationContainer>
                    <SignUp />
                </NavigationContainer>
            </AuthProvider>
        );

        fireEvent.changeText(getByTestId('input-fullName'), TEST_NAME);
        fireEvent.changeText(getByTestId('input-phone'), TEST_PHONE);
        fireEvent.changeText(getByTestId('input-email'), '');
        fireEvent.changeText(getByTestId('input-password'), TEST_PASSWORD);
        fireEvent.changeText(getByTestId('input-confirmPassword'), TEST_PASSWORD);
        fireEvent.press(getByText('Sign Up'));

        await waitFor(() => {
            expect(getByText(/already have an account/i)).toBeTruthy();
        });

        createdUserId = TEST_PHONE;
    });

    it('logs in the user', async () => {
        const { getByText, getByTestId } = render(
            <AuthProvider>
                <NavigationContainer>
                    <SignIn />
                </NavigationContainer>
            </AuthProvider>
        );

        fireEvent.changeText(getByTestId('input-emailOrPhone'), TEST_PHONE);
        fireEvent.changeText(getByTestId('input-password'), TEST_PASSWORD);
        fireEvent.press(getByText('Sign In'));

        await waitFor(() => {
            expect(getByText('Welcome Back')).toBeTruthy();
        });
    });
});
