import emailMask from "email-mask";
import { getUserDetailFromUrn } from "@/app/backend/action/getUserDetails";
import DownloadBadgePage from "./component/download-badge-page";
import EmailAddressBox from "./component/email-address-box";
import EmailVerifingBox from "./component/email-verified";
import { Typography } from "@mui/material";
import { sendMailToUser } from "@/app/backend/action/action";
import { redirect } from "next/navigation";
export default async function page(req: any) {
  let { slug } = req.params;
  const [slug1] = slug || [];
  return redirect("/");
  if (slug1) {
    let email = "";
    try {
      const data = await getUserDetailFromUrn(slug1);
      email = data?.email;
    } catch (e) {
      return redirect("/");
    }
    try {
      await sendMailToUser(email);
    } catch (e) {
      console.log(e);
      return (
        <Typography variant="h5" textAlign={"center"} color={"red"}>
          Something went wrong, please try again later. Something went wrong
          please try again after
        </Typography>
      );
    }

    const maskedEmail:any = emailMask(email);

    return (
      <DownloadBadgePage>
        <EmailVerifingBox maskedEmail={maskedEmail} urn={slug1} />
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
