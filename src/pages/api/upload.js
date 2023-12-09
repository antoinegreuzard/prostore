import { createBucketClient } from '@cosmicjs/sdk';
import fs from 'fs';
import path from 'path';
import haveSecret from './secret';

const formidable = require('formidable');

// Set up your Cosmic client
const cosmic = createBucketClient({
  bucketSlug: process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG,
  readKey: process.env.NEXT_PUBLIC_COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

// Disable the default body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

function isValidFilename(filename) {
  // Implement your validation logic here
  // For example, check against a regular expression for allowed filenames
  return /^[a-zA-Z0-9.-]+$/.test(filename);
}

const saveFile = async (file) => {
  // Define a safe directory
  const safeDirectory = '/path/to/your/safe/directory/';

  // Extract just the filename and validate it
  const filename = path.basename(file.originalFilename);
  if (!isValidFilename(filename)) {
    throw new Error('Invalid filename');
  }

  const safeFilePath = path.join(safeDirectory, filename);

  // Read and process the file from a safe file path
  const filedata = fs.readFileSync(safeFilePath);
  const media = {
    originalname: filename,
    buffer: filedata,
  };

  try {
    await cosmic.media.insertOne({ media });
    await fs.unlinkSync(safeFilePath);
    return await cosmic.media.insertOne({ media });
  } catch (error) {
    return error;
  }
};

async function uploadHandler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return undefined; // Explicitly return undefined
  }

  const form = new formidable.IncomingForm();

  // Wrap the form.parse in a new Promise
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(err.status || 500).json({ error: 'Erreur lors du traitement du fichier' });
        reject(err); // Reject the promise
        return undefined; // Explicitly return undefined
      }
      try {
        const cosmicRes = await saveFile(files.file[0]);
        res.status(200).json(cosmicRes);
        resolve(); // Resolve the promise
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
        reject(error); // Reject the promise
      }
      return undefined; // Explicitly return undefined
    });
  });
}

// Export your uploadHandler wrapped with haveSecret
export default haveSecret(uploadHandler);
