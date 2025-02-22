'use client'

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState
} from 'react'
import {
  faCalendar,
  faChevronLeft,
  faClock,
  faPenToSquare,
  faX
} from '@fortawesome/free-solid-svg-icons'

import { cn } from '@/lib/utils'
import Icon from '@/components/icon'
import ModalContainer from '@/components/modal-container'
import Button from '@/components/button'

type ActiveTab = 'date' | 'time'

type EventDateTriggerProps = {
  eventDate?: string
  eventTime?: string
}

type EventDateModalProps = {
  children: React.ReactNode
}

type EventActiveTabProps = {
  label: string
  isActive: boolean
  onActiveChange: () => void
}

type EventDateTabProps = {
  children: React.ReactNode
}

type EventTimeTabProps = {
  children: React.ReactNode
}

interface IEventDateContext {
  activeTab: ActiveTab
  setActiveTab: Dispatch<SetStateAction<ActiveTab>>
  openModal: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
}

const EventDateContext = createContext<IEventDateContext | undefined>(undefined)

export const EventDateProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('date')
  const [openModal, setOpenModal] = useState<boolean>(false)

  return (
    <EventDateContext.Provider
      value={{
        activeTab,
        setActiveTab,
        openModal,
        setOpenModal
      }}
    >
      <div className='w-full'>{children}</div>
    </EventDateContext.Provider>
  )
}

const useEventDateContext = (): IEventDateContext => {
  const context = useContext(EventDateContext)
  if (context === undefined) {
    throw new Error(
      'useEventDateContext must be used within a EventDateProvider'
    )
  }
  return context
}

export function EventDateTrigger({
  eventDate,
  eventTime
}: EventDateTriggerProps) {
  const { setActiveTab, setOpenModal } = useEventDateContext()

  return (
    <div className='flex select-none flex-col gap-2'>
      <span className='text-gray-secondary mb-1 text-sm font-medium'>
        Tanggal & Waktu Event
      </span>
      <div
        onClick={() => {
          setOpenModal(true)
          setActiveTab('date')
        }}
        className='flex cursor-pointer items-center gap-2'
      >
        <div className='flex h-5 w-5 items-center'>
          <Icon icon={faCalendar} className='w-4 text-gray-400' />
        </div>
        {eventDate ? (
          <div className='flex items-center gap-4'>
            <span className='text-dark-primary'>{eventDate}</span>
            <div className='w-3.5'>
              <Icon icon={faPenToSquare} className='text-blue-primary w-3.5' />
            </div>
          </div>
        ) : (
          <span className='text-gray-primary'>Pilih Tanggal</span>
        )}
      </div>

      <div
        onClick={() => {
          setOpenModal(true)
          setActiveTab('time')
        }}
        className='flex cursor-pointer items-center gap-2'
      >
        <div className='flex h-5 w-5 items-center'>
          <Icon icon={faClock} className='w-4 text-gray-400' />
        </div>
        {eventTime ? (
          <div className='flex items-center gap-4'>
            <span className='text-dark-primary'>{eventTime}</span>
            <div className='w-3.5'>
              <Icon icon={faPenToSquare} className='text-blue-primary w-3.5' />
            </div>
          </div>
        ) : (
          <span className='text-gray-primary'>Pilih Waktu</span>
        )}
      </div>
    </div>
  )
}

export function EventDateModal({ children }: EventDateModalProps) {
  const { activeTab, setActiveTab, openModal, setOpenModal } =
    useEventDateContext()

  if (openModal)
    return (
      <ModalContainer
        isOpen={openModal}
        handleClose={() => setOpenModal(false)}
      >
        <div className='shadow-default relative mx-auto flex h-[80vh] w-full flex-col gap-10 rounded-2xl bg-white p-7 sm:h-[450px] sm:w-[450px]'>
          <Icon
            icon={faX}
            onClick={() => setOpenModal(false)}
            className='hover:text-gray-primary absolute right-4 top-4 w-3 cursor-pointer text-gray-300 transition-all duration-150 ease-in-out'
          />
          <div className='items flex justify-between border-b border-gray-400 text-center'>
            <EventActiveTab
              label='TANGGAL EVENT'
              isActive={activeTab === 'date'}
              onActiveChange={() => setActiveTab('date')}
            />
            <EventActiveTab
              label='WAKTU EVENT'
              isActive={activeTab === 'time'}
              onActiveChange={() => setActiveTab('time')}
            />
          </div>
          {children}
        </div>
      </ModalContainer>
    )
}

function EventActiveTab({
  label,
  isActive,
  onActiveChange
}: EventActiveTabProps) {
  return (
    <div
      onClick={onActiveChange}
      className='group relative flex h-[53px] w-full cursor-pointer items-center justify-center'
    >
      <span
        className={cn(
          'select-none text-sm font-medium text-gray-400 group-hover:text-gray-500',
          {
            'text-dark-primary group-hover:text-dark-primary': isActive
          }
        )}
      >
        {label}
      </span>
      <div
        className={cn(
          'absolute bottom-0 left-0 h-[3px] w-full rounded-tl-xl rounded-tr-xl',
          {
            'bg-blue-primary': isActive
          }
        )}
      ></div>
    </div>
  )
}

export function EventDateTab({ children }: EventDateTabProps) {
  const { activeTab, setActiveTab } = useEventDateContext()

  if (activeTab === 'date')
    return (
      <div className='flex h-full flex-col justify-between'>
        <div className='flex flex-col gap-10'>{children}</div>
        <Button
          onClick={() => setActiveTab('time')}
          className='h-10 w-full font-medium'
        >
          SELANJUTNYA
        </Button>
      </div>
    )
}

export function EventTimeTab({ children }: EventTimeTabProps) {
  const { activeTab, setActiveTab, setOpenModal } = useEventDateContext()

  if (activeTab === 'time')
    return (
      <div className='flex h-full flex-col justify-between'>
        <div className='flex w-full flex-col gap-10'>{children}</div>
        <div className='flex items-center gap-4'>
          <Button onClick={() => setActiveTab('date')} className='h-10 px-5'>
            <Icon icon={faChevronLeft} className='w-2.5' />
          </Button>
          <Button
            onClick={() => setOpenModal(false)}
            className='h-10 w-full font-medium'
          >
            SIMPAN
          </Button>
        </div>
      </div>
    )
}
