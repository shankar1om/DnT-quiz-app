// Category Validators

function validateCategory(req, res, next) {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.length < 3) {
        return res.status(400).json({ message: 'Category name is required and must be at least 3 characters.' });
    }
    next();
}

module.exports = { validateCategory }; 