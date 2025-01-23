import SectionContainer from './section-container'

export default function NavigationBar() {
  return (
    <nav className='bg-navy-tertiary flex h-16 items-center'>
      <SectionContainer>
        <p className='text-white'>
          Built with joy, coffee ☕, and 0% bugs (hopefully 🤞).
        </p>
      </SectionContainer>
    </nav>
  )
}
