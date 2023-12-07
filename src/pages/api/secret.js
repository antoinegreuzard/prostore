import { APP_KEY } from '../../utils/constants/appConstants'
import { withIronSessionApiRoute } from 'iron-session/next'

require('dotenv').config()

const haveSecret = withIronSessionApiRoute(
    async (req, res, next) => {
        try {
            const user = req.session.user;
            if (!user) {
                return res.status(401).json('Accès refusé');
            }
            req.userId = user.id;
            next();
        } catch (error) {
            console.error(error)
            res.status(500).json(error.message)
        }
    },
    {
        cookieName: APP_KEY,
        password: process.env.SECRET_KEY,
    }
    );

export default haveSecret;