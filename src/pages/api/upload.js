// Import necessary modules and your haveSecret function
import { createBucketClient } from '@cosmicjs/sdk'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import haveSecret from './secret'

const formidable = require('formidable')

// Set up your Cosmic client
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

function generateSecureFilename(originalFilename) {
  const extension = path.extname(originalFilename).toLowerCase()
  // Ajouter des vérifications pour les extensions autorisées si nécessaire
  return uuidv4() + extension
}

const saveFile = async (file) => {
  // Valider le chemin du fichier
  if (!file?.filepath || !/^[a-zA-Z0-9_\-./]+$/.test(file.filepath)) {
    throw new Error('Chemin de fichier non sécurisé')
  }

  // Générer un nouveau nom de fichier sécurisé
  const secureFilename = generateSecureFilename(file.originalFilename)

  const filedata = fs.readFileSync(file?.filepath)
  const media = {
    originalname: secureFilename,
    buffer: filedata,
  }

  try {
    await cosmic.media.insertOne({ media })
    await fs.unlinkSync(file?.filepath)
    return await cosmic.media.insertOne({ media })
  } catch (error) {
    return error
  }
}

async function uploadHandler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return undefined // Explicitly return undefined
  }

  const form = new formidable.IncomingForm()

  // Wrap the form.parse in a new Promise
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(err.status || 500).json({ error: 'Erreur lors du traitement du fichier' })
        reject(err) // Reject the promise
        return undefined // Explicitly return undefined
      }
      try {
        const cosmicRes = await saveFile(files.file[0])
        res.status(200).json(cosmicRes)
        resolve() // Resolve the promise
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message })
        reject(error) // Reject the promise
      }
      return undefined // Explicitly return undefined
    })
  })
}

// Export your uploadHandler wrapped with haveSecret
export default haveSecret(uploadHandler)
