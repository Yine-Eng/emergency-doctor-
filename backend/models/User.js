import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, default: '' },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'doctor', 'admin'], default: 'user' },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    refreshToken: { type: String }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isLocked = function () {
    return this.lockUntil && this.lockUntil > new Date();
};

userSchema.methods.incrementFailedAttempts = async function () {
    this.failedLoginAttempts += 1;

    if (this.failedLoginAttempts % 5 === 0) {
        const lockTime = 10 * 60000 * (this.failedLoginAttempts / 5);
        this.lockUntil = new Date(Date.now() + lockTime);
    }

    await this.save();
};

userSchema.methods.resetLoginAttempts = async function () {
    this.failedLoginAttempts = 0;
    this.lockUntil = null;
    await this.save();
};

export default mongoose.model('User', userSchema);
