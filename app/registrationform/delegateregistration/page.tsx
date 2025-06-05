import visitorDb from "./Utility/db.json";
import Form from "../Form/Form";
import styles from "../Form/form.module.css";
import { Box } from "@mui/material";
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
          <div>
            <h2 className="text-center font-bold text-[30px] text-[#75c24c]">
              Register as Delegate
            </h2>
            <h3 className="text-center  text-[24px] text-[#d8c55b]">
              Online Request Form for Conference
            </h3>
          </div>
          <Form
            db={visitorDb}
            apiLink={"/backend/api/registration/delegate_registration"}
            request={"POST"}
          />
        </Box>
      </div>
    </div>
  );
}
