const { verifyToken } = require("../utils/jwt");

function protect(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
        return res.status(401).json({
            message: "Access denied. Token missing"
        });
    }

    try {
        req.user = verifyToken(token);
        next();
    } catch (err) {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = protect;
