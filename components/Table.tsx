"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Event = {
  id: string;
  eventTitle: string;
  mailId: string;
  convenorName: string;
  status: boolean; // Ensure status is a boolean
};

export default function EventTable() {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [proposals, setProposals] = useState<Event[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    // Fetch events data when component mounts
    toast.info("Fetching the data please wait...");
    axios
      .get("/api/proposal")
      .then((response) => {
        setProposals(response.data.proposal);
        console.log(response.data.proposal);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const eventColumns: ColumnDef<Event>[] = [
    
    {
      accessorKey: "eventTitle",
      header: "Event Title",
      cell: ({ row }) => <div className="capitalize">{row.getValue("eventTitle")}</div>,
    },
    {
      accessorKey: "convenorName",
      header: "Convenor Name",
      cell: ({ row }) => <div className="capitalize">{row.getValue("convenorName")}</div>,
    },
    {
      accessorKey: "mailId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mail ID
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("mailId")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") ? 'Completed' : 'In Progress';
        const statusColor = row.getValue("status") ? 'text-green-500' : 'text-red-500';
        return <div className={`text-right font-medium ${statusColor}`}>{status}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const event = row.original;

        const handleDelete = async () => {
          try {
            console.log(event.id);
            const result = await axios.delete(`/api/proposal?id=${event.id}`);
            if (result.status === 200) {
              toast.success("Event deleted successfully");
              setProposals((prev) => prev.filter((proposal) => proposal.id !== event.id));
            } else if (result.status === 500) {
              toast.error("Event failed to delete");
            }
          } catch (error) {
            console.error(`Error deleting event with ID ${event.id}:`, error);
          }
        };

        const handleUpdate = async () => {
          try {
            router.push(`/dashboard/${event.id}`);
          } catch (error) {
            console.error(`Error updating event with ID ${event.id}:`, error);
          }
        };

        const handleMarkComplete = async () => {
          try {
            const result = await axios.put(`/api/status?id=${event.id}`, { status: true });
            if (result.status === 200) {
              toast.success("Event marked as complete");
              setProposals((prev) =>
                prev.map((proposal) =>
                  proposal.id === event.id ? { ...proposal, status: true } : proposal
                )
              );
            } else {
              toast.error("Failed to mark event as complete");
            }
          } catch (error) {
            console.error(`Error marking event with ID ${event.id} as complete:`, error);
          }
        };

        const handleMarkIncomplete = async () => {
          try {
            const result = await axios.put(`/api/status?id=${event.id}`, { status: false });
            if (result.status === 200) {
              toast.success("Event marked as incomplete");
              setProposals((prev) =>
                prev.map((proposal) =>
                  proposal.id === event.id ? { ...proposal, status: false } : proposal
                )
              );
            } else {
              toast.error("Failed to mark event as incomplete");
            }
          } catch (error) {
            console.error(`Error marking event with ID ${event.id} as incomplete:`, error);
          }
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete}>Delete event</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleUpdate}>Update Event</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleMarkComplete}>Mark as Complete</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleMarkIncomplete}>Mark as Incomplete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: proposals,
    columns: eventColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full bg-white rounded-md shadow-lg p-3 border-4 border-black">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter mailIds..."
          value={(table.getColumn("mailId")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("mailId")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="Filter convenorName..."
          value={(table.getColumn("convenorName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("convenorName")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={eventColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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
        </div>
      </div>
    </div>
  );
}
