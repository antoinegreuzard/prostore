import { APP_KEY } from '../../utils/constants/appConstants'

require('dotenv').config();

import { withIronSession } from "next-iron-session";

const haveSecret = withIronSession(
    async (req, res, next) => {
        try {
            const user = req.session.get("user");
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
        cookieOptions: {
            secure: true
        },
        password: process.env.SECRET_KEY,
    }
    );

export default haveSecret;