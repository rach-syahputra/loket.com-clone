'use client'

import { useEffect, useState } from 'react'
import { faX } from '@fortawesome/free-solid-svg-icons'

import { fetchGetEventAttendees } from '@/lib/apis/organizer.api'
import { DataTable } from '@/components/table/data-table'
import Icon from '@/components/icon'
import ModalContainer from '@/components/modal-container'
import Pagination from '@/components/pagination'
import { AttendeeTable, columns } from './table/column'

type AttendeeListModalProps = {
  eventTitle: string
  eventSlug: string
  attendees: AttendeeTable[]
  openModal: boolean
  handleClose: () => void
  className?: string
}

export default function AttendeeListModal({
  eventTitle,
  eventSlug,
  openModal,
  className,
  handleClose
}: AttendeeListModalProps) {
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [attendees, setAttendees] = useState<AttendeeTable[]>([])

  const getEventAttendees = async () => {
    try {
      const response = await fetchGetEventAttendees(eventSlug, page)

      if (response.success) {
        setAttendees(
          response.data.attendees.map((attendee) => ({
            id: attendee.id,
            nama: attendee.name,
            jumlahTiket: attendee.ticketQuantity,
            totalHarga: attendee.totalPrice
          }))
        )
        setPage(response.data.pagination.currentPage)
        setTotalPages(response.data.pagination.totalPages)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getEventAttendees()
  }, [eventSlug, page])

  const searchableColumns = [
    {
      id: 'nama',
      label: 'Nama'
    }
  ]

  return (
    <ModalContainer isOpen={openModal} handleClose={handleClose}>
      <div className='shadow-default mx-auto flex max-w-[800px] flex-col gap-4 rounded-lg bg-white p-3 md:p-5'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-10'>
            <div className='flex items-center justify-center gap-2.5'>
              <span className='bg-orange-primary flex h-fit select-none items-center justify-center rounded-md px-4 py-2 text-[12px] text-white'>
                Daftar Peserta
              </span>
              <span className='text-blue-primary text-[12px]'>
                {eventTitle}
              </span>
            </div>
          </div>

          <button className='ml-4 flex h-4 w-4 items-center justify-center'>
            <Icon icon={faX} onClick={handleClose} className='w-2.5' />
          </button>
        </div>

        <DataTable
          columns={columns}
          data={attendees}
          searchableColumns={searchableColumns}
          pageSize={8}
        />

        <Pagination
          page={Number(page)}
          onPageChange={setPage}
          totalPages={totalPages}
          className='place-self-end'
        />
        <p></p>
      </div>
    </ModalContainer>
  )
}
