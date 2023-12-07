import { withIronSessionApiRoute } from 'iron-session/next';
import { APP_KEY } from '../../utils/constants/appConstants'

const logoutHandler = withIronSessionApiRoute(async (req, res) => {
    req.session.destroy();
    res.setHeader('Set-Cookie', `${APP_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`);
    res.status(200).json({ message: 'Déconnexion réussie' });
    }, {
    cookieName: APP_KEY,
    password: process.env.SECRET_KEY,
    // Ajoutez ici d'autres options de configuration si nécessaire
});

export default logoutHandler;