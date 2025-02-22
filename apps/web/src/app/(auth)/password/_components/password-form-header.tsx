import Link from 'next/link'

import AuthFormHeader, {
  AuthFormHeaderDescription,
  AuthFormHeaderTitle
} from '../../_components/auth-form-header'

export default function PasswordFormHeader() {
  return (
    <AuthFormHeader>
      <AuthFormHeaderTitle>Atur ulang sandimu</AuthFormHeaderTitle>
      <AuthFormHeaderDescription>
        Cari emailmu untuk mengatur ulang sandi
      </AuthFormHeaderDescription>
    </AuthFormHeader>
  )
}
