import jwt from 'jsonwebtoken';

// Middleware pour vérifier le token JWT
export default async function haveSecret(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json('Accès refusé');
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if (err) {
                res.status(401).json('Token invalide');
            } else {
                req.userId = decodedToken.id;
                next();
            }
        });
    } catch (error) {
        res.status(error.status).json({
            error: error.message
        });
    }
}