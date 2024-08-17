"use server";

import { emailValidator, numberValidator } from "@/app/Utility/validator";
import { connect } from "../dbConfig/dbConfig";
import UserMember from "../models/user_member.model";
import { generateUniqueLink } from "../helper/helper";
import { sendMail } from "../api/sendMail/mail";
import { generateSignupTemplate } from "../helper/mailHelper/template/signup_template";
import { jwtGenerateToken } from "@/app/helper/helper";
import { LOCAL_URL, PRODUCTION_URL } from "../constant";
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
    let url =
      process.env.enviroment === "production" ? PRODUCTION_URL : LOCAL_URL;
    url += "/account_setup/" + uniqueId + "/" + jwtToken;
    sendMail({
      email: obj.email,
      subject: "Action Required For New Account Creation",
      html: generateSignupTemplate(url),
    });
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
        password: password,
        isLinkExpired: true,
      }
    );
    console.log(data);
    return {
      ...prevState,
      status: true,
      message: "Password has been successfully reset, please login",
    };
  } catch (e) {}
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
  console.log({ forgot: "forgot password" });
  if (!isValidEmail) {
    return {
      ...prevState,
      message: "Please enter valid email address",
      stauts: true,
    };
  }
  try {
    let data = await UserMember.findOneAndUpdate(
      { email },
      { token: uniqueId, isLinkExpired: false }
    );
    if (data) {
      let jwtToken = jwtGenerateToken({ email: obj?.email });
      let url =
        process.env.enviroment === "production" ? PRODUCTION_URL : LOCAL_URL;
      url += "/account_setup/" + uniqueId + "/" + jwtToken;
      sendMail({
        email: obj.email,
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
