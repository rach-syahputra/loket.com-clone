import nodemailer from 'nodemailer'
import path from 'path'
import fs from 'fs'
import handlebars from 'handlebars'

import {
  EmailPasswordResetBodyData,
  EmailPaymentBodyData
} from '../../interfaces/email.interface'
import { NODEMAILER_PASS, NODEMAILER_USER } from '../../config'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASS
  }
})

export const sendPaymentEmail = async (
  to: string,
  status: 'DONE' | 'REJECTED',
  bodyData: EmailPaymentBodyData
) => {
  const templatePath =
    status === 'DONE'
      ? path.join(__dirname, 'email-accepted-payment-template.hbs')
      : path.join(__dirname, 'email-rejected-payment-template.hbs')
  const templateSource = fs.readFileSync(templatePath, 'utf8')
  const template = handlebars.compile(templateSource)

  const subject =
    status === 'DONE'
      ? `[${bodyData.transactionId}] E-Voucher for ${bodyData.eventTitle}`
      : `Payment rejected`
  const html = template(bodyData)

  try {
    await transporter.sendMail({
      from: 'Mini Loket',
      to,
      subject,
      html
    })
  } catch (error) {
    console.error(error)
  }
}

export const sendPasswordResetEmail = async (
  to: string,
  bodyData: EmailPasswordResetBodyData
) => {
  const templatePath = path.join(__dirname, 'email-password-reset-template.hbs')
  const templateSource = fs.readFileSync(templatePath, 'utf8')
  const template = handlebars.compile(templateSource)

  const subject = 'Reset Kata Sandi'
  const html = template(bodyData)

  try {
    await transporter.sendMail({
      from: 'Mini Loket',
      to,
      subject,
      html
    })
  } catch (error) {
    console.error(error)
  }
}
