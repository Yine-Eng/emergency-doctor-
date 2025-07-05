import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';

const testUser = {
    fullName: 'Integration Tester',
    phone: '9999999999',
    email: 'test@auto.com',
    password: 'TestPass123!',
};

let refreshToken;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
    await User.deleteOne({ phone: testUser.phone });
    await mongoose.connection.close();
});

describe('Auth Flow', () => {
    test('Signup returns access and refresh tokens', async () => {
        const res = await request(app).post('/api/auth/signup').send(testUser);
        expect(res.statusCode).toBe(201);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
        refreshToken = res.body.refreshToken;
    });

    test('Login fails with wrong credentials', async () => {
        const res = await request(app).post('/api/auth/login').send({
            phone: testUser.phone,
            password: 'WrongPass',
        });
        expect(res.statusCode).toBe(401);
    });

    test('Login succeeds with correct credentials', async () => {
        const res = await request(app).post('/api/auth/login').send({
            phone: testUser.phone,
            password: testUser.password,
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBeDefined();

        refreshToken = res.body.refreshToken;
    });

    test('Refresh token works', async () => {
        const res = await request(app).post('/api/auth/refresh-token').send({ refreshToken });
        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBeDefined();
    });
});
