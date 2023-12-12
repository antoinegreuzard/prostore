import { withIronSessionApiRoute } from 'iron-session/next'
import { APP_KEY } from '../../utils/constants/appConstants'

const authHandler = withIronSessionApiRoute(
  async (req, res) => {
    try {
      const auth = await fetch(
        'https://dashboard.cosmicjs.com/v3/authenticate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body),
        },
      )
      const data = await auth.json()
      if (data.user) {
        req.session.user = data
        await req.session.save()
        res.status(200).json({ data })
      } else {
        res.status(409).json('Merci de vous connecter sur CosmicJS')
      }
    } catch (error) {
      res.status(500).json(error.message)
    }
  },
  {
    cookieName: APP_KEY,
    password: process.env.SECRET_KEY,
  },
)

export default authHandler
