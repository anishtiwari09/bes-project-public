"use client";
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { Download } from "@mui/icons-material";

interface Delegate {
  _id: string;
  name: string;
  organisation: string;
  email: string;
  mobile: string;
  department: string;
  session_type: string;
  payment_type: string;
  transaction_no: string;
  amount: number;
  postal_address: string;
  other_details: string;
  createdAt: string;
  tracking_id: string;
}

interface AllRegistrationsProps {
  db: Delegate[];
}

export default function AllRegistrations({ db }: AllRegistrationsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const formatDateIST = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredDelegates = useMemo(() => {
    if (!searchTerm) return db;
    return db.filter(
      (delegate) =>
        delegate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delegate.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [db, searchTerm]);

  const downloadCSV = () => {
    const headers = [
      "Name",
      "Organisation",
      "Email",
      "Mobile",
      "Department",
      "Session Type",
      "Payment Type",
      "Transaction No.",
      "Amount",
      "Registration Date",
    ];

    const csvData = db.map((delegate) => [
      delegate.name,
      delegate.organisation,
      delegate.email,
      delegate.mobile,
      delegate.department,
      delegate.session_type,
      delegate.payment_type,
      delegate.transaction_no,
      delegate.amount,
      formatDateIST(delegate.createdAt),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `delegates_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">
          All Delegates ({filteredDelegates.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={downloadCSV}
          disabled={db.length === 0}
        >
          Download CSV
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Organisation</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Mobile</strong>
              </TableCell>
              <TableCell>
                <strong>Department</strong>
              </TableCell>
              <TableCell>
                <strong>Session Type</strong>
              </TableCell>
              <TableCell>
                <strong>Payment Type</strong>
              </TableCell>
              <TableCell>
                <strong>Transaction No.</strong>
              </TableCell>
              <TableCell>
                <strong>Amount</strong>
              </TableCell>
              <TableCell>
                <strong>Registration Date</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDelegates.map((delegate) => (
              <TableRow key={delegate.tracking_id} hover>
                <TableCell>{delegate.name}</TableCell>
                <TableCell>{delegate.organisation}</TableCell>
                <TableCell>{delegate.email}</TableCell>
                <TableCell>{delegate.mobile}</TableCell>
                <TableCell>{delegate.department}</TableCell>
                <TableCell>{delegate.session_type}</TableCell>
                <TableCell>{delegate.payment_type}</TableCell>
                <TableCell>{delegate.transaction_no}</TableCell>
                <TableCell>₹{delegate.amount}</TableCell>
                <TableCell>{formatDateIST(delegate.createdAt)}</TableCell>
              </TableRow>
            ))}
            {filteredDelegates.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No delegates found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
