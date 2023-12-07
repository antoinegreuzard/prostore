import { createBucketClient } from '@cosmicjs/sdk';
import haveSecret from './secret.js';

const cosmic = createBucketClient({
  bucketSlug: process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG,
  readKey: process.env.NEXT_PUBLIC_COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

const createHandler = async (
  { body: { title, description, price, count, image, categories, email } },
  res
  ) => {
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
      title: title,
      type: 'products',
      thumbnail: image,
      metadata,
    })
    res.status(200).json(data)
  } catch (error) {
    res.status(error.status).json(error.message)
  }
}

const handler = async (req, res) => {
  await haveSecret(req, res, async () => {
    await createHandler(req, res);
  });
};
export default handler;