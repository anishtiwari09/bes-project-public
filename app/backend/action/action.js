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
      {
        ...obj,
        token: uniqueId,
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
