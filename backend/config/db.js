import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const DB_URL = process.env.DB_URL

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL)
    console.log('✅ DB CONNECTED', DB_URL)
  } catch (err) {
    console.error('❌ DB CONNECTION ERROR:', err.message)
    process.exit(1) // prekini app ako baza ne radi
  }
}
