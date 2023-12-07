import { createBucketClient } from '@cosmicjs/sdk'
import formidable from 'formidable'
import fs from 'fs'
import haveSecret from './secret.js';

const cosmic = createBucketClient({
  bucketSlug: process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG,
  readKey: process.env.NEXT_PUBLIC_COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
})

export const config = {
  api: {
    bodyParser: false,
  },
}

async function uploadHandler(req, res) {
  const form = formidable({});

  try {
    await form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(err.status).json({ error: 'Erreur lors du traitement du fichier' });
        return;
      }
      const cosmicRes = await saveFile(files.file[0]);
      res.status(200).json(cosmicRes);
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

const saveFile = async file => {
  const filedata = fs.readFileSync(file?.filepath)
  const media = {
    originalname: file.originalFilename,
    buffer: filedata,
  }
  try {
    await cosmic.media.insertOne({
      media,
    })
    await fs.unlinkSync(file?.filepath)
    return await cosmic.media.insertOne({ media })
  } catch (error) {
    console.error(error)
    return error
  }
}

const handler = async (req, res) => {
  await haveSecret(req, res, async () => {
    await uploadHandler(req, res);
  });
};
export default handler;