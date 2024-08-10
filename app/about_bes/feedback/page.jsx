import React from "react";
import db from "./db.json";
import Form from "../../registrationform/Form/Form";
import styles from "../../registrationform/Form/form.module.css";
import { Box } from "@mui/material";
export default function page() {
  return (
    <div className="flex flex-col p-4 w-full">
      <div className={styles.container}>
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            flexDirection: "column",

            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div>
            <h2 className="text-center font-bold text-[30px] text-[#75c24c]">
              Feedback
            </h2>
          </div>
          <Form db={db} isBypassEmailValidation={true} />
        </Box>
      </div>
    </div>
  );
}
