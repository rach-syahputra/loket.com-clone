'use client'
import { useEffect, useState } from 'react'
import { CardExplore } from '@/components/cards'
import { API_BASE_URL } from '@/lib/constants'
import { Province } from '@/lib/interfaces/location.interface'
import { Category } from '@/lib/interfaces/category.interface'
import { TicketType } from '@/lib/interfaces/transaction.interface'




export default function Explore() {
  const [province, setProvince] = useState<Province[]>([])
  const [category, setCategory] = useState<Category[]>([])

  const [selectedProvinceId, setSelectedProvinceId] = useState<number| null>(
    null
  )
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  )
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null)

  const [filterTabActive, setFilterTabActive] = useState(false)

  useEffect(() => {
    if (filterTabActive) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [filterTabActive])
  const cleanFilters = () => {
    setSelectedProvinceId(null)
    setSelectedCategoryId(null)
    setSelectedTicketType(null)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await fetch(
          `${API_BASE_URL}/categories`
        )
        const categoryData = await categoryResponse.json()
        if (categoryData.data) {
          setCategory(categoryData.data)
        }

        const provinceResponse = await fetch(
          `${API_BASE_URL}/provinces`
        )
        const provinceData = await provinceResponse.json()
        if (provinceData.data) {
          setProvince(provinceData.data)
        }
      } catch (error) {
        console.log('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const filterContent = (
    <div className='w-full'>
      {/* Lokasi (Province) */}
      <details
        tabIndex={0}
        className='collapse-arrow rounded-box collapse z-50'
      >
        <summary className='collapse-title text-lg font-medium text-black'>
          Lokasi
        </summary>
        <div className='collapse-content max-h-[300px] overflow-y-auto'>
          <div className='flex flex-col gap-4 text-black'>
            {province.length > 0 &&
              province.map((prov) => (
                <button
                  key={prov.id}
                  className={`p-1 text-left text-black no-underline ${
                    selectedProvinceId === prov.id ? 'bg-gray-300' : ''
                  }`}
                  onClick={() => {
                    setSelectedProvinceId(
                      selectedProvinceId === prov.id ? null : prov.id
                    )
                  }}
                >
                  {prov.name}
                </button>
              ))}
          </div>
        </div>
      </details>

      {/* Kategori (Category) */}
      <details
        tabIndex={0}
        className='collapse-arrow rounded-box collapse mt-2'
      >
        <summary className='collapse-title text-lg font-medium text-black'>
          Kategori
        </summary>
        <div className='collapse-content max-h-[300px] overflow-y-auto'>
          <div className='flex flex-col gap-4 text-black'>
            {category.length > 0 &&
              category.map((cat) => (
                <button
                  key={cat.id}
                  className={`p-1 text-left text-black no-underline ${
                    selectedCategoryId === cat.id ? 'bg-gray-300' : ''
                  }`}
                  onClick={() => {
                    setSelectedCategoryId(
                      selectedCategoryId === cat.id ? null : cat.id
                    )
                  }}
                >
                  {cat.name}
                </button>
              ))}
          </div>
        </div>
      </details>

      {/* Tipe Tiket (TicketType) */}
      <details
        tabIndex={0}
        className='collapse-arrow rounded-box collapse mt-2'
      >
        <summary className='collapse-title text-lg font-medium text-black'>
          Tipe Tiket
        </summary>
        <div className='collapse-content max-h-[200px] overflow-y-auto'>
          <div className='flex flex-col gap-4 text-black'>
            <button
              className={`p-1 text-left ${selectedTicketType === 'PAID' ? 'bg-gray-300' : ''}`}
              onClick={() => {
                setSelectedTicketType(
                  selectedTicketType === 'PAID' ? null : 'PAID'
                )
              }}
            >
              Berbayar
            </button>
            <button
              className={`p-1 text-left ${selectedTicketType === 'FREE' ? 'bg-gray-300' : ''}`}
              onClick={() => {
                setSelectedTicketType(
                  selectedTicketType === 'FREE' ? null : 'FREE'
                )
              }}
            >
              Gratis
            </button>
          </div>
        </div>
      </details>
    </div>
  )

  return (
    <div className='min-h-screen w-full bg-white p-[20px] sm:p-0'>
      <div className='block gap-4 sm:flex sm:gap-0'>
        {/* Desktop Filter Panel */}
        <div className='relative sticky top-0 z-[9999] hidden min-h-[100%] border bg-white p-[50px] sm:block sm:w-[230px] md:p-[20px] lg:w-[300px]'>
          <span className='text-[20px] font-bold text-black'>Filter</span>
          <hr />
          {filterContent}
          <button
            className='w-full rounded border p-2 text-black'
            onClick={() => cleanFilters()}
          >
            Bersihkan Filters
          </button>
        </div>

        <div className='flex w-full flex-col gap-4'>
          {/* Mobile Filter Button */}
          <div className='z-30 px-[20px]'>
            <button
              tabIndex={0}
              className='h-[36px] w-full rounded-lg border p-2 text-center text-black sm:hidden'
              onClick={() => setFilterTabActive(true)}
            >
              Filter
            </button>
          </div>

          <CardExplore
            selectedProvinceId={String(selectedProvinceId)}
            selectedCategoryId={String(selectedCategoryId)}
            selectedTicketType={selectedTicketType}
          />

          {/* Mobile Filter Modal */}
          {filterTabActive && (
            <div className='fixed inset-0 z-[9999] flex h-full w-full flex-col items-center justify-center bg-white'>
              <div className='max-h-[80vh] w-full overflow-y-auto px-4'>
                <div className='mb-4 flex items-center justify-between'>
                  <span className='text-lg font-bold'>Filter</span>
                  <button
                    onClick={() => setFilterTabActive(false)}
                    className='text-black'
                  >
                    Close
                  </button>
                </div>
                {filterContent}
                <div className='mt-4 flex flex-col gap-4 px-4'>
                  <button
                    className='w-full rounded border p-2 text-black'
                    onClick={() => setFilterTabActive(false)}
                  >
                    Terapkan Filters
                  </button>
                  <button
                    className='w-full rounded border p-2 text-black'
                    onClick={() => cleanFilters()}
                  >
                    Bersihkan Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
