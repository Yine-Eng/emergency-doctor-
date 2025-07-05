import express from 'express';
import requireRole from '../middleware/requireRole.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/profile', verifyToken, (req, res) => {
    res.json({ message: `Welcome, user ${req.user.id} with role ${req.user.role}` });
});

router.get('/doctor-dashboard', verifyToken, requireRole('doctor'), (req, res) => {
    res.json({ message: `Welcome Doctor ${req.user.id}` });
});

router.get('/admin-panel', verifyToken, requireRole('admin'), (req, res) => {
    res.json({ message: `Admin panel access granted to ${req.user.id}` });
});

router.get('/general-info', verifyToken, (req, res) => {
    res.json({ message: 'This route is for all roles' });
});

export default router;
