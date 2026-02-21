import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (role) => {
    return jwt.sign({ role }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Keeps you logged in on your mobile for 30 days
    });
};

// @desc    Authenticate Admin
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Please provide a password' });
    }

    // Compare with the hardcoded .env password
    if (password === process.env.ADMIN_PASSWORD) {
        res.json({
            message: 'Login successful',
            token: generateToken('admin'),
        });
    } else {
        res.status(401).json({ message: 'Invalid Admin Password' });
    }
};