"use server";

import { emailValidator, numberValidator } from "@/app/Utility/validator";

import UserMember from "../models/user_member.model";
import { generateUniqueLink } from "../helper/helper";
import { sendMail } from "../api/sendMail/mail";
import { generateSignupTemplate } from "../helper/mailHelper/template/signup_template";
import {
  decodeJsonToken,
  generateBcryptPassword,
  jwtGenerateToken,
} from "@/app/helper/helper";
import {
  LOCAL_URL,
  PRODUCTION_URL,
  ADMIN_RECEIVER_MAIL,
  JSESSIONID,
  PREFIX_REFERENCE_NUMBER,
} from "../constant";
import { visitorUserDetailsTemplate } from "../helper/mailHelper/template/visitorTemplate";
import feedbackDb from "@/app/about_bes/feedback/db.json";
import { cookies } from "next/headers";
import { accountSchema, emailSchema } from "@/app/helper/accountSchema";
import VisitorRegistration from "../models/visitor_registration.model";
import { generateOtpTemplate } from "../helper/mailHelper/template/otpTemplate";
import { generateOtp } from "../helper/mailHelper/otpGenerator";
import { updateEmailOtpOnDb } from "./updateDb";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import uniqueIdGenerator from "../helper/unique-id-generator";
import { signupSchema } from "@/app/_shared/validation-schema";
import { UserService } from "../lib/services/user-services";
import { SignupData, UserData } from "../lib/types";
import { expiryDate } from "../helper/util";
import EmailNotification from "../lib/services/notification/email-notification";
import JwtTokenService from "../lib/services/jwt-service";
// connect();
export const signUpAction = async (prevState: any, formData: any) => {
  const data = formData || {};
  const parsedData = signupSchema.safeParse(data);
  if (!parsedData.success) {
    const firstError = parsedData.error.errors[0].message;
    return { ...prevState, status: false, message: firstError };
  }
  const obj = parsedData.data;
  try {
    let uniqueId = generateUniqueLink();
    const user = new UserService();
    let passwordHash = await generateBcryptPassword(obj.password);

    const jwtService = new JwtTokenService();
    let jwtToken = await jwtService.createToken({ email: obj?.email }, "24h");
    let url = "/account_setup/" + uniqueId + "/" + jwtToken;
    const verificationTokenExpires = expiryDate(24); // 24 hours from now
    await user.createUser({
      ...obj,
      passwordHash: passwordHash,
      verificationToken: jwtToken,
      unique: uniqueId,
      verificationTokenExpires,
    } as SignupData);
    await EmailNotification.memberSignup(obj?.email, url);
    return {
      ...prevState,
      status: true,
      message: "Account created successfully, please check your email",
    };
  } catch (e) {
    return {
      ...prevState,
      status: false,

      message: e?.message || "Something went wrong please try again later",
    };
  }
};

export const createNewPasswordAction = async (
  prevState: any,
  formData: any,
  slug1: any,
  slug2: any
) => {
  let password = formData.get("password");
  if (!slug1) {
    return {
      ...prevState,
      status: false,
      message: "Invalid url please try again with valid url",
    };
  }
  if (!password.trim()) {
    return {
      ...prevState,
      status: false,
      message: "please add valid password",
    };
  }
  let hashPassword = "";
  try {
    hashPassword = await generateBcryptPassword(password, 4);
  } catch (e) {
    console.log(e);
    return {
      ...prevState,
      status: false,
      message: "Something went wrong please try agian later",
    };
  }
  try {
    const user = await UserMember.findOne({ token: slug1 });
    if (!user) {
      return {
        ...prevState,
        status: false,
        message: "Invalid url please try again with valid url",
      };
    }
    let data = await UserMember.findOneAndUpdate(
      { token: slug1 },
      {
        isEmailVerified: true,
        password: hashPassword,
        isLinkExpired: true,
        verifiedToken: slug1,
      }
    );
    return {
      ...prevState,
      status: true,
      message: "Password has been successfully reset, please login",
    };
  } catch (e) {
    console.log(e);
  }
};

export const checkAndUpdateToken = async (obj: { token: string }) => {
  let user = new UserService();
  const isValid = await user.validateAndUpdateToken(obj?.token);

  return isValid;
};
export const forgotPasswordAction = async (prevState: any, formData: any) => {
  let email = formData.get("email");
  let isValidEmail = emailValidator(email);
  let uniqueId = generateUniqueLink();
  if (!isValidEmail) {
    return {
      ...prevState,
      message: "Please enter valid email address",
      status: false,
    };
  }
  try {
    let data = await UserMember.findOneAndUpdate(
      { email },
      { token: uniqueId, isLinkExpired: false }
    );
    if (data) {
      let jwtToken = jwtGenerateToken({ email: email });
      let url =
        process.env.enviroment === "production" ? PRODUCTION_URL : LOCAL_URL;
      url += "/account_setup/" + uniqueId + "/" + jwtToken;
      sendMail({
        email: email,
        subject: "(Action Required) Reset Password",
        html: generateSignupTemplate(url),
      });
    }
  } catch (e) {
    console.log(e);
  }
  return {
    ...prevState,
    status: true,
    message:
      "Reset link has been sent to your email address, if it is registered with us",
  };
};

export const contactUsAction = async (prevState: any, formData: any) => {
  let retrieveParams = ["name", "email", "mobile", "message"];
  let obj: { [key: string]: string } = {};
  for (let key of retrieveParams) {
    let value = formData.get(key);
    value = value?.trim();
    if (!value) {
      return {
        ...prevState,
        status: false,
        message: "Please fill all the field",
      };
    }
    if (key === "email" && !emailValidator(value)) {
      return {
        ...prevState,
        status: false,
        message: "Email is not valid please try again with valid email",
      };
    }
    if (key === "mobile" && !numberValidator(value)) {
      return {
        ...prevState,
        status: false,
        message:
          "Mobile number is not valid please try again with valid number",
      };
    }
    obj[key] = value;
  }
  let template = visitorUserDetailsTemplate(obj, "New Enquiry");
  try {
    await sendMail({
      email: ADMIN_RECEIVER_MAIL,
      text: "",
      subject: "New Enquiry (urgent Action)",
      html: template,
    });
    await new Promise((res) => {
      setTimeout(() => {
        res(1);
      }, 5000);
    });
    return {
      ...prevState,
      status: true,
      message:
        "You request has been successfully submitted, we will get back you soon.",
    };
  } catch (e) {
    console.log(e);
    return {
      ...prevState,
      status: false,
      message: "Something went wrong",
    };
  }
};
export const feedbackFormAction = async (prevState: any, formData: any) => {
  let retrieveParams = feedbackDb;
  let obj: { [key: string]: string } = {};
  for (let params of retrieveParams) {
    const { key } = params;
    let value = formData.get(key);
    value = value?.trim();

    if (params.required) {
      if (!value) {
        return {
          ...prevState,
          status: false,
          message: "Please fill all the field",
        };
      }
      if (key === "email" && !emailValidator(value)) {
        return {
          ...prevState,
          status: false,
          message: "Email is not valid please try again with valid email",
        };
      }
      if (key === "mobile" && !numberValidator(value)) {
        return {
          ...prevState,
          status: false,
          message:
            "Mobile number is not valid please try again with valid number",
        };
      }
      obj[key] = value;
    } else if (value) {
      obj[key] = value;
    }
  }
  let template = visitorUserDetailsTemplate(obj, "New Feedback Recieved");
  try {
    await sendMail({
      email: ADMIN_RECEIVER_MAIL,
      text: "",
      subject: "New Feedback Recieved",
      html: template,
    });
    await new Promise<void>((res) => {
      setTimeout(() => {
        res();
      }, 5000);
    });
    return {
      ...prevState,
      status: true,
      message:
        "You request has been successfully submitted, we will get back you soon.",
    };
  } catch (e) {
    console.log(e);
    return {
      ...prevState,
      status: false,
      message: "Something went wrong",
    };
  }
};

export const userLoginAction = async (prevState: any, formData: any) => {
  const email = formData.get("email");
  const password = formData.get("password");
  if (!email?.trim()) {
    return {
      ...prevState,
      status: false,
      message: "Please enter valid email address.",
    };
  }
  if (!password?.trim()) {
    return {
      ...prevState,
      status: false,
      message: "Passowrd field can not be empty.",
    };
  }
  try {
    const user = new UserService();
    const userData = await user.getUserByEmail(email);
    if (!userData) {
      return {
        ...prevState,
        status: false,
        message: "Invalid email or password.",
      };
    }
    const jwtService = new JwtTokenService();
    const isPasswordValid = await jwtService.comparePassword(
      userData.passwordHash,
      password
    );

    if (!isPasswordValid) {
      return {
        ...prevState,
        status: false,
        message: "Invalid email or password.",
      };
    }

    let cookie = await cookies();
    cookie.set("isLogi", "true");
    return {
      ...prevState,
      status: true,
      message: "Login successful.",
    };
  } catch (e) {
    console.error("Error while signin", e?.message);
    return {
      ...prevState,
      status: false,
      message: "Something went wrong, please try again later.",
    };
  }
};

export const getUserName = async (token: any) => {
  const verifiedToken = decodeJsonToken(token);
  if (!verifiedToken) return null;
  try {
    let data = await UserMember.findOne({ verifiedToken });
    if (!data) return null;

    return data?.name;
  } catch (e) {
    console.log(e);
  }
};
export const deleteCookiesAction = async (key: any) => {
  let cookie = await cookies();
  cookie.delete(key);
};

export const getUserDetails = async (token: any) => {
  const verifiedToken = decodeJsonToken(token);
  if (!verifiedToken) return null;
  try {
    let data = await UserMember.findOne({ verifiedToken }, null, {
      lean: true,
    });

    if (!data) return null;

    return JSON.parse(JSON.stringify(data));
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const updateMyAccountDetails = async (prevState: any, formData: any) => {
  let user: { [key: string]: string } = {};
  let arr = [
    "name",
    "mobile",
    "organisation",
    "designation",
    "city",
    "country",
  ];
  for (let key of arr) {
    user[key] = formData.get(key) || "";
  }
  let validate = accountSchema;
  try {
    validate.parse(user);
  } catch (e) {
    console.log(e);
    return { ...prevState, status: false, message: "All Field is required..." };
  }
  let cookie = await cookies();
  let token: RequestCookie | string | undefined = cookie!.get(JSESSIONID);

  token = token?.value || "";

  let verifiedToken = decodeJsonToken(token);
  if (verifiedToken) {
    try {
      await UserMember.findOneAndUpdate({ verifiedToken }, user);
      return {
        ...prevState,
        status: true,
        message: "Account has been Successfully updated",
      };
    } catch (e: any) {
      return {
        ...prevState,
        status: false,
        message: e?.message || "Something went wrong...",
      };
    }
  }

  return { ...prevState, status: false, message: "Something went wrong..." };
};

export const getVisitorDetails = async (prevState: any, formData: any) => {
  const email = formData.get("email") || "";
  const result = emailSchema.safeParse(email);
  if (!result.success) {
    return {
      status: false,
      message: "Please enter valid email address",
    };
  }
  try {
    let user = await VisitorRegistration.findOne({ email: email }).lean(true);
    if (!user) {
      return {
        status: false,
        message: "Please enter valid email address",
        isError: true,
      };
    }
    if (!user?.unique_reference_number) {
      let urnNumber = PREFIX_REFERENCE_NUMBER + uniqueIdGenerator(7);
      await VisitorRegistration.updateOne(
        { email },
        { unique_reference_number: urnNumber }
      );
      user.unique_reference_number = urnNumber;
    }
    return {
      status: true,
      isError: false,
      message: "User Found",
      urn: user?.unique_reference_number,
    };
  } catch (e) {
    console.log(e);
    return {
      status: false,
      message: "Something went wrong",
      isError: true,
    };
  }
};

export const sendMailToUser = async (email: any) => {
  const subject = "Otp For Verification";
  let otp = generateOtp(4);
  if (!emailValidator(email)) {
    return {
      status: false,
      message: "Please enter valid email address",
    };
  }

  await sendMail({
    email,
    subject,
    html: generateOtpTemplate(otp),
  });
  await updateEmailOtpOnDb({ email, otp });
};
