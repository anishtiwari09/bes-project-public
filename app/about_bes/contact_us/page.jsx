import db from "./db.json";
import styles from "../../registrationform/Form/form.module.css";
import { Box } from "@mui/material";
import FormWithAction from "@/app/registrationform/Form/FormWithAction";
import { contactUsAction } from "@/app/backend/action/action";

export default function page() {
  return (
    <div className="flex flex-col p-4 w-full">
      <div className={styles.container2} style={{ padding: 0 }}>
        <h3 className="text-[22px] font-bold">Contact Us</h3>
        <p className="my-2 text-[16px">
          <strong className="text-[20px]">Registered Office:</strong> <br />
          <strong>Broadcast Engineering Society (India)</strong> <br />
          <span className="pl-0 block">
            912 Surya Kiran Building, 19 Kasturba Gandhi Marg, <br />
            New Delhi-110001 Tel: +91 11 23316709
          </span>
          <span className="pl-0 block">
           Email: &nbsp;<a href='mailto:bes@besindia.com'>bes@besindia.com</a>
          </span>
        </p>
      </div>
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
            <h2 className="text-center font-bold text-[20px] text-[#75c24c]">
              Enquiry Form
            </h2>
          </div>
          <FormWithAction db={db} formActionHandler={contactUsAction} />
        </Box>
      </div>
    </div>
  );
}
