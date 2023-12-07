import { createBucketClient } from '@cosmicjs/sdk';
import { isAuthenticated } from './auth.js';

const cosmic = createBucketClient({
  bucketSlug: process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG,
  readKey: process.env.NEXT_PUBLIC_COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

const deleteHandler = async (req, res) => {
  try {
    const data = await cosmic.objects.deleteOne(req.body);
    res.status(200).json(data);
  } catch (error) {
    const statusCode = error.status || 500; // Fallback sur 500 si status est undefined
    res.status(statusCode).json({ error: error.message });
  }
}

const handler = [isAuthenticated, deleteHandler];
export default handler;