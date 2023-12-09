import { withIronSessionApiRoute } from 'iron-session/next';
import { APP_KEY } from '../../utils/constants/appConstants';

require('dotenv').config();

const haveSecret = withIronSessionApiRoute(
  // eslint-disable-next-line consistent-return
  async (req, res, next) => {
    try {
      const { user } = req.session;
      if (!user) {
        return res.status(401).json('Accès refusé');
      }
      req.userId = user.id;
      next();
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  {
    cookieName: APP_KEY,
    password: process.env.SECRET_KEY,
  },
);

export default haveSecret;
