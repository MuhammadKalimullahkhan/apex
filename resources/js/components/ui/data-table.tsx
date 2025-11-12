import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Link } from "@inertiajs/react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  pagination?: {
    currentPage: number
    lastPage: number
    links: { url: string | null; label: string; active: boolean }[]
  }
  meta?: Record<string, any>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  pagination,
  meta
}: DataTableProps<TData, TValue>) {
  const [filter, setFilter] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {/* 🔍 Search */}
        {searchKey && (
          <Input
            placeholder={`Search ${searchKey}...`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
        )}
      </div>

      {/* 📋 Table */}
      <div className="rounded-md border">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 text-left">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-muted/20">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📌 Pagination (Laravel links) */}
      {pagination && (
        <div className="flex gap-2 flex-wrap">
          {pagination.links.map((link, i) => (
            <Link
              key={i}
              href={link.url || "#"}
              className={`px-3 py-1 rounded-md border ${link.active
                  ? "bg-primary text-white dark:text-black"
                  : "hover:bg-muted text-foreground"
                }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
