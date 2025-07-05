import express from 'express';
import requireRole from '../middleware/requireRole.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/dashboard', verifyToken, requireRole('admin'), (req, res) => {
    res.json({ message: `Welcome admin ${req.user.id}` });
});

export default router;
