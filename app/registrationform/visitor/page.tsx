import React from "react";
import visitorDb from "./Utility/db.json";
import Form from "../Form/Form";
import styles from "../Form/form.module.css";
import { Box } from "@mui/material";
import { REGISTRATION_PATH } from "@/app/Utility/_shared/Constant";
export default function page() {
  return (
    <div className="w-full bg-[#f2f2f2] p-4">
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
          <h2 className="text-center font-bold text-[30px] text-[#75c24c]">
            Visitor Registration
          </h2>

          <Form
            db={visitorDb}
            apiLink={"/backend/api/registration/visitor_registration"}
            request={"POST"}
            currentPath={REGISTRATION_PATH.visitor}
          />
        </Box>
      </div>
    </div>
  );
}
