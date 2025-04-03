"use client";
import React from "react";
import OTP from "../../../Form/otpinput";
import { redirect } from "next/navigation";
import DownloadBadgePage from "./component/download-badge-page";

import { getVisitorDetails, sendMailToUser } from "@/app/backend/action/action";
import VisitorRegistration from "@/app/backend/models/visitor_registration.model";
import emailMask from "email-mask";
import EmailVerified from "./component/email-verified";
import EmailAddressBox from "./component/email-address-box";
import { connect } from "@/app/backend/dbConfig/dbConfig";
connect();
export default async function page(req) {
  let { slug } = req.params;
  const [slug1] = slug || [];
  if (slug1) {
    const formData = new FormData(req.body);
    const data = await VisitorRegistration.findOne({
      unique_reference_number: slug1,
    });
    if (!data) {
      return redirect("/");
    }
    const email = data?.email;
    sendMailToUser(email);

    const maskedEmail = emailMask(email);
    return (
      <DownloadBadgePage>
        <EmailVerified />
      </DownloadBadgePage>
    );
  }
  // if slug is not found then redirect to homepage
  // show email address input field
  // and send otp to email address
  // verify then redirect with slug (which contain toke)

  return (
    <DownloadBadgePage>
      <EmailAddressBox />
    </DownloadBadgePage>
  );
}
