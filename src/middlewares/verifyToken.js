const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

//
const verifyAccessToken = asyncHandler(async (req, res, next) => {
    const token = req.headers['access-token']; // Lấy token từ header
    // console.log(token);
    if (!token) return res.status(404).json({ err: 1, msg: 'Missing token !' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ err: 1, msg: 'Require authentication !' });
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const { role } = req.user;
    if (role != 'admin') {
        return res.status(401).json({
            success: false,
            message: 'No admin ..'
        });
    }
    next();
});

// export

module.exports = {
    verifyAccessToken,
    isAdmin
};
