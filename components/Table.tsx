"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export type Event = {
  id: string;
  eventTitle: string;
  mailId: string;
  convenorName: string;
  status: boolean;
};

export default function EventTable() {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [proposals, setProposals] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    toast.info("Fetching the data, please wait...");
    axios
      .get("/api/proposal")
      .then((response) => {
        setProposals(response.data.proposal);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const handleDelete = async (event: Event) => {
    try {
      const result = await axios.delete(`/api/proposal?id=${event.id}`);
      if (result.status === 200) {
        toast.success("Event deleted successfully");
        setProposals((prev) => prev.filter((p) => p.id !== event.id));
      } else {
        toast.error("Failed to delete event");
      }
    } catch (error) {
      console.error(`Error deleting event with ID ${event.id}:`, error);
    }
  };

  const handleUpdate = (event: Event) => {
    router.push(`/dashboard/${event.id}`);
  };

  const handleMarkComplete = async (event: Event) => {
    try {
      const result = await axios.put(`/api/status?id=${event.id}`, { status: true });
      if (result.status === 200) {
        toast.success("Event marked as complete");
        setProposals((prev) =>
          prev.map((p) => (p.id === event.id ? { ...p, status: true } : p))
        );
      } else {
        toast.error("Failed to mark event as complete");
      }
    } catch (error) {
      console.error(`Error marking event as complete:`, error);
    }
  };

  const handleMarkIncomplete = async (event: Event) => {
    try {
      const result = await axios.put(`/api/status?id=${event.id}`, { status: false });
      if (result.status === 200) {
        toast.success("Event marked as incomplete");
        setProposals((prev) =>
          prev.map((p) => (p.id === event.id ? { ...p, status: false } : p))
        );
      } else {
        toast.error("Failed to mark event as incomplete");
      }
    } catch (error) {
      console.error(`Error marking event as incomplete:`, error);
    }
  };

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
        const status = row.getValue("status") ? "Completed" : "In Progress";
        const statusColor = row.getValue("status")
          ? "text-green-500"
          : "text-red-500 animate-blink";
        return <div className={`text-right ${statusColor}`}>{status}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const event = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDelete(event)}>
                Delete Event
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleUpdate(event)}>
                Update Event
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleMarkComplete(event)}>
                Mark as Complete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleMarkIncomplete(event)}>
                Mark as Incomplete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSelectedEvent(event)}>
                Generate Report
              </DropdownMenuItem>
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting },
  });

  return (
    <div className="w-full bg-white rounded-md shadow-lg p-3 border-4 border-black">
      {selectedEvent && (
        <Button variant="outline" onClick={() => console.log("Generate report for", selectedEvent)}>
          Download Report (Placeholder)
        </Button>
      )}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
