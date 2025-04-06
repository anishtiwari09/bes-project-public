"use client";
import React from "react";
import styles from "../../content.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import Link from "next/link";
export default function Content({
  db,
  council_data
}: any) {
  return (
    <div
      className={
        "flex flex-col max-w-[800px] m-auto p-4 " + styles.content_container
      }
    >
      <h2 className="text-[26px] font-bold">Executive Council</h2>
      <p className="text-[#003366] font-bold">
        BES Executive Council {council_data}
      </p>
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Designation</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Photos</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {db.map((item: any, key: any) => {
              return (
                <StyledTableRow key={item.id}>
                  <StyledTableCell>{key + 1}</StyledTableCell>
                  <StyledTableCell>{item.name}</StyledTableCell>
                  <StyledTableCell>{item.design}</StyledTableCell>
                  <StyledTableCell>
                    <Link href={"mailto:" + item.emal}>{item.email}</Link>
                  </StyledTableCell>
                  <StyledTableCell>
                    {item?.img ? (
                      <img
                        src={
                          `/Images/previous_council/${council_data}/` + item.img
                        }
                        alt={item.name}
                        style={{ maxWidth: 90 }}
                      />
                    ) : (
                      ""
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => {
  return {
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "orange",
      color: theme.palette.common.white,
      textAlign: "center",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      textAlign: "center",
    },
  };
});
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
