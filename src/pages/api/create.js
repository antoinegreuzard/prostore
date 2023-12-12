import { createBucketClient } from '@cosmicjs/sdk'
import haveSecret from './secret'

const cosmic = createBucketClient({
  bucketSlug: process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG,
  readKey: process.env.NEXT_PUBLIC_COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
})

const createHandler = async (req, res) => {
  const {
    title, description, price, count, image, categories, email,
  } = req.body

  const metadata = {
    description,
    price: Number(price),
    count: Number(count),
    image,
    categories,
    email,
  }

  try {
    const data = await cosmic.objects.insertOne({
      title,
      type: 'products',
      thumbnail: image,
      metadata,
    })
    res.status(200).json(data)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

// Wrap createHandler with haveSecret
export default haveSecret(createHandler)
