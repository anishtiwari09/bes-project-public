"use server";
import { emailValidator, numberValidator } from "@/app/Utility/validator";
import { sendMail } from "../api/sendMail/mail";
import { ADMIN_RECEIVER_MAIL } from "../constant";
import { visitorUserDetailsTemplate } from "../helper/mailHelper/template/visitorTemplate";

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
