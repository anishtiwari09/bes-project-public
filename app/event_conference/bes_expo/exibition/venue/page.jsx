"use client";
import React from "react";
import styles from "@/app/about_bes/content.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
export default function page() {
  return null;
  // return (
  //   // <div
  //   //   className={"flex flex-col max-w-[800px] p-4 " + styles.content_container}
  //   // >
  //   //   <h2 className="text-[26px] font-bold">Date & Venue</h2>

  //   //   <div>
  //   //     {/* <p>
  //   //       <strong>This year WAVES & BES EXPO 2025</strong> is being organized in
  //   //       Bharat Mandapam, Pragati Maidan, New Delhi from 05-09 February 2025 at
  //   //       Pragati Madan, New Delhi. Pragati Maidan is the biggest exhibition
  //   //       venue in India. Centrally located, it is only 10 minutes away from
  //   //       Connaught Place, heart of Delhi. The Inaugural and Valedictory
  //   //       function including plenary session for WAVES 2025 will be held at
  //   //       Bharat Mandapam, Pragati Maidan, Delhi & Conferences/Seminars will be
  //   //       held at WAVES-25 venue viz Bharat Mandapam, Pragati Maidan, Delhi. The
  //   //       timings of the exhibition will be as follows:-
  //   //     </p> */}
  //   //   </div>
  //   //   {/* <div px={4}>
  //   //     <Table border="1">
  //   //       <TableHead>
  //   //         <TableRow className="border-black">
  //   //           <StyledTableCell>(a)</StyledTableCell>
  //   //           <StyledTableCell className="font-bold ">
  //   //             Inauguration (by Invite)
  //   //           </StyledTableCell>
  //   //           <StyledTableCell>5th February 2025</StyledTableCell>
  //   //         </TableRow>
  //   //       </TableHead>
  //   //       <TableBody>
  //   //         <TableRow>
  //   //           <StyledTableCell>(b)</StyledTableCell>
  //   //           <StyledTableCell className="font-bold">
  //   //             Business Days
  //   //           </StyledTableCell>
  //   //           <StyledTableCell>
  //   //             5th to 7th February 2025 (10:00 - 17:30 hrs)
  //   //           </StyledTableCell>
  //   //         </TableRow>
  //   //         <TableRow>
  //   //           <StyledTableCell>(c)</StyledTableCell>
  //   //           <StyledTableCell className="font-bold">
  //   //             Public Days
  //   //           </StyledTableCell>
  //   //           <StyledTableCell>
  //   //             8th & 9th February 2025 (10:00 - 17:30 hrs)
  //   //           </StyledTableCell>
  //   //         </TableRow>
  //   //       </TableBody>
  //   //     </Table>
  //   //   </div> */}
  //   //   {/* <p>
  //   //     A company/organization/association booking the space for participation
  //   //     will be termed as an Exhibitor.
  //   //   </p> */}
  //   // </div>
  // );
}

const StyledTableCell = styled(TableCell)(({ theme }) => {
  return {
    [`&.${tableCellClasses.head}`]: {
      textAlign: "center",
      border: "2px solid black",
    },
    [`&.${tableCellClasses.body}`]: {
      textAlign: "center",
      border: "2px solid black",
    },
  };
});
