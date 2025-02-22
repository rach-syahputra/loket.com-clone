export default function AuthFormHeader({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col items-center justify-center'>{children}</div>
  )
}

export function AuthFormHeaderTitle({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <h2 className='text-dark-primary text-[21px] font-semibold'>{children}</h2>
  )
}

export function AuthFormHeaderDescription({
  children
}: {
  children: React.ReactNode
}) {
  return <p className='text-sm text-[#666666]'>{children}</p>
}
