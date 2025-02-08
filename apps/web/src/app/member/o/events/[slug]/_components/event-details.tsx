import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import Image from 'next/image'
import { Plus } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/shadcn-ui/form'

type ActiveTab = 'TICKET_CATEGORY' | 'EVENT_DESCRIPTION'
type TicketType = 'FREE' | 'PAID'

type EventDetailsTabProps = {
  label: string
  isActive: boolean
  onActiveChange: () => void
}

type TicketCategoryButtonProps<T extends FieldValues> = {
  label: string
  isActive: boolean
  ticketType: TicketType
  name: Path<T>
  form: UseFormReturn<T, any, undefined>
}

type TicketCategoryTabProps = {
  children: React.ReactNode
}

type EventDescriptionTabProps = {
  children: React.ReactNode
}

interface IEventDetailsContext {
  activeTab: ActiveTab
  setActiveTab: Dispatch<SetStateAction<ActiveTab>>
  ticketType: TicketType | null
  setTicketType: Dispatch<SetStateAction<TicketType | null>>
}

const EventDetailsContext = createContext<IEventDetailsContext | undefined>(
  undefined
)

export const EventDetailsProvider = ({
  activeTicketType,
  children
}: {
  activeTicketType?: TicketType
  children: React.ReactNode
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('TICKET_CATEGORY')
  const [ticketType, setTicketType] = useState<TicketType | null>(null)

  useEffect(() => {
    if (activeTicketType) setTicketType(activeTicketType)
  }, [activeTicketType])

  return (
    <EventDetailsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        ticketType,
        setTicketType
      }}
    >
      <div className='w-full px-4 lg:px-0'>
        <div className='flex w-full items-center justify-center border-b border-gray-300'>
          <EventDetailsTab
            label='KATEGORI TIKET'
            isActive={activeTab === 'TICKET_CATEGORY'}
            onActiveChange={() => setActiveTab('TICKET_CATEGORY')}
          />
          <EventDetailsTab
            label='DESKRIPSI EVENT'
            isActive={activeTab === 'EVENT_DESCRIPTION'}
            onActiveChange={() => setActiveTab('EVENT_DESCRIPTION')}
          />
        </div>
        {children}
      </div>
    </EventDetailsContext.Provider>
  )
}

const useEventDetailsContext = (): IEventDetailsContext => {
  const context = useContext(EventDetailsContext)
  if (context === undefined) {
    throw new Error(
      'useEventDetailsContext must be used within a EventDetailsProvider'
    )
  }
  return context
}

export function EventDetailsTab({
  label,
  isActive,
  onActiveChange
}: EventDetailsTabProps) {
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

export function TicketCategoryButton<T extends FieldValues>({
  label,
  isActive,
  ticketType,
  form,
  name
}: TicketCategoryButtonProps<T>) {
  const { setTicketType } = useEventDetailsContext()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='w-full'>
          <FormLabel className='text-gray-secondary sr-only'>{label}</FormLabel>
          <FormControl>
            <button
              type='button'
              onClick={() => {
                field.onChange(ticketType)
                setTicketType(ticketType)
              }}
              className={cn(
                'ticket-category-button group relative flex h-[90px] w-full items-center rounded-md border border-gray-400 transition-all duration-150 ease-in-out hover:overflow-hidden hover:border-none hover:bg-[#007aff]',
                {
                  'overflow-hidden border-none bg-[#007aff]': isActive
                }
              )}
            >
              <div
                className={cn(
                  'flex h-full w-[53px] items-center justify-center border-r-2 border-dashed border-gray-400 group-hover:border-none group-hover:bg-[#007bffd8]',
                  {
                    'border-none bg-[#007bffd8]': isActive
                  }
                )}
              >
                <Image
                  src='/barcode.svg'
                  alt='Barcode icon'
                  width={9}
                  height={58}
                  className='w-[9px]'
                />
              </div>
              <div className='ticket-label relative box-border flex h-full w-full items-center justify-between px-3 py-4 text-left'>
                <div className='flex flex-col items-start'>
                  <span
                    className={cn(
                      'text-gray-secondary text-sm group-hover:text-white',
                      {
                        'text-white': isActive
                      }
                    )}
                  >
                    Buat Tiket
                  </span>
                  <span
                    className={cn(
                      'text-gray-secondary text-lg font-medium leading-none group-hover:text-white',
                      {
                        'text-white': isActive
                      }
                    )}
                  >
                    {label}
                  </span>
                </div>
                <div
                  className={cn(
                    'border-gray-primary z-20 flex aspect-square w-[42px] items-center justify-center rounded-full border group-hover:border-white',
                    {
                      'border-white': isActive
                    }
                  )}
                >
                  <Plus
                    className={cn(
                      'text-gray-primary w-6 group-hover:text-white',
                      {
                        'text-white': isActive
                      }
                    )}
                  />
                </div>
                <div
                  className={cn(
                    'bg-blue-secondary invisible absolute -right-36 top-0 h-[100px] w-[240px] rotate-45 opacity-0 transition-opacity duration-150 ease-in-out group-hover:visible group-hover:opacity-100',
                    {
                      'visible opacity-100': isActive
                    }
                  )}
                ></div>
              </div>
            </button>
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export function TicketCategoryTab({ children }: TicketCategoryTabProps) {
  const { activeTab } = useEventDetailsContext()

  if (activeTab === 'TICKET_CATEGORY')
    return <div className='flex flex-col'>{children}</div>
}

export function PaidTicketForm({ children }: { children: React.ReactNode }) {
  const { ticketType } = useEventDetailsContext()
  if (ticketType === 'PAID') return <>{children}</>
}

export function FreeTicketForm({ children }: { children: React.ReactNode }) {
  const { ticketType } = useEventDetailsContext()
  if (ticketType === 'FREE') return <>{children}</>
}

export function EventDescriptionTab({ children }: EventDescriptionTabProps) {
  const { activeTab } = useEventDetailsContext()

  if (activeTab === 'EVENT_DESCRIPTION')
    return <div className='py-5'>{children}</div>
}
