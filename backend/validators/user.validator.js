// User Validators

function validateSignup(req, res, next) {
    const { username, email, password, gender } = req.body;
    if (!username || typeof username !== 'string' || username.length < 3) {
        return res.status(400).json({ message: 'Username is required and must be at least 3 characters.' });
    }
    if (!email || typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        return res.status(400).json({ message: 'A valid email is required.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ message: 'Password is required and must be at least 6 characters.' });
    }
    if (!gender || !['male', 'female'].includes(gender)) {
        return res.status(400).json({ message: 'Gender must be either "male" or "female".' });
    }
    next();
}

function validateLogin(req, res, next) {
    const { email, password } = req.body;
    if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Email is required.' });
    }
    if (!password || typeof password !== 'string') {
        return res.status(400).json({ message: 'Password is required.' });
    }
    next();
}

function validateUpdateProfile(req, res, next) {
    const { username, password, gender } = req.body;
    if (username && (typeof username !== 'string' || username.length < 3)) {
        return res.status(400).json({ message: 'Username must be at least 3 characters.' });
    }
    if (password && (typeof password !== 'string' || password.length < 6)) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    if (gender && !['male', 'female'].includes(gender)) {
        return res.status(400).json({ message: 'Gender must be either "male" or "female".' });
    }
    next();
}

module.exports = { validateSignup, validateLogin, validateUpdateProfile }; 