import { visitorUserDetailsTemplate } from "@/app/backend/helper/mailHelper/template/visitorTemplate";
import emailVerification from "@/app/backend/models/email_verification.model";
import VisitorRegistration from "@/app/backend/models/visitor_registration.model";
import { NextResponse } from "next/server";
import { sendMail } from "../../sendMail/mail";
import {
  ADMIN_RECEIVER_MAIL,
  PREFIX_REFERENCE_NUMBER,
} from "@/app/backend/constant";
import uniqueIdGenerator from "@/app/backend/helper/unique-id-generator";
import mongoConnection from "@/app/backend/lib/db/db-config";
import AllRegistrationTypeServices from "@/app/backend/lib/services/all-registration-type-service";
import { RegistrationServiceType } from "@/app/backend/lib/db/models/all_registration_services.model";
import ErrorWithStatusCode from "@/app/_shared/custom-error/error-with-status-code";

export async function POST(req: any) {
  try {
    await mongoConnection.connect();
    let json = await req.json();
    const { name, organisation, city, mobile, email, area_of_work, otp } = json;

    const registrationService = new AllRegistrationTypeServices();
    const isServiceRunning =
      await registrationService.checkIsServiceActiveByName(
        RegistrationServiceType.VISITOR_REGISTRATIONS
      );
    if (!isServiceRunning)
      throw ErrorWithStatusCode.error500("Service is not running");
    let emailResult = await emailVerification.findOne({ email, otpCode: otp });
    if (
      !emailResult ||
      !emailResult?.isVerified ||
      emailResult?.hasOtpExpired
    ) {
      return NextResponse.json(
        {
          message: "Otp has been expired please try again after sometime",
          status: false,
        },
        { status: 401 }
      );
    }
    let user = await VisitorRegistration.findOne({
      $or: [{ email: email }, { mobile: mobile }],
    });
    if (user) {
      return NextResponse.json(
        {
          message: "Email or mobile is already register with us",
          status: false,
        },
        { status: 409 }
      );
    }

    let urnNumber = PREFIX_REFERENCE_NUMBER + uniqueIdGenerator(7);

    let newUser = new VisitorRegistration({
      name,
      organisation,
      city,
      mobile,
      email,
      area_of_work,
      unique_reference_number: urnNumber,
    });

    await newUser.save();
    try {
      await emailVerification.findOneAndUpdate(
        { email },
        { hasOtpExpired: true }
      );
    } catch (e) {
      console.error("while updating otp", e?.message);
    }
    await handleSuccess(
      name,
      organisation,
      city,
      mobile,
      email,
      area_of_work,
      urnNumber
    );
    return NextResponse.json(
      { message: "User is created", status: true },
      { status: 201 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "something went wrong", status: false },
      { status: 500 }
    );
  }
}

const handleSuccess = async (
  name: any,
  organisation: any,
  city: any,
  mobile: any,
  email: any,
  area_of_work: any,
  urn: any
) => {
  let visitorTemplate = visitorUserDetailsTemplate({
    Name: name,
    organisation: organisation,
    City: city,
    Mobile: mobile,
    Email: email,
    "Area Of Work": area_of_work,
  });
  let adminMail = sendMail({
    email: ADMIN_RECEIVER_MAIL,
    subject: `New User (Visitor) Registered`,
    html: visitorTemplate,
  });
  // let qrcodeUrl=await generateQrCodeBuffer(`http://localhost:3000/registrationform/e-badges/download-badge/visitor/${urn}`)
  // let userMail=sendMail({
  //   email: email,
  //   subject: `Welcome to BES EXPO ${EVENT_YEAR} 🎉`,
  //   html: userEventTemplate({
  //     href:'http://localhost:3000/registrationform/e-badges/download-badge',
  //     'fullName':name,
  //     'urn':urn,

  //   }),
  //   attachments:[{filname:'qrcode.png',content:qrcodeUrl,cid:'qr-code',encoding: "base64"}]
  // })
  return Promise.all([adminMail]);
};
