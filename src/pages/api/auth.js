export default async function authHandler({ body }, res) {
  try {
    const auth = await fetch('https://dashboard.cosmicjs.com/v3/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': `application/json`,
      },
      body: JSON.stringify(body),
    })
    const data = await auth.json()
    if (data.user) {
      res.status(200).json({ data })
    } else {
      res.status(409).json('Merci de vous connecter sur CosmicJS')
    }
  } catch (error) {
    console.log(error)
    res.status(404).json(error.message)
  }
}