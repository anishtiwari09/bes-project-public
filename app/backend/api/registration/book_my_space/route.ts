import { ADMIN_RECEIVER_MAIL } from "@/app/backend/constant";
import { visitorUserDetailsTemplate } from "@/app/backend/helper/mailHelper/template/visitorTemplate";
import emailVerification from "@/app/backend/models/email_verification.model";
import { NextResponse } from "next/server";
import { sendMail } from "../../sendMail/mail";
import { connect } from "@/app/backend/dbConfig/dbConfig";
import BookMySpace from "@/app/backend/models/book_my_space.model";
connect();
export async function POST(req: any) {
  try {
    let json = await req.json();
    const {
      name,
      about_expo,
      designation,
      company: organisation,
      city,
      country,
      mobile,
      email,
      otp,
    } = json;
    let user = await BookMySpace.findOne({
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
      let newUser = new BookMySpace({
        name,
        about_expo,
        designation,
        organisation,
        city,
        country,
        mobile,
        email,
      });
      await newUser.save();
      let visitorTemplate = visitorUserDetailsTemplate(
        {
          name,
          "How did you hear about the expo? ": about_expo,
          Designation: designation,
          Organisation: organisation,
          city,
          country,
          mobile,
          email,
        },
        "New Registration for BookMySpace"
      );
      await sendMail({
        email: ADMIN_RECEIVER_MAIL,
        subject: `New User (BookMySpace) Registered`,
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
