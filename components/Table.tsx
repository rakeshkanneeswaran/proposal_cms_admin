"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  status: boolean;
};

const styles = StyleSheet.create({
  page: { padding: 20 },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: { width: 50, height: 50, marginRight: 10 },
  title: { flex: 1, fontSize: 18, fontWeight: "bold", textAlign: "center" ,marginRight: '4px'},
  memoRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  sectionTitle: { fontSize: 14, marginVertical: 6, fontWeight: "bold" },
  sectionContent: { marginBottom: 6, fontSize: 12, textAlign: "justify" },
  footer: { position: "absolute", bottom: 20, left: 20, right: 20 },
  signature: { fontSize: 12, marginTop: 20 },
});

const Report = ({ event }: { event: Event }) => (
  <Document>
    <Page style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          src="https://upload.wikimedia.org/wikipedia/en/f/fe/Srmseal.png"
          style={styles.logo}
        />
        <Text style={styles.title}>Event Report</Text>
      </View>

      <View style={styles.memoRow}>
        <Text>To: Head of Department</Text>
        <Text>Date: {new Date().toLocaleDateString()}</Text>
      </View>
      <View style={styles.memoRow}>
        <Text>From: {event.convenorName}</Text>
        <Text>Subject: {event.eventTitle}</Text>
      </View>

      {/* Introduction Section */}
      <Text style={styles.sectionTitle}>Introduction</Text>
      <Text style={styles.sectionContent}>
        This report provides an overview of the event titled &quot;{event.eventTitle}&quot;.
        The event was organized by {event.convenorName} and involved various participants.
        This report aims to summarize the key activities and outcomes of the event.
      </Text>

      {/* Discussion Section */}
      <Text style={styles.sectionTitle}>Discussion</Text>
      <Text style={styles.sectionContent}>
        The event was designed to achieve the following goals:
      </Text>
      <Text style={styles.sectionContent}>1. Engage with attendees to share insights.</Text>
      <Text style={styles.sectionContent}>
        2. Facilitate networking among participants.
      </Text>
      <Text style={styles.sectionContent}>
        3. Showcase the latest advancements and developments.
      </Text>

      <Text style={styles.sectionContent}>
        The participation level was {event.status ? "successful and completed" : "still in progress"}. The event attracted several participants and enabled collaborative discussions.
      </Text>

      {/* Conclusion Section */}
      <Text style={styles.sectionTitle}>Conclusion</Text>
      <Text style={styles.sectionContent}>
        In summary, the event &quot;{event.eventTitle}&quot; was a significant opportunity for
        knowledge sharing and networking. We hope this event will foster future
        collaborations among the participants.
      </Text>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.signature}>Convenor&apos;s Signature: ____________________</Text>
        <Text style={styles.signature}>
          Head of Department&apos;s Signature: ____________________
        </Text>
      </View>
    </Page>
  </Document>
);

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
        <PDFDownloadLink
          document={<Report event={selectedEvent} />}
          fileName={`${selectedEvent.eventTitle}_Report.pdf`}
        >
          <Button variant="outline">Download Report</Button>
        </PDFDownloadLink>
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
