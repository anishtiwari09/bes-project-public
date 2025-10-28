import { NextResponse } from "next/server";
import { generateBadgePdf } from "../../badges/generate-badge";
import emailVerification from "../../models/email_verification.model";
import { getUserDetailFromUrn } from "../../action/getUserDetails";
import { generateQrCodeBase64 } from "../../helper/generate-qrcode";
import { updateEmailOtpWithCustomAttribute } from "../../action/updateDb";
import { connect } from "../../dbConfig/dbConfig";

connect();
export async function POST(req: any) {
  try {
    let payload = await req.json();
    const otp = Number(payload?.otp || "");
    let userDetails;
    try {
      userDetails = await getUserDetailFromUrn(payload?.urn);
    } catch (e) {
      return NextResponse.json(
        {
          message: "Verification faild2, Otp is invalid or expired",
          status: false,
        },

        { status: 401 }
      );
    }
    let user = await emailVerification.findOne({
      email: userDetails?.email,
      otpCode: otp,
    });
    await updateEmailOtpWithCustomAttribute(userDetails.email, {
      hasOtpExpired: true,
    });
    if (!user || user?.hasOtpExpired || !userDetails?.email) {
      return NextResponse.json(
        {
          message: "Verification faild, Otp is invalid or expired",
          status: false,
        },

        { status: 401 }
      );
    }
    const qrCodeUrl = await generateQrCodeBase64(
      `${userDetails?.name}  ${userDetails?.mobile}`
    );
    const pdfBuffer = await generateBadgePdf(
      userDetails?.name,
      userDetails?.organisation,
      qrCodeUrl,
      payload?.urn
    );
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=badge.pdf",
      },
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Something went wrong", status: false },
      { status: 500 }
    );
  }
}
