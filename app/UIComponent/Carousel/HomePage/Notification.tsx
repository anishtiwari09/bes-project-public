import { Button } from "@mui/material";
import React from "react";
import { HOMEPAGE } from "../../../Utility/Constant";
import Countdown from "./Countdown";
import Link from "next/link";
import { IRegistrationServiceType } from "@/app/_shared/types";

export default function Notification({
  currentRegistrationServiceStatus,
}: {
  currentRegistrationServiceStatus: Record<IRegistrationServiceType, number>;
}) {
  const delagateOrVisitorStatus =
    !!currentRegistrationServiceStatus.delegate_registration ||
    !!currentRegistrationServiceStatus.visitor_registration;
  return (
    <div className="flex gap-4 items-center flex-col w-full">
      <React.Fragment>
        <h4 className="font-bold text-4 text-white text-center ubuntu_font .conference_text conference_text emoisis_text text-8">
          BES EXPO-2027: {HOMEPAGE.eventCount} International Conference &
          Exhibition on Broadcast & Media Technology
        </h4>
        <h3 className="font-bold text-2xl text-[#faac1d] text-center conference_text conference_text2 text-shadow">
          {HOMEPAGE.expoStartDate.date}
          {HOMEPAGE.expoStartDate.postFix} {HOMEPAGE.expoStartDate.displayMonth}{" "}
          to {HOMEPAGE.expoEndDate.date}
          {HOMEPAGE.expoEndDate.postFix} {HOMEPAGE.expoEndDate.displayMonth}{" "}
          {HOMEPAGE.expoEndDate.year}
        </h3>
      </React.Fragment>

      {/* <h3 className="font-bold text-md text-white bg-[#ff008499] w-fit p-3 text-center conference_text">
        Hall No. 12A Pragati Maidan, New Delhi
      </h3> */}
      {/* <div className="text-xl text-[#222fda] font-bold w-fit m-auto text-center  mt-4">
        Theme: Broadcast Intelligence Innovation: Make in India for the World
      </div> */}

      {!!currentRegistrationServiceStatus?.my_space && (
        <a
          className="flex"
          href="/event_conference/bes_expo/exibition/participation_fee"
        >
          <Button
            variant="contained"
            className="flex w-fit m-auto mt-4 bg-[#222fda] text-[16px] font-[500] hover:bg-[#ffffff] hover:text-[#000]"
          >
            Book Your Space
          </Button>
        </a>
      )}
    {/* <div className="flex gap-2 justify-center">
        <a
          className="flex"
          href="https://www.besindia.com/pdf/bes_election/NOTICE%20For%20AGM%202026.pdf"
          target="_blank"
        >
          <Button
            variant="contained"
            className="flex w-fit m-auto mt-4 bg-[#222fda] text-[16px] font-[500] hover:bg-[#ffffff] hover:text-[#000]"
          >
            Notice for AGM-2026
          </Button>
        </a>
        <a
          className="flex"
          href="/document/besexpo/brochure2026.pdf"
          target="_blank"
        >
          <Button
            variant="contained"
            className="flex w-fit m-auto mt-4 bg-[#222fda] text-[16px] font-[500] hover:bg-[#ffffff] hover:text-[#000]"
          >
            Brochure
          </Button>
        </a> 
      </div> */}

      {delagateOrVisitorStatus && (
        <div className="flex gap-2 justify-center mt-4 registration_btn_container">
          {!!currentRegistrationServiceStatus.visitor_registration && (
            <Link href={"/registrationform/visitor"} target="_self">
              <Button
                className="bg-orange-400 registration_btn"
                variant="contained"
                sx={{
                  "&:hover": { background: "orange" },
                }}
              >
                Visitor Registration
              </Button>
            </Link>
          )}

          {!!currentRegistrationServiceStatus.delegate_registration && (
            <Link
              href={"/registrationform/delegateregistration"}
              target="_self"
            >
              <Button
                variant="contained"
                className="bg-orange-400 registration_btn"
                sx={{
                  "&:hover": { background: "orange" },
                }}
              >
                Delegate Registration
              </Button>
            </Link>
          )}
        </div>
      )}

      <Countdown
        from={
          HOMEPAGE.expoStartDate.month +
          " " +
          HOMEPAGE.expoStartDate.date +
          " , " +
          HOMEPAGE.expoStartDate.year +
          " 10:00:00 GMT+0530"
        }
      />
    </div>
    

    
  );

}
<div className="flex gap-2 justify-center">
        <a
          className="flex"
          href="pdf/bes_election/NOTICE For AGM 2026.pdf"
          target="_blank"
        >
          <Button
            variant="contained"
            className="flex w-fit m-auto mt-4 bg-[#222fda] text-[16px] font-[500] hover:bg-[#ffffff] hover:text-[#000]"
          >
            Notice for AGM-2026
          </Button>
        </a>
        {/*<a
          className="flex"
          href="/document/besexpo/brochure2026.pdf"
          target="_blank"
        >
          <Button
            variant="contained"
            className="flex w-fit m-auto mt-4 bg-[#222fda] text-[16px] font-[500] hover:bg-[#ffffff] hover:text-[#000]"
          >
            Brochure
          </Button>
        </a>*/} 
      </div>
