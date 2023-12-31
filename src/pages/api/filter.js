import { createBucketClient } from '@cosmicjs/sdk'

const cosmic = createBucketClient({
  bucketSlug: process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG,
  readKey: process.env.NEXT_PUBLIC_COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
})

export default async function filterHandler(req, res) {
  const {
    query: {
      min, max, category, search,
    },
  } = req

  let queryParam = {}

  if (
    (typeof min !== 'undefined' && min !== 'undefined')
    || (typeof max !== 'undefined' && max !== 'undefined')
  ) {
    queryParam = {
      ...queryParam,
      'metadata.price': {
        $gte: typeof min !== 'undefined' ? Number(min) : 1,
        $lte: typeof max !== 'undefined' ? Number(max) : 1000000000,
      },
    }
  }

  if (typeof category !== 'undefined' && category !== 'undefined') {
    queryParam = { ...queryParam, 'metadata.categories': category }
  }

  if (search && typeof search !== 'undefined' && search !== 'undefined') {
    queryParam = { ...queryParam, title: { $regex: search, $options: 'i' } }
  }

  try {
    const data = await cosmic.objects
      .find({
        ...queryParam,
        type: 'products',
      })
      .props('title,slug,id,metadata,created_at,type,created_by,modified_by')
      .depth(1)
    res.status(200).json(data)
  } catch (error) {
    res.status(res.status).json(error)
  }
}
