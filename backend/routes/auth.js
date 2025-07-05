import express from 'express';
import jwt from 'jsonwebtoken';
import { login, signup } from '../controllers/authController.js';
import User from '../models/User.js';
import { generateAccessToken } from '../utils/generateTokens.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: 'No token' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Token does not match latest login' });
        }

        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });

    } catch (err) {
        console.error('Refresh token error:', err);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
});
router.post('/delete-test-user', async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone is required' });

    try {
        await User.deleteOne({ phone });
        res.status(200).json({ message: 'Test user deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting test user' });
    }
});

export default router;
