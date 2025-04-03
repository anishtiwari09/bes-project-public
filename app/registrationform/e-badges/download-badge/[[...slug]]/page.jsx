import React from "react";
import emailMask from "email-mask";
import { getUserDetailFromUrn } from "@/app/backend/action/getUserDetails";
import DownloadBadgePage from "./component/download-badge-page";
import EmailAddressBox from "./component/email-address-box";
import EmailVerifingBox from "./component/email-verified";
export default async function page(req) {
  let { slug } = req.params;
  const [slug1] = slug || [];
  if (slug1) {
    let email = "";
    try {
      const data = await getUserDetailFromUrn(slug1);
      email = data?.email;
    } catch (e) {
      //return redirect("/");
      return <div>Hellow</div>;
    }
    try {
      // await csendMailToUser(email);
    } catch (e) {}
    const maskedEmail = emailMask(email);

    return (
      <DownloadBadgePage>
        <EmailVerifingBox maskedEmail={maskedEmail} />
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
