import { faArrowDown, faArrowsUpDown, faArrowUp } from "@awesome.me/kit-25b3efc452/icons/classic/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@owl/lib/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@owl/lib/components/table";
import {
      type ColumnDef,
      flexRender,
      getCoreRowModel,
      // getPaginationRowModel,
      getSortedRowModel,
      type SortDirection,
      type SortingState,
      useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
      columns: ColumnDef<TData, TValue>[];
      data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
      const [sorting, setSorting] = useState<SortingState>([]);
      const table = useReactTable({
            data,
            columns,
            getCoreRowModel: getCoreRowModel(),
            // getPaginationRowModel: getPaginationRowModel(),
            initialState: {
                  pagination: {
                        pageSize: data.length,
                  },
            },
            onSortingChange: setSorting,
            getSortedRowModel: getSortedRowModel(),
            state: { sorting },
      });

      return (
            <div>
                  <div className="overflow-hidden rounded-md border">
                        <Table>
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
                                                                                header.getContext(),
                                                                          )}
                                                            </TableHead>
                                                      );
                                                })}
                                          </TableRow>
                                    ))}
                              </TableHeader>
                              <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                          table.getRowModel().rows.map((row) => (
                                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                                      {row.getVisibleCells().map((cell) => (
                                                            <TableCell key={cell.id}>
                                                                  {flexRender(
                                                                        cell.column.columnDef.cell,
                                                                        cell.getContext(),
                                                                  )}
                                                            </TableCell>
                                                      ))}
                                                </TableRow>
                                          ))
                                    ) : (
                                          <TableRow>
                                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                                      No results.
                                                </TableCell>
                                          </TableRow>
                                    )}
                              </TableBody>
                        </Table>
                  </div>
                  {/* <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                              variant="outline"
                              size="sm"
                              onClick={() => table.previousPage()}
                              disabled={!table.getCanPreviousPage()}
                        >
                              Previous
                        </Button>
                        <Button
                              variant="outline"
                              size="sm"
                              onClick={() => table.nextPage()}
                              disabled={!table.getCanNextPage()}
                        >
                              Next
                        </Button>
                  </div> */}
            </div>
      );
}

export function SortableHeader(props: { desc: false | SortDirection; title: string; onClick: () => void }) {
      return (
            <Button variant="ghost" onClick={() => props.onClick()}>
                  {props.title}{" "}
                  <FontAwesomeIcon
                        icon={!props.desc ? faArrowsUpDown : props.desc === "asc" ? faArrowDown : faArrowUp}
                  />{" "}
            </Button>
      );
}
