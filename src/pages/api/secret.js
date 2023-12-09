// Import necessary modules
import { withIronSessionApiRoute } from 'iron-session/next';
import { APP_KEY } from '../../utils/constants/appConstants';

require('dotenv').config();

// The haveSecret higher-order function
const haveSecret = (handler) => withIronSessionApiRoute(async (req, res) => {
  try {
    const { user } = req.session;
    if (!user) {
      return res.status(401).json({ error: 'Accès refusé' });
    }
    req.userId = user.id;

    // Call the original handler now that we've handled the session check
    await handler(req, res);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}, {
  cookieName: APP_KEY,
  password: process.env.SECRET_KEY,
});

export default haveSecret;
