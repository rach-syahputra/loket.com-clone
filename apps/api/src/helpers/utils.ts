import bcrypt from 'bcrypt'

export function calculatePointsExpiryDate(): Date {
  const currentDate = new Date()
  currentDate.setMonth(currentDate.getMonth() + 3) // Add 3 months to the current month
  return currentDate
}

export async function generateHashedPassword(password: string) {
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(password, salt)

  return hashedPassword
}
