import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Generate JWT Token with user id and role
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new admin user
// @route   POST /api/auth/register
// @access  Public
export const registerAdmin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    try {
        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ username, password: hashedPassword, role: 'admin' });

        return res.status(201).json({
            message: 'Account created successfully',
            token: generateToken(user._id, user.role),
            username: user.username,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Authenticate admin user (login)
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        return res.json({
            message: 'Login successful',
            token: generateToken(user._id, user.role),
            username: user.username,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};