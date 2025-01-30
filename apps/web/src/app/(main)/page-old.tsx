import SectionContainer from '@/components/section-container'
import Button from '@/components/button'

export default async function Home() {
  try {
    const res = await fetch('http://localhost:8000/')
    console.log(await res.json())
  } catch (error) {
    console.error(error)
  }

  return (
    <>
      <SectionContainer className='grid grid-cols-8 gap-10 py-4'>
        <div className='col-span-5 flex flex-col gap-4'>
          <h2 className='text-navy-primary text-2xl font-semibold'>
            Welcome to the coolest boilerplate ever.{' '}
          </h2>
          <p>
            Your journey to infinite productivity starts here. Or maybe just
            infinite scrolling... who knows? Either way, grab a cup of coffee,
            buckle up, and prepare to conquer the world—or at least your mini
            project for Purwadhika Digital Technology School.
          </p>
          <span className='text-gray-primary text-sm'>Made for teams.</span>
        </div>

        <div className='col-span-3 flex flex-col gap-4 p-6 shadow-md'>
          <span className='bg-orange-primary w-fit rounded-lg px-2 py-1 uppercase text-white'>
            Blazing Fast
          </span>
          <p>
            Reusable components are so good, you might just find yourself
            reusing things you never thought possible.
          </p>
          <Button className='w-full'>Mulai Mengerjakan</Button>
          <Button variant='outline' className='w-full'>
            Simpan Nanti
          </Button>
        </div>
      </SectionContainer>
    </>
  )
}
