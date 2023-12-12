import { createBucketClient } from '@cosmicjs/sdk'
import haveSecret from './secret'

const cosmic = createBucketClient({
  bucketSlug: process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG,
  readKey: process.env.NEXT_PUBLIC_COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
})

const deleteHandler = async (req, res) => {
  try {
    const data = await cosmic.objects.deleteOne(req.body.id)
    if (req.body.creator) {
      res.status(200).json({ data, id: data.id, messageOK: 'Le cadeau a bien été supprimé' })
    } else {
      res.status(401).json({ message: 'Accès refusé, vous n\'êtes pas le créateur' })
    }
  } catch (error) {
    const statusCode = error.status || 500
    res.status(statusCode).json({ error })
  }
}

// Wrap deleteHandler with haveSecret
export default haveSecret(deleteHandler)
