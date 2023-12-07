import { withIronSession } from 'next-iron-session'
import { APP_KEY } from '../../utils/constants/appConstants'

const authHandler = withIronSession(
  async (req, res) => {
    try {
      const auth = await fetch(
        'https://dashboard.cosmicjs.com/v3/authenticate',
        {
          method: 'POST',
          headers: {
            'Content-Type': `application/json`,
          },
          body: JSON.stringify(req.body),
        }
      )
      const data = await auth.json()
      if (data.user) {
        req.session.set('user', data)
        await req.session.save()
        res.status(200).json({ data })
      } else {
        res.status(409).json('Merci de vous connecter sur CosmicJS')
      }
    } catch (error) {
      console.error(error)
      res.status(500).json(error.message)
    }
  },
  {
    cookieName: APP_KEY,
    cookieOptions: {
      secure: true,
    },
    password: process.env.SECRET_KEY,
  }
)

export default authHandler;