'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { ChevronsUpDown } from 'lucide-react'

import { useToast } from '@/hooks/use-toast'
import { fetchUpdateEvent } from '@/lib/apis/event.api'
import {
  Event,
  UpdateEventFormSchemaType
} from '@/lib/interfaces/organizer.interface'
import {
  BannerSchema,
  UpdateEventFormSchema
} from '@/lib/validations/event.validation'
import { Category } from '@/lib/interfaces/category.interface'
import { Province } from '@/lib/interfaces/location.interface'
import { cn, formatEventDate, formatNumber } from '@/lib/utils'
import { HOURS, MINUTES } from '@/lib/constants'
import { useLoadingContext } from '@/context/loading-context'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/shadcn-ui/form'
import Button from '@/components/button'
import { Input } from '@/components/shadcn-ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/shadcn-ui/select'
import Icon from '@/components/icon'
import { Textarea } from '@/components/shadcn-ui/textarea'
import DateInputForm from './date-input-form'
import {
  EventDateModal,
  EventDateProvider,
  EventDateTab,
  EventDateTrigger,
  EventTimeTab
} from './event-date'
import { LocationModal, LocationProvider, LocationTrigger } from './location'
import {
  EventDescriptionTab,
  EventDetailsProvider,
  FreeTicketForm,
  PaidTicketForm,
  TicketCategoryButton,
  TicketCategoryTab
} from './event-details'
import BannerInput from './banner-input'

type UpdateEventFormProps = {
  event: Event
  categories: Category[]
  provinces: Province[]
}

export default function UpdateEventForm({
  event,
  categories,
  provinces
}: UpdateEventFormProps) {
  const { setIsLoading } = useLoadingContext()
  const { toast } = useToast()

  const [bannerPreview, setBannerPreview] = useState<string>(
    '/default-banner.jpg'
  )
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<UpdateEventFormSchemaType>({
    resolver: zodResolver(UpdateEventFormSchema),
    defaultValues: {
      eventId: event.id,
      organizerId: event.organizerId,
      title: event.title,
      description: event.description,
      banner: null,
      registrationStartDate: new Date(event.registrationStartDate),
      registrationEndDate: new Date(event.registrationEndDate),
      eventStartDate: new Date(event.eventStartDate),
      eventEndDate: new Date(event.eventEndDate),
      eventStartHour: event.eventStartTime.split(':')[0],
      eventStartMinute: event.eventStartTime.split(':')[1],
      eventEndHour: event.eventEndTime.split(':')[0],
      eventEndMinute: event.eventEndTime.split(':')[1],
      price: event.price,
      availableSeats: event.availableSeats,
      locationId: event.location.id,
      provinceId: event.location.province.id,
      city: event.location.city,
      streetAddress: event.location.streetAddress,
      categoryId: event.categoryId,
      ticketType: event.ticketType
    }
  })

  const handleBannerUploadClick = () => {
    bannerInputRef.current?.click()
  }

  const updateBanner = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]

      const bannerIsVerified = BannerSchema.safeParse(file)

      if (bannerIsVerified.success) {
        setBannerPreview(URL.createObjectURL(file))
        form.setValue('banner', file)
        form.setError('banner', { message: '' })
      } else {
        form.setError('banner', {
          message: bannerIsVerified.error.issues[0]?.message
        })
      }
    }
  }

  const onSubmit = async (values: UpdateEventFormSchemaType) => {
    try {
      setIsLoading(true)

      const formData = new FormData()

      formData.append('eventId', values.eventId.toString())
      formData.append('organizerId', values.organizerId.toString())
      if (values.title && values.title !== event.title)
        formData.append('title', values.title)
      if (values.description && values.description !== event.description)
        formData.append('description', values.description)
      if (values.banner) formData.append('banner', values.banner)
      if (
        values.registrationStartDate &&
        values.registrationStartDate.toISOString() !==
          event.registrationStartDate
      )
        formData.append(
          'registrationStartDate',
          values.registrationStartDate.toISOString()
        )
      if (
        values.registrationEndDate &&
        values.registrationEndDate.toISOString() !== event.registrationEndDate
      )
        formData.append(
          'registrationEndDate',
          values.registrationEndDate.toISOString()
        )
      if (
        values.eventStartDate &&
        values.eventStartDate.toISOString() !== event.eventStartDate
      )
        formData.append('eventStartDate', values.eventStartDate.toISOString())
      if (
        values.eventEndDate &&
        values.eventEndDate.toISOString() !== event.eventEndDate
      )
        formData.append('eventEndDate', values.eventEndDate.toISOString())
      if (values.eventStartHour && values.eventStartMinute)
        formData.append(
          'eventStartTime',
          `${values.eventStartHour}:${values.eventStartMinute}`
        )
      if (values.eventEndHour && values.eventEndMinute)
        formData.append(
          'eventEndTime',
          `${values.eventEndHour}:${values.eventEndMinute}`
        )
      if (values.price)
        formData.append(
          'price',
          values.ticketType === 'PAID' ? values.price.toString() : '0'
        )
      if (
        values.availableSeats &&
        values.availableSeats !== event.availableSeats
      )
        formData.append('availableSeats', values.availableSeats.toString())
      if (values.locationId)
        formData.append('locationId', values.locationId.toString())
      if (values.provinceId && values.provinceId !== event.location.province.id)
        formData.append('provinceId', values.provinceId.toString())
      if (
        values.streetAddress &&
        values.streetAddress !== event.location.streetAddress
      )
        formData.append('streetAddress', values.streetAddress)
      if (values.city && values.city !== event.location.city)
        formData.append('city', values.city)
      if (values.categoryId && values.categoryId !== event.categoryId)
        formData.append('categoryId', values.categoryId.toString())
      if (values.ticketType && values.ticketType !== event.ticketType)
        formData.append('ticketType', values.ticketType)

      const response = await fetchUpdateEvent(
        values.eventId.toString(),
        formData
      )

      if (response?.success) {
        toast({
          title: 'Success',
          description: 'Update event berhasil.'
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (event.bannerUrl) {
      setBannerPreview(event.bannerUrl)
    }
  }, [form, event])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex max-w-[900px] flex-col gap-10 py-4 lg:px-6 lg:py-6'
      >
        <div className='flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2'>
          <BannerInput
            form={form}
            name='banner'
            bannerPreview={bannerPreview}
            inputRef={bannerInputRef}
            onInputClick={handleBannerUploadClick}
            onInputChange={updateBanner}
            isDefault={!event.bannerUrl}
          />
          <div className='flex w-full flex-col items-center justify-center px-4 py-[15px] lg:px-9'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-secondary sr-only'>
                    Nama Event
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Nama Event*'
                      {...field}
                      className='text-dark-primary h-10 w-full border-none px-0 py-0 text-[21px] outline-none focus:border-none focus:bg-transparent'
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='text-gray-secondary sr-only'>
                    Kategori
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className='h-10 border-none p-0 text-base'>
                          <div
                            className={cn(
                              'text-gray-primary flex h-full w-full items-start justify-between border-b border-gray-300 py-1',
                              {
                                'text-blue-primary': field.value
                              }
                            )}
                          >
                            <div className='flex items-center justify-center gap-3'>
                              <SelectValue placeholder='Pilih Kategori*' />
                              <Icon
                                icon={faPenToSquare}
                                className='text-blue-primary w-3.5'
                              />
                            </div>
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='shadow-default'>
                        {categories.length > 0 &&
                          categories.map((category, index) => (
                            <SelectItem
                              key={index}
                              value={category.id.toString()}
                              className='text-gray-secondary focus:bg-blue-primary text-base focus:text-white'
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className='flex w-full flex-col gap-8 py-6 lg:flex-row'>
              <EventDateProvider>
                <EventDateTrigger
                  eventDate={formatEventDate(
                    form.watch('eventStartDate')?.toISOString()!,
                    form.watch('eventEndDate')?.toISOString()!
                  )}
                  eventTime={`${form.watch('eventStartHour')}:${form.watch('eventStartMinute')} - ${form.watch('eventEndHour')}:${form.watch('eventEndMinute')}`}
                />

                <EventDateModal>
                  <EventDateTab>
                    <DateInputForm
                      form={form}
                      name='eventStartDate'
                      label='Tanggal Mulai'
                    />
                    <DateInputForm
                      form={form}
                      name='eventEndDate'
                      label='Tanggal Berakhir'
                    />
                  </EventDateTab>

                  <EventTimeTab>
                    <div className='items-centers grid w-full grid-cols-2 justify-center gap-4'>
                      <div className='flex w-full flex-col gap-2'>
                        <span className='text-sm'>Mulai Dari</span>
                        <div className='flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 p-4'>
                          <Icon
                            icon={faClock}
                            className='text-gray-secondary w-4'
                          />
                          <div className='flex w-full items-center justify-between'>
                            <FormField
                              control={form.control}
                              name='eventStartHour'
                              render={({ field }) => (
                                <FormItem className='space-y-0'>
                                  <FormLabel className='text-gray-secondary sr-only'>
                                    Jam Mulai Event
                                  </FormLabel>
                                  <FormControl>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className='h-10 w-fit border-none p-0 px-2 text-base'>
                                          <div className='flex h-full items-center justify-center gap-4'>
                                            <SelectValue />
                                            <ChevronsUpDown className='w-4' />
                                          </div>
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className='shadow-default max-h-60 w-fit min-w-fit'>
                                        {HOURS.map((hour, index) => (
                                          <SelectItem
                                            key={index}
                                            value={hour.toString()}
                                            className='text-gray-secondary focus:bg-blue-primary text-base focus:text-white'
                                          >
                                            {hour.toString()}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name='eventStartMinute'
                              render={({ field }) => (
                                <FormItem className='w-full space-y-0'>
                                  <FormLabel className='text-gray-secondary sr-only'>
                                    Menit Mulai Event
                                  </FormLabel>
                                  <FormControl>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value?.toString()}
                                    >
                                      <FormControl>
                                        <SelectTrigger className='h-10 w-fit border-none p-0 px-2 text-base'>
                                          <div className='flex h-full items-center justify-center gap-4'>
                                            <SelectValue />
                                            <ChevronsUpDown className='w-4' />
                                          </div>
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className='shadow-default max-h-60 w-fit min-w-fit'>
                                        {MINUTES.map((minute, index) => (
                                          <SelectItem
                                            key={index}
                                            value={minute.toString()}
                                            className='text-gray-secondary focus:bg-blue-primary text-base focus:text-white'
                                          >
                                            {minute.toString()}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className='flex w-full flex-col gap-2'>
                        <span className='text-sm'>Sampai</span>
                        <div className='flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 p-4'>
                          <Icon
                            icon={faClock}
                            className='text-gray-secondary w-4'
                          />
                          <div className='flex w-full items-center justify-between'>
                            <FormField
                              control={form.control}
                              name='eventEndHour'
                              render={({ field }) => (
                                <FormItem className='space-y-0'>
                                  <FormLabel className='text-gray-secondary sr-only'>
                                    Jam Mulai Event
                                  </FormLabel>
                                  <FormControl>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value?.toString()}
                                    >
                                      <FormControl>
                                        <SelectTrigger className='h-10 w-fit border-none p-0 px-2 text-base'>
                                          <div className='flex h-full items-center justify-center gap-4'>
                                            <SelectValue />
                                            <ChevronsUpDown className='w-4' />
                                          </div>
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className='shadow-default max-h-60 w-fit min-w-fit'>
                                        {HOURS.map((hour, index) => (
                                          <SelectItem
                                            key={index}
                                            value={hour.toString()}
                                            className='text-gray-secondary focus:bg-blue-primary text-base focus:text-white'
                                          >
                                            {hour.toString()}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name='eventEndMinute'
                              render={({ field }) => (
                                <FormItem className='w-full space-y-0'>
                                  <FormLabel className='text-gray-secondary sr-only'>
                                    Menit Mulai Event
                                  </FormLabel>
                                  <FormControl>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value?.toString()}
                                    >
                                      <FormControl>
                                        <SelectTrigger className='h-10 w-fit border-none p-0 px-2 text-base'>
                                          <div className='flex h-full items-center justify-center gap-4'>
                                            <SelectValue />
                                            <ChevronsUpDown className='w-4' />
                                          </div>
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className='shadow-default max-h-60 w-fit min-w-fit'>
                                        {MINUTES.map((minute, index) => (
                                          <SelectItem
                                            key={index}
                                            value={minute.toString()}
                                            className='text-gray-secondary focus:bg-blue-primary text-base focus:text-white'
                                          >
                                            {minute.toString()}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </EventTimeTab>
                </EventDateModal>
              </EventDateProvider>

              <LocationProvider>
                <LocationTrigger
                  location={`${form.watch('streetAddress')}, ${provinces.find((province) => Number(form.watch('provinceId')) === province.id)?.name}`}
                />
                <LocationModal>
                  <FormField
                    control={form.control}
                    name='provinceId'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel className='text-gray-secondary'>
                          Provinsi
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className='h-10 border-none p-0 text-base'>
                                <div className='text-gray-secondary flex h-full w-full items-start border-b border-gray-300 py-1'>
                                  <SelectValue />
                                </div>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className='shadow-default'>
                              {provinces.length > 0 &&
                                provinces.map((province, index) => (
                                  <SelectItem
                                    key={index}
                                    value={province.id.toString()}
                                    className='text-gray-secondary focus:bg-blue-primary text-base focus:text-white'
                                  >
                                    {province.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='city'
                    render={({ field }) => (
                      <FormItem className='w-full border-b border-gray-300'>
                        <FormLabel className='text-gray-secondary'>
                          Kota
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='text'
                            {...field}
                            className='text-dark-primary h-10 w-full border-none px-0 py-0 text-base outline-none focus:border-none focus:bg-transparent'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='streetAddress'
                    render={({ field }) => (
                      <FormItem className='w-full border-b border-gray-300'>
                        <FormLabel className='text-gray-secondary'>
                          Alamat
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='text'
                            {...field}
                            className='text-dark-primary h-10 w-full border-none px-0 py-0 text-base outline-none focus:border-none focus:bg-transparent'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </LocationModal>
              </LocationProvider>
            </div>
          </div>
        </div>

        <EventDetailsProvider activeTicketType={event.ticketType}>
          <TicketCategoryTab>
            <div className='grid gap-4 py-7 sm:grid-cols-2 lg:grid-cols-3'>
              <TicketCategoryButton
                label='Berbayar'
                isActive={form.watch('ticketType') === 'PAID'}
                form={form}
                name='ticketType'
                ticketType='PAID'
              />

              <TicketCategoryButton
                label='Gratis'
                isActive={form.watch('ticketType') === 'FREE'}
                form={form}
                name='ticketType'
                ticketType='FREE'
              />
            </div>
            <PaidTicketForm>
              <div className='grid gap-8 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='availableSeats'
                  render={({ field }) => (
                    <FormItem className='w-full border-b border-gray-300'>
                      <FormLabel className='text-gray-secondary'>
                        Jumlah Tiket
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          className='text-dark-primary h-10 w-full border-none px-0 py-0 text-base outline-none focus:border-none focus:bg-transparent'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='price'
                  render={({ field }) => (
                    <FormItem className='w-full border-b border-gray-300'>
                      <FormLabel className='text-gray-secondary'>
                        Harga Tiket
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          value={
                            field.value
                              ? `Rp ${formatNumber(field.value)}`
                              : 'Rp 0'
                          }
                          onChange={(e) => {
                            field.onChange(
                              Number(e.target.value.replace(/\D/g, ''))
                            )
                          }}
                          className='text-dark-primary h-10 w-full border-none px-0 py-0 text-base outline-none focus:border-none focus:bg-transparent'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </PaidTicketForm>
            <FreeTicketForm>
              <div className='grid grid-cols-2 gap-8'>
                <FormField
                  control={form.control}
                  name='availableSeats'
                  render={({ field }) => (
                    <FormItem className='w-full border-b border-gray-300'>
                      <FormLabel className='text-gray-secondary'>
                        Jumlah Tiket
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          className='text-dark-primary h-10 w-full border-none px-0 py-0 text-base outline-none focus:border-none focus:bg-transparent'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </FreeTicketForm>
          </TicketCategoryTab>

          <EventDescriptionTab>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='w-full border-b border-gray-300'>
                  <FormLabel className='text-gray-secondary sr-only'>
                    Deskripsi Event
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={10}
                      className='border-gray-primary focus:border-gray-primary rounded-sm border'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </EventDescriptionTab>
        </EventDetailsProvider>

        <div className='w-full px-4 lg:px-0'>
          <Button
            type='submit'
            disabled={form.formState.isSubmitting}
            className='w-full'
          >
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Form>
  )
}
