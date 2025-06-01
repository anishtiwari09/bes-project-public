import { ADMIN_RECEIVER_MAIL } from "@/app/backend/constant";
import { visitorUserDetailsTemplate } from "@/app/backend/helper/mailHelper/template/visitorTemplate";
import emailVerification from "@/app/backend/models/email_verification.model";
import { NextResponse } from "next/server";
import { sendMail } from "../../sendMail/mail";
import { connect } from "@/app/backend/dbConfig/dbConfig";
import BookMySpace from "@/app/backend/models/book_my_space.model";
import SpaceTypeScheme from "@/app/backend/models/space_type_scheme";


connect();

interface BookMySpaceRequestBody {
  name: string;
  about_expo?: string;
  designation?: string;
  company: string;
  city: string;
  country: string;
  mobile: string;
  email: string;
  otp: string;
  space_type: string; // "row" | "shell"
  space_sqm: number;
}

function generateTrackingId(prefix = "EXPOSPACE20205"): string {
  return `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function POST(req: Request) {
  try {
    const json: BookMySpaceRequestBody = await req.json();

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
      space_type,
      space_sqm,
    } = json;

    const existingUser = await BookMySpace.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email or mobile is already registered", status: false },
        { status: 409 }
      );
    }

    const emailResult = await emailVerification.findOne({ email, otpCode: otp });

    if (!emailResult || !emailResult.isVerified || emailResult.hasOtpExpired) {
      return NextResponse.json(
        { message: "OTP has expired or is invalid", status: false },
        { status: 401 }
      );
    }

    // Pricing
    const scheme = await SpaceTypeScheme.findOne({ name: space_type, is_active: true });

    if (!scheme) {
      return NextResponse.json(
        { message: "Invalid space type selected", status: false },
        { status: 400 }
      );
    }

    const basePrice = scheme.price_per_sqm * space_sqm;
    const taxRate = scheme.tax_rate ?? 18;
    const taxAmount = (basePrice * taxRate) / 100;
    const totalAmount = basePrice + taxAmount;
    const trackingId = generateTrackingId();

    const newUser = new BookMySpace({
      name,
      about_expo,
      designation,
      organisation,
      city,
      country,
      mobile,
      email,
      space_type,
      space_sqm,
      price_at_booking: basePrice,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      tracking_id: trackingId,
    });

    await newUser.save();

    const visitorTemplate = visitorUserDetailsTemplate(
      {
        Name: name,
        "How did you hear about the expo?": about_expo,
        Designation: designation,
        Organisation: organisation,
        City: city,
        Country: country,
        Mobile: mobile,
        Email: email,
        "Space Type": space_type,
        "Selected Area (sqm)": space_sqm,
        "Base Price": `₹${basePrice}`,
        "GST (%)": `${taxRate}%`,
        "GST Amount": `₹${taxAmount}`,
        "Total Amount": `₹${totalAmount}`,
        "Tracking ID": trackingId,
      },
      "New Registration for BookMySpace"
    );

    await sendMail({
      email: ADMIN_RECEIVER_MAIL,
      subject: `New User Registered [${trackingId}]`,
      html: visitorTemplate,
    });

    return NextResponse.json(
      { message: "User registered successfully", status: true, tracking_id: trackingId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { message: "Something went wrong", status: false },
      { status: 500 }
    );
  }
}
