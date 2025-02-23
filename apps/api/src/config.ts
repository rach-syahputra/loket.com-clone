import { CorsOptions } from 'cors'
import { config } from 'dotenv'
import { resolve } from 'path'

export const NODE_ENV = process.env.NODE_ENV || 'development'
const envFile = NODE_ENV === 'development' ? '.env.local' : '.env'

config({ path: resolve(__dirname, `../${envFile}`), override: true })

export const PORT = process.env.PORT || 8000
export const corsOptions: CorsOptions = {
  origin: ['http://localhost:3000', 'https://mini-loket.vercel.app'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: true,
  credentials: true
}

export const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || ''
export const JWT_REFRESH_SECRET = process.env.ACCESS_TOKEN_SECRET || ''

export const CLOUDINARY_USER_PROFILE_IMAGE_FOLDER = 'loket-user-profile-images'
export const CLOUDINARY_EVENT_BANNER_FOLDER = 'loket-event-banners'
export const CLOUDINARY_PAYMENT_PROOF_IMAGE_FOLDER =
  'loket-payment-proof-images'

export const NODEMAILER_USER = process.env.NODEMAILER_USER
export const NODEMAILER_PASS = process.env.NODEMAILER_PASS
