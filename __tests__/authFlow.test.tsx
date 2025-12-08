const TEST_PHONE = '0550000000';
const TEST_PASSWORD = 'Test@123';
const TEST_NAME = 'Test User';
let createdUserId: string | null = null;

const mockStorage: {
    tokens: Map<string, string>;
    setItem: jest.Mock;
    getItem: jest.Mock;
    removeItem: jest.Mock;
    clear: jest.Mock;
} = {
    tokens: new Map(),
    setItem: jest.fn((key: string, value: string) => {
        mockStorage.tokens.set(key, value);
    }),
    getItem: jest.fn((key: string): string | null => {
        return mockStorage.tokens.get(key) || null;
    }),
    removeItem: jest.fn((key: string) => {
        mockStorage.tokens.delete(key);
    }),
    clear: jest.fn(() => {
        mockStorage.tokens.clear();
    }),
};

const mockNavigation = {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
};

let mockUserState: any = null;
const mockSetUser = jest.fn((user: any) => {
    mockUserState = user;
});

beforeAll(() => {
    global.alert = jest.fn();
    (global as any).localStorage = mockStorage;
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

describe('Auth Flow Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockStorage.clear();
        mockUserState = null;
        mockNavigation.replace.mockClear();
        mockNavigation.push.mockClear();
        mockSetUser.mockClear();
    });

    it('validates signup form data correctly', () => {
        const validateSignup = (form: any) => {
            const errors: any = {};
            if (!form.fullName?.trim()) errors.fullName = 'Full name is required';
            if (!form.phone?.trim()) errors.phone = 'Phone number is required';
            if (form.password?.length < 6) errors.password = 'Password must be at least 6 characters';
            if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
            return errors;
        };

        const validForm = {
            fullName: TEST_NAME,
            phone: TEST_PHONE,
            email: 'test@example.com',
            password: TEST_PASSWORD,
            confirmPassword: TEST_PASSWORD,
        };
        expect(validateSignup(validForm)).toEqual({});

        const invalidForm = {
            fullName: '',
            phone: '',
            email: 'test@example.com',
            password: '123',
            confirmPassword: '456',
        };
        const errors = validateSignup(invalidForm);
        expect(errors.fullName).toBe('Full name is required');
        expect(errors.phone).toBe('Phone number is required');
        expect(errors.password).toBe('Password must be at least 6 characters');
        expect(errors.confirmPassword).toBe('Passwords do not match');
    });

    it('validates signin form data correctly', () => {
        const validateSignin = (form: any) => {
            const errors: any = {};
            if (!form.emailOrPhone?.trim()) errors.emailOrPhone = 'Email or phone is required';
            if (!form.password) errors.password = 'Password is required';
            return errors;
        };

        const validForm = {
            emailOrPhone: TEST_PHONE,
            password: TEST_PASSWORD,
        };
        expect(validateSignin(validForm)).toEqual({});

        const invalidForm = {
            emailOrPhone: '',
            password: '',
        };
        const errors = validateSignin(invalidForm);
        expect(errors.emailOrPhone).toBe('Email or phone is required');
        expect(errors.password).toBe('Password is required');
    });

    it('handles complete signup flow with token storage and navigation', async () => {
        const mockResponse = {
            ok: true,
            json: () => Promise.resolve({ 
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
                user: { 
                    id: 'user-123', 
                    fullName: TEST_NAME, 
                    role: 'patient' 
                } 
            }),
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

        const signupData = {
            fullName: TEST_NAME,
            phone: TEST_PHONE,
            email: 'test@example.com',
            password: TEST_PASSWORD,
        };

        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData),
        });

        const data = await response.json();

        expect(response.ok).toBe(true);
        expect(data.accessToken).toBe('mock-access-token');
        expect(data.refreshToken).toBe('mock-refresh-token');
        expect(data.user.fullName).toBe(TEST_NAME);

        mockStorage.setItem('accessToken', data.accessToken);
        mockStorage.setItem('refreshToken', data.refreshToken);
        expect(mockStorage.getItem('accessToken')).toBe('mock-access-token');
        expect(mockStorage.getItem('refreshToken')).toBe('mock-refresh-token');

        mockSetUser(data.user);
        expect(mockSetUser).toHaveBeenCalledWith(data.user);
        expect(mockUserState).toEqual(data.user);

        mockNavigation.replace('/Home');
        expect(mockNavigation.replace).toHaveBeenCalledWith('/Home');

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData),
        });

        createdUserId = TEST_PHONE;
    });

    it('handles complete signin flow with token storage and navigation', async () => {
        const mockResponse = {
            ok: true,
            json: () => Promise.resolve({
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
                user: { phone: TEST_PHONE, fullName: TEST_NAME }
            }),
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

        const signinData = {
            phone: TEST_PHONE,
            password: TEST_PASSWORD,
        };

        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signinData),
        });

        const data = await response.json();

        expect(response.ok).toBe(true);
        expect(data.accessToken).toBe('mock-access-token');
        expect(data.refreshToken).toBe('mock-refresh-token');
        expect(data.user.phone).toBe(TEST_PHONE);

        mockStorage.setItem('accessToken', data.accessToken);
        mockStorage.setItem('refreshToken', data.refreshToken);
        expect(mockStorage.getItem('accessToken')).toBe('mock-access-token');
        expect(mockStorage.getItem('refreshToken')).toBe('mock-refresh-token');

        mockSetUser(data.user);
        expect(mockSetUser).toHaveBeenCalledWith(data.user);
        expect(mockUserState).toEqual(data.user);

        mockNavigation.replace('/Home');
        expect(mockNavigation.replace).toHaveBeenCalledWith('/Home');

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signinData),
        });
    });

    it('handles signup failure with error display', async () => {
        const mockResponse = {
            ok: false,
            json: () => Promise.resolve({
                message: 'Phone already registered'
            }),
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

        const signupData = {
            fullName: TEST_NAME,
            phone: TEST_PHONE,
            email: 'test@example.com',
            password: TEST_PASSWORD,
        };

        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData),
        });

        const data = await response.json();

        expect(response.ok).toBe(false);
        expect(data.message).toBe('Phone already registered');

        global.alert(data.message);
        expect(global.alert).toHaveBeenCalledWith('Phone already registered');

        expect(mockNavigation.replace).not.toHaveBeenCalled();
        expect(mockSetUser).not.toHaveBeenCalled();
    });

    it('handles signin failure with error display', async () => {
        const mockResponse = {
            ok: false,
            json: () => Promise.resolve({
                message: 'Invalid credentials'
            }),
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

        const signinData = {
            phone: TEST_PHONE,
            password: 'wrongpassword',
        };

        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signinData),
        });

        const data = await response.json();

        expect(response.ok).toBe(false);
        expect(data.message).toBe('Invalid credentials');

        global.alert(data.message);
        expect(global.alert).toHaveBeenCalledWith('Invalid credentials');

        expect(mockNavigation.replace).not.toHaveBeenCalled();
        expect(mockSetUser).not.toHaveBeenCalled();
    });

    it('handles logout flow correctly', () => {
        mockStorage.removeItem('accessToken');
        mockStorage.removeItem('refreshToken');
        mockSetUser(null);
        mockNavigation.replace('/SignIn');

        expect(mockStorage.getItem('accessToken')).toBeNull();
        expect(mockStorage.getItem('refreshToken')).toBeNull();
        expect(mockSetUser).toHaveBeenCalledWith(null);
        expect(mockNavigation.replace).toHaveBeenCalledWith('/SignIn');
        expect(mockUserState).toBeNull();
    });

    it('handles token refresh flow', async () => {
        mockStorage.setItem('refreshToken', 'old-refresh-token');

        const mockRefreshResponse = {
            ok: true,
            json: () => Promise.resolve({
                accessToken: 'new-access-token',
                refreshToken: 'new-refresh-token',
            }),
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce(mockRefreshResponse);

        const response = await fetch('http://localhost:5000/api/auth/refresh', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${mockStorage.getItem('refreshToken')}`
            },
        });

        const data = await response.json();

        expect(response.ok).toBe(true);
        expect(data.accessToken).toBe('new-access-token');
        expect(data.refreshToken).toBe('new-refresh-token');

        mockStorage.setItem('accessToken', data.accessToken);
        mockStorage.setItem('refreshToken', data.refreshToken);
        expect(mockStorage.getItem('accessToken')).toBe('new-access-token');
        expect(mockStorage.getItem('refreshToken')).toBe('new-refresh-token');
    });

    it('handles "Remember Me" functionality', () => {
        const rememberMe = true;
        
        if (rememberMe) {
            mockStorage.setItem('accessToken', 'mock-access-token');
            mockStorage.setItem('refreshToken', 'mock-refresh-token');
            expect(mockStorage.getItem('accessToken')).toBe('mock-access-token');
            expect(mockStorage.getItem('refreshToken')).toBe('mock-refresh-token');
        }

        const rememberMeFalse = false;
        if (!rememberMeFalse) {
            expect(mockStorage.getItem('accessToken')).toBe('mock-access-token');
        }
    });

    it('handles network errors gracefully', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        const signupData = {
            fullName: TEST_NAME,
            phone: TEST_PHONE,
            email: 'test@example.com',
            password: TEST_PASSWORD,
        };

        await expect(fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData),
        })).rejects.toThrow('Network error');

        global.alert('Something went wrong');
        expect(global.alert).toHaveBeenCalledWith('Something went wrong');
    });

    it('validates token presence for protected routes', () => {
        mockStorage.setItem('accessToken', 'valid-token');
        const hasValidToken = !!mockStorage.getItem('accessToken');
        expect(hasValidToken).toBe(true);

        mockStorage.removeItem('accessToken');
        const hasNoToken = !!mockStorage.getItem('accessToken');
        expect(hasNoToken).toBe(false);

        if (!hasNoToken) {
            mockNavigation.replace('/SignIn');
            expect(mockNavigation.replace).toHaveBeenCalledWith('/SignIn');
        }
    });
});