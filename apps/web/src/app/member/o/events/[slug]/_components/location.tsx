import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState
} from 'react'
import {
  faLocationDot,
  faPenToSquare,
  faX
} from '@fortawesome/free-solid-svg-icons'

import { cn } from '@/lib/utils'
import Icon from '@/components/icon'
import ModalContainer from '@/components/modal-container'
import Button from '@/components/button'

type LocationTriggerProps = {
  location?: string
}

type LocationModalProps = {
  children: React.ReactNode
}

interface ILocationContext {
  openModal: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
}

const LocationContext = createContext<ILocationContext | undefined>(undefined)

export const LocationProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false)

  return (
    <LocationContext.Provider
      value={{
        openModal,
        setOpenModal
      }}
    >
      <div className='w-full'>{children}</div>
    </LocationContext.Provider>
  )
}

const useLocationContext = (): ILocationContext => {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider')
  }
  return context
}

export function LocationTrigger({ location }: LocationTriggerProps) {
  const { setOpenModal } = useLocationContext()

  return (
    <div className='flex select-none flex-col gap-2'>
      <span className='text-gray-secondary mb-1 text-sm font-medium'>
        Lokasi
      </span>
      <div
        onClick={() => setOpenModal(true)}
        className='flex cursor-pointer items-center gap-2'
      >
        <div className='flex h-5 w-5 items-center'>
          <Icon icon={faLocationDot} className='w-4 text-gray-400' />
        </div>

        {location ? (
          <div className='flex items-center gap-4'>
            <span className='text-dark-primary'>{location}</span>
            <div className='w-3.5'>
              <Icon icon={faPenToSquare} className='text-blue-primary w-3.5' />
            </div>
          </div>
        ) : (
          <span className='text-gray-primary'>Pilih Lokasi</span>
        )}
      </div>
    </div>
  )
}

export function LocationModal({ children }: LocationModalProps) {
  const { openModal, setOpenModal } = useLocationContext()

  return (
    <ModalContainer isOpen={openModal} handleClose={() => setOpenModal(false)}>
      <div className='shadow-default relative mx-auto flex h-[80vh] w-full flex-col justify-between rounded-2xl bg-white p-7 sm:h-[450px] sm:w-[450px]'>
        <div className='flex flex-col gap-10'>
          <Icon
            icon={faX}
            onClick={() => setOpenModal(false)}
            className='hover:text-gray-primary absolute right-4 top-4 w-3 cursor-pointer text-gray-300 transition-all duration-150 ease-in-out'
          />
          {children}
        </div>
        <Button
          onClick={() => setOpenModal(false)}
          className='h-10 w-full font-medium'
        >
          SIMPAN
        </Button>
      </div>
    </ModalContainer>
  )
}
