import visitorDb from "./Utility/db.json";
import Form from "../Form/Form";
import styles from "../Form/form.module.css";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import AllRegistrationTypeServices from "@/app/backend/lib/services/all-registration-type-service";
import UnavailableServiceMessage from "@/app/UIComponent/common-ui/unavailable-service/unavailable-service-msg";
import { RegistrationServiceType } from "@/app/backend/lib/db/models/all_registration_services.model";
import ProgramBrief from "./program-brief";
export const revalidate = 14400; // cached for four hour
export default async function page() {
  const allServices = new AllRegistrationTypeServices();
  const isActive = await allServices.checkIsServiceActiveByName(
    RegistrationServiceType.VISITOR_REGISTRATIONS,
  );
  if (!isActive) return <UnavailableServiceMessage />;
  return (
    <div className="w-full bg-[#f2f2f2] p-4">
      <div className="flex flex-col sm:flex-row m-auto gap-4">
        <div className={`${styles.container} flex-1`}>
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
              db={visitorDb.filter((item) => !item.inactive)}
              apiLink={"/backend/api/registration/delegate_registration"}
              request={"POST"}
            />
          </Box>
        </div>
        <div className="flex flex-col gap-5">
          <ProgramBrief />
          <Typography className="text-green-blue">
            You can Pay online as well
          </Typography>
          <div>
            <Image
              src={"/Images/common/payment-qr.jpg"}
              width={250}
              height={250}
              alt="qr-code"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
