'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Event,
  UpdateEventFormSchemaType
} from '@/lib/interfaces/event.interface'
import {
  BannerSchema,
  UpdateEventFormSchema
} from '@/lib/validations/event.validation'
import { Category } from '@/lib/interfaces/category.interface'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/shadcn-ui/form'
import Button from '@/components/button'
import BannerInput from './banner-input'
import { Input } from '@/components/shadcn-ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/shadcn-ui/select'
import DateInputForm from './date-input-form'
import {
  EventDateModal,
  EventDateProvider,
  EventDateTab,
  EventDateTrigger,
  EventTimeTab
} from './event-date'
import { ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn, formatEventDate, formatNumber } from '@/lib/utils'
import { HOURS, MINUTES } from '@/lib/constants'
import Icon from '@/components/icon'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { LocationModal, LocationProvider, LocationTrigger } from './location'
import { Province } from '@/lib/interfaces/location.interface'
import { faPencil, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import {
  EventDescriptionTab,
  EventDetailsProvider,
  FreeTicketForm,
  PaidTicketForm,
  TicketCategoryTab
} from './event-details'
import { Textarea } from '@/components/shadcn-ui/textarea'

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
      eventStartHour: '13',
      eventStartMinute: '00',
      price: event.price,
      availableSeats: event.availableSeats,
      locationId: event.location.id,
      provinceId: event.location.province.id,
      city: event.location.city,
      streetAddress: event.location.address,
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
      console.log(values)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (event.bannerUrl) {
      setBannerPreview(event.bannerUrl)
    }
  }, [form, event])

  useEffect(() => {
    console.log(form.formState.errors)
  }, [form.formState.errors])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex max-w-[900px] flex-col gap-10 py-4 lg:px-10 lg:py-10'
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
                              name='eventStartHour'
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
            <PaidTicketForm>
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
          <Button type='submit' className='w-full'>
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Form>
  )
}
