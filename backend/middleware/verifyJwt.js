import jwt from 'jsonwebtoken';
import 'dotenv/config';
// const jwtSecret = process.env.JWT_SECRET;
const verifyJwt = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(200).json({ error: 'Access denied' });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verified.id;
        next();
    } catch (error) {
        res.status(200).json({ error: 'Invalid token' });
    }
}
export default verifyJwt;