import { createBucketClient } from '@cosmicjs/sdk';

const cosmic = createBucketClient({
  bucketSlug: process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG,
  readKey: process.env.NEXT_PUBLIC_COSMIC_READ_KEY,
});

const is404 = (error) => /not found/i.test(error?.message);

// new versions
export async function getDataByCategory(id) {
  const query = {
    'metadata.categories': [`${id}`],
    type: 'products',
  };

  try {
    const data = await cosmic.objects
      .find(query)
      .props('title,slug,id,metadata,created_at,type,created_by,modified_by')
      .depth(1);
    return data.objects;
  } catch (error) {
    if (is404(error)) return error;
    throw error;
  }
}

export async function getAllDataByType(dataType = 'categories') {
  try {
    const data = await cosmic.objects
      .find({
        type: dataType,
      })
      .props('title,slug,id,metadata,type,created_by,modified_by,created_at')
      .depth(1);
    return data.objects;
  } catch (error) {
    if (is404(error)) return error;
    throw error;
  }
}

export async function getDataBySlug(slug, type = 'products') {
  try {
    const data = await cosmic.objects
      .find({
        slug,
        type,
      })
      .props('slug,title,metadata,id,type,created_by,modified_by,created_at')
      .depth(1);
    return data.objects;
  } catch (error) {
    if (is404(error)) return error;
    throw error;
  }
}
