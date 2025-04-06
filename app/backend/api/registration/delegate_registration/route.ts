import { ADMIN_RECEIVER_MAIL } from "@/app/backend/constant";
import { connect } from "@/app/backend/dbConfig/dbConfig";
import { visitorUserDetailsTemplate } from "@/app/backend/helper/mailHelper/template/visitorTemplate";
import DelegateUser from "@/app/backend/models/delegate_registration.model";
import emailVerification from "@/app/backend/models/email_verification.model";
import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "../../sendMail/mail";
connect();
export async function POST(req: any) {
  try {
    let json = await req.json();
    const {
      name,
      organisation,
      city,
      mobile,
      email,
      query,
      category,
      payment_type,
      bank_name,
      transaction_no,
      amount,
      other_details,
      otp,
    } = json;
    let user = await DelegateUser.findOne({
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
    } else {
      let emailResult = await emailVerification.findOne({
        email,
        otpCode: otp,
      });
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
      let newUser = new DelegateUser({
        name,
        organisation,
        city,
        mobile,
        email,
        query,
        category,
        payment_type,
        bank_name,
        transaction_no,
        amount,
        other_details,
      });
      await newUser.save();
      let visitorTemplate = visitorUserDetailsTemplate(
        {
          name,
          organisation,
          city,
          mobile,
          email,
          query,
          category,
          payment_type,
          bank_name,
          transaction_no,
          amount,
          other_details,
        },
        "New Registration for Delegate"
      );
      await sendMail({
        email: ADMIN_RECEIVER_MAIL,
        subject: `New User (Delegate) Registered`,
        html: visitorTemplate,
      });
      return NextResponse.json(
        { message: "User is created", status: true },
        { status: 201 }
      );
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "something went wrong", status: false },
      { status: 500 }
    );
  }
}
