'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowPagination,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import { useState } from 'react'
import { Eye } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/shadcn-ui/table'
import { Button } from '../shadcn-ui/button'
import { Input } from '../shadcn-ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../shadcn-ui/dropdown-menu'
import { DataTablePagination } from './data-table-pagination'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../shadcn-ui/select'

type SearchColumn = {
  id: string
  label: string
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchableColumns: SearchColumn[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchableColumns
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [searchColumn, setSearchColumn] = useState<SearchColumn>({
    id: searchableColumns[0]?.id || '',
    label: searchableColumns[0]?.label || ''
  })

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 8
      }
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  return (
    <div>
      <div className='mb-4 flex items-end'>
        <div className='flex flex-col gap-2 lg:flex-row'>
          <Input
            placeholder='Search....'
            value={
              (table.getColumn(searchColumn.id)?.getFilterValue() as string) ??
              ''
            }
            onChange={(event) =>
              table
                .getColumn(searchColumn.id)
                ?.setFilterValue(event.target.value)
            }
            className='order-2 h-9 w-[140px] text-sm sm:w-[200px] lg:order-1'
          />
          <Select
            onValueChange={(value) => {
              setSearchColumn((prevState) => ({ ...prevState, id: value }))
            }}
          >
            <SelectTrigger className='order-1 w-[140px] sm:w-[200px] lg:order-2'>
              <SelectValue placeholder={searchColumn.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Columns</SelectLabel>
                {searchableColumns.map((column, index) => (
                  <SelectItem key={index} value={column.id}>
                    {column.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              <Eye />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='min-h-[440px] w-full overflow-x-auto rounded-md md:min-w-[768px]'>
        <Table
        // add style below to apply custom column sizing
        // style={{ width: table.getCenterTotalSize() }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      // add style below to apply custom column sizing
                      // style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
