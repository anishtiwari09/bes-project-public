"use server";

import { emailValidator, numberValidator } from "@/app/Utility/validator";
import { connect } from "../dbConfig/dbConfig";
import UserMember from "../models/user_member.model";
import { generateUniqueLink } from "../helper/helper";
import { sendMail } from "../api/sendMail/mail";
import { generateSignupTemplate } from "../helper/mailHelper/template/signup_template";
import {
  compareHashPassword,
  decodeJsonToken,
  generateBcryptPassword,
  jwtGenerateToken,
} from "@/app/helper/helper";
import {
  LOCAL_URL,
  PRODUCTION_URL,
  ADMIN_RECEIVER_MAIL,
  JSESSIONID,
  ENVIROMENT,
} from "../constant";
import { visitorUserDetailsTemplate } from "../helper/mailHelper/template/visitorTemplate";
import feedbackDb from "@/app/about_bes/feedback/db.json";
import { cookies } from "next/headers";
import { accountSchema, emailSchema } from "@/app/helper/accountSchema";
import VisitorRegistration from "../models/visitor_registration.model";
import { generateOtpTemplate } from "../helper/mailHelper/template/otpTemplate";
import { generateOtp } from "../helper/mailHelper/otpGenerator";
connect();
export const signUpAction = async (prevState, formData) => {
  let obj = {};
  let retrieveParams = ["name", "email", "city", "organisation"];
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

    // if (value.trim()) {
    //   if(key==='email'){
    //     let isValid='emai'
    //   }
    // }
  }
  try {
    let user = await UserMember.findOne({ email: obj?.email });
    if (user && user?.isEmailVerified) {
      return {
        ...prevState,
        status: false,
        message:
          "This email is already registed with us please register with different email.",
      };
    }
  } catch (e) {
    console.log(e);
    return {
      ...prevState,
      status: false,
      message: "Something went wrong please try again later",
    };
  }
  try {
    let uniqueId = generateUniqueLink();
    const options = {
      new: true, // Return the updated document
      upsert: true, // Create the document if it doesn't exist
      setDefaultsOnInsert: true, // Apply schema defaults on insert
    };

    await UserMember.findOneAndUpdate(
      { email: obj?.email },
      {
        ...obj,
        token: uniqueId,
        tracking_id: uniqueId,
        tokenGeneratedTime: Date.now(),
      },
      options
    );
    let jwtToken = jwtGenerateToken({ email: obj?.email });
    let url = ENVIROMENT === "production" ? PRODUCTION_URL : LOCAL_URL;
    url += "/account_setup/" + uniqueId + "/" + jwtToken;
    try {
      await sendMail({
        email: obj.email,
        subject: "Action Required For New Account Creation",
        html: generateSignupTemplate(url),
      });
    } catch (e) {
      console.log(e);
    }
    return {
      ...prevState,
      status: true,
      message:
        "Account Creation has been successfully done, a verification link has been sent to you on email.",
    };
  } catch (e) {
    console.log(e);
    return {
      ...prevState,
      status: false,
      message: "Something went worng",
    };
  }
};

export const createNewPasswordAction = async (
  prevState,
  formData,
  slug1,
  slug2
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

export const checkWheatherUserExist = async (obj) => {
  let isValid = false;
  try {
    let data = await UserMember.findOne(obj);
    isValid = !!data;
    if (isValid) {
      isValid = !data?.isLinkExpired;
    }
  } catch (e) {
    console.log(e);
  }
  return isValid;
};
export const forgotPasswordAction = async (prevState, formData) => {
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

export const contactUsAction = async (prevState, formData) => {
  let retrieveParams = ["name", "email", "mobile", "message"];
  let obj = {};
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
export const feedbackFormAction = async (prevState, formData) => {
  let retrieveParams = feedbackDb;
  let obj = {};
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
    await new Promise((res) => {
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

export const userLoginAction = async (prevState, formData) => {
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
    const data = await UserMember.findOne({ email });

    if (!data) {
      return {
        ...prevState,
        status: false,
        message: "Email or Password is invalid.",
      };
    }

    let isValidPassword = await compareHashPassword(password, data.password);
    if (!isValidPassword) {
      return {
        ...prevState,
        status: false,
        message: "Email or Password is invalid.",
      };
    }
    if (!data.isActive) {
      return {
        ...prevState,
        status: false,
        message: "Your account is not active.",
      };
    }
    let token = jwtGenerateToken({
      date: Date.now(),
      verifiedToken: data.verifiedToken,
    });
    cookies().set(JSESSIONID, token, { secure: true });
    return { ...prevState, status: true, message: "Successfully Login", token };
  } catch (e) {
    console.log(e);
    return {
      ...prevState,
      status: false,
      message: "Something went wrong please try again later.",
    };
  }
};

export const getUserName = async (token) => {
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
export const deleteCookiesAction = (key) => {
  cookies().delete(key);
};

export const getUserDetails = async (token) => {
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

export const updateMyAccountDetails = async (prevState, formData) => {
  let user = {};
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
  let token = cookies().get(JSESSIONID);
  token = token.value || "";

  let verifiedToken = decodeJsonToken(token);
  if (verifiedToken) {
    try {
      await UserMember.findOneAndUpdate({ verifiedToken }, user);
      return {
        ...prevState,
        status: true,
        message: "Account has been Successfully updated",
      };
    } catch (e) {
      console.log(e);
      return {
        ...prevState,
        status: false,
        message: e?.message || "Something went wrong...",
      };
    }
  }

  return { ...prevState, status: false, message: "Something went wrong..." };
};

export const getVisitorDetails = async (prevState, formData) => {
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
    return {
      status: true,
      isError: false,
      message: "User Found",
      urn: user?.unique_reference_number || "something",
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

export const sendMailToUser = async (email) => {
  const subject = "Otp For Verification";
  let otp = generateOtp(4);
  if (!emailValidator(email)) {
    return {
      status: false,
      message: "Please enter valid email address",
    };
  }
  try {
    await sendMail({
      email,
      subject,
      html: generateOtpTemplate(otp),
    });
    return {
      status: true,
      message: "Email sent successfully",
    };
  } catch (e) {
    console.log(e);
    return {
      status: false,
      message: "Something went wrong",
    };
  }
};
