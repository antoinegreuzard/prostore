// Import necessary modules
import { withIronSessionApiRoute } from 'iron-session/next'
import { APP_KEY } from '../../utils/constants/appConstants'

require('dotenv').config()

const haveSecret = (handler) => withIronSessionApiRoute(async (req, res) => {
  try {
    const { user } = req.session
    if (!user) {
      res.status(401).json({ error: 'Accès refusé' })
      return undefined // Explicitly return undefined
    }
    req.userId = user.id

    // Call the original handler now that we've handled the session check
    await handler(req, res)
    return undefined // Explicitly return undefined
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
    return undefined // Explicitly return undefined
  }
}, {
  cookieName: APP_KEY,
  password: process.env.SECRET_KEY,
})

export default haveSecret
