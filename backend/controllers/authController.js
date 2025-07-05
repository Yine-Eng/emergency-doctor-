import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';

export const signup = async (req, res) => {
    try {
        const { fullName, phone, email, password } = req.body;

        const existing = await User.findOne({ phone });
        if (existing) return res.status(400).json({ message: 'Phone already registered' });

        const user = new User({ fullName, phone, email, password });
        await user.save();

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({ 
            accessToken, 
            refreshToken,
            user: { id: user._id, fullName: user.fullName, role: user.role } 
        });
    } catch (err) {
        console.error('Signup failed:', err);
        res.status(500).json({ message: 'Signup failed' });
    }
};

export const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ phone });

        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        if (user.isLocked()) {
            const unlockTime = user.lockUntil.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return res.status(423).json({ message: `Account locked. Try again at ${unlockTime}` });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            await user.incrementFailedAttempts();
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        await user.resetLoginAttempts();

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            accessToken,
            refreshToken,
            user: { id: user._id, fullName: user.fullName, role: user.role },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed' });
    }
};
