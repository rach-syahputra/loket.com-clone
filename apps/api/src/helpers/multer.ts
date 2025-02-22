import multer from 'multer'

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const MAX_PROFILE_IMAGE_SIZE = 1024000 // 1mb
const MAX_EVENT_BANNER_SIZE = 2048000 // 2mb
const MAX_PAYMENT_PROOF_IMAGE_SIZE = 1024000 // 1mb

export const uploadProfileImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },
  limits: {
    fileSize: MAX_PROFILE_IMAGE_SIZE
  }
})

export const uploadEventBanner = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },
  limits: {
    fileSize: MAX_EVENT_BANNER_SIZE
  }
})

export const uploadPaymentProofImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },
  limits: {
    fileSize: MAX_PAYMENT_PROOF_IMAGE_SIZE
  }
})
