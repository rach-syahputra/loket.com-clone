import HeaderRight from './header-right'

type DashboardHeaderProps = {
  title: string
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <div className='shadow-dashboard-header flex w-full items-center justify-center p-4 md:px-10 md:py-5'>
      <div className='flex h-10 w-full items-center justify-between'>
        <h1 className='text-gray-secondary text-[22px] font-medium'>{title}</h1>

        <HeaderRight />
      </div>
    </div>
  )
}
