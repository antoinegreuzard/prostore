import { createBucketClient } from '@cosmicjs/sdk';
import { isAuthenticated } from './auth.js';
import formidable from 'formidable';
import fs from 'fs';

const cosmic = createBucketClient({
  bucketSlug: process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG,
  readKey: process.env.NEXT_PUBLIC_COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadHandler = async function (req, res) {
  const form = formidable({})
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) return reject(err)

      try {
        const cosmicRes = await saveFile(files.file[0])
        res.status(200).json(cosmicRes)
        resolve()
      } catch (error) {
        res.status(404).json(error.message)
        reject(error)
      }
    })
  })
}

const saveFile = async file => {
  const filedata = fs.readFileSync(file?.filepath)
  const media = {
    originalname: file.originalFilename,
    buffer: filedata,
  }
  try {
    // Add media to Cosmic Bucket
    const insertedMediaResponse = await cosmic.media.insertOne({
      media,
    })
    fs.unlinkSync(file?.filepath)
    return insertedMediaResponse
  } catch (error) {
    console.log(error)
    return error
  }
}

const handler = [isAuthenticated, uploadHandler];
export default handler;