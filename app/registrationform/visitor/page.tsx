import React from "react";
import visitorDb from "./Utility/db.json";
import Form from "../Form/Form";
import styles from "../Form/form.module.css";
import { Box, Button } from "@mui/material";
import { REGISTRATION_PATH } from "@/app/Utility/_shared/Constant";
import AllRegistrationTypeServices from "@/app/backend/lib/services/all-registration-type-service";

import UnavailableServiceMessage from "@/app/UIComponent/common-ui/unavailable-service/unavailable-service-msg";
import { RegistrationServiceType } from "@/app/backend/lib/db/models/all_registration_services.model";
export const revalidate = 3600; // cached for one hour
export default async function page() {
  const allServices = new AllRegistrationTypeServices();
  const isActive = await allServices.checkIsServiceActiveByName(
    RegistrationServiceType.VISITOR_REGISTRATIONS
  );
  if (!isActive) return <UnavailableServiceMessage />;
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
          {/* <Button
            component="a"
            href="/registrationform/e-badges/download-badge "
            sx={{ marginLeft: "auto" }}
          >
            Get your Badge
          </Button> */}
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
