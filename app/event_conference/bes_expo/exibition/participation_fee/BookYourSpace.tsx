"use client";
import { emailValidator, numberValidator } from "@/app/Utility/validator";
import {
  Alert,
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "@/app/registrationform/Form/form.module.css";
import PleaseWaitLoader from "@/app/UIComponent/Loader/PleaseWaitLoader";
import OTP from "@/app/registrationform/Form/otpinput";
import EmailOtpLoader from "@/app/registrationform/Form/EmailOtpLoader";
import axios from "axios";
import SuccessModal from "@/app/UIComponent/Modals/SuccessModal";
import { ApiPayload, ApiResponse, InputFieldTypeRecord } from "./types";
export default function BookYourSpace({
  countryData,
  currentPath = "bookMySpace"
}: any) {
  const [data, setData] = useState<InputFieldTypeRecord>({});
  const [submit, setSubmit] = useState(false);
  const [showSuccessModal, setSuccessModal] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isDisabledOtpSendBtn, setIsDisabledOtpSendBtn] = useState(false);
  const [otpInput, setOtpInput] = React.useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isOtpSend, setIsOtpSend] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const handleChange = (type: any, value: any) => {
    if (isOtpSend && type === "email") return;
    if (data[type]) data[type].value = value;
    else {
      data[type] = { value: value,isError:false,error:'' };
    }
    if (value?.trim()) {
      data[type].isError = false;
    }
    setData({ ...data });
  };
  const checkValidator = (type: string, data: InputFieldTypeRecord) => {
    let isFlag = true;
    if (data[type]?.value?.trim()) {
      data[type].isError = false;
    } else {
      isFlag = false;
      data[type] = data[type] || {};
      data[type].isError = true;
    }
    data[type].error = "";
    return isFlag;
  };
  const handleSubmitApi = async (data:ApiPayload) => {
    try {
      let res:any = await axios({
        method: "POST",
        url: "/backend/api/registration/book_my_space",
        data: { ...data, otp: otpInput },
      });
      
      setAlertMessage(res?.message || "Something went wrong");
      if (!res.status) {
        setSubmit(false);
      } else {
        setSuccessModal(true);
      }
    } catch (e:any) {
      console.log(e);
      setAlertMessage(e?.response?.data?.message || "Something went wrong");
      setSubmit(false);
    }
  };
  const handleSubmit = () => {
    setAlertMessage("");
    if (!isEmailVerified) {
      setAlertMessage("Please Verify the email");
      return;
    }
    let isFlag = [];
    isFlag.push(checkValidator("name", data));
    isFlag.push(checkValidator("company", data));

    isFlag.push(checkValidator("city", data));
    let temp = checkValidator("email", data);
    if (temp) {
      let validator = emailValidator(data["email"]?.value || "");
      isFlag.push(validator);
      if (!validator) {
        data["email"].isError = true;
        data["email"].error = "Please provide valid email";
      }
    }
    isFlag.push(temp);
    temp = checkValidator("mobile", data);
    if (temp) {
      let validator = numberValidator(data["mobile"]?.value || "");
      isFlag.push(validator);
      if (!validator) {
        data["mobile"].isError = true;
        data["mobile"].error = "Please provide valid mobile";
      }
    }
    isFlag.push(temp);
    isFlag.push(checkValidator("country", data));
    isFlag.push(checkValidator("about_expo", data));
    if (isFlag.includes(false)) {
      setData({ ...data });
    } else {
      let finalObj:ApiPayload = {};
      for (let key in data) {
        finalObj[key] = data[key].value?.trim();
      }

      setSubmit(true);
      handleSubmitApi(finalObj);
    }
  };
  const invalidEmailShowMessage = (item: any) => {
    item.isError = true;
  };
  const handleSendEmailOtp = async () => {
    let isValidEmail = true;
    let value = data["email"]?.value;
    isValidEmail = emailValidator(value);
    if (!isValidEmail) {
      if (data["email"]) invalidEmailShowMessage(data["email"]);
      else {
        data.email = {
          value: "",
          isError: true,
          error: "Please enter valid email",
        };
      }
    }

    if (isValidEmail) {
      setIsOtpSend(true);
      setIsDisabledOtpSendBtn(true);
      setCurrentEmail(value);
    } else {
      setData({ ...data });
    }
  };
  const handleEmailVerify = async () => {
    if (otpInput?.length < 4) {
      setAlertMessage("Please Enter the otp");
      return;
    }
    setIsDisabled(true);
    setAlertMessage("");
    try {
      let result:ApiResponse = await axios({
        method: "POST",
        url: "/backend/api/verification/email_verification/verify_otp",
        data: {
          email: currentEmail,
          otp: otpInput,
        },
      });

      if (result.status) {
        setIsEmailVerified(true);
        return;
      } else {
        setAlertMessage(result?.message || "Invalid Otp");
      }
    } catch (e:any) {
      setAlertMessage(e?.response?.data?.message || "Invalid Otp");
      console.log(e);
    }
    setIsDisabled(false);
  };
  const sendEmailOtp = async (email: any) => {
    try {
      await axios({
        method: "POST",
        url: "/backend/api/verification/email_verification/send_otp",
        data: {
          email,
          from: currentPath,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (isDisabledOtpSendBtn && !isEmailVerified && currentEmail) {
      sendEmailOtp(currentEmail);
    }
  }, [isDisabledOtpSendBtn, currentEmail]);
  return (
    <div className="flex gap-2 flex-col bg-white p-4 rounded">
      <h3 className="text-[30px] text-center font-bold">Book your space</h3>
      <p className="text-[16px] font-bold">
        Please submit your details in the form below and a member of from our
        team will get back to you.
      </p>
      <div className="flex flex-col gap-4 my-8">
        {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
        <div className="flex flex-row gap-4 items-center ">
          <label className="w-[180px]">
            Full Name <span className="text-[red]">*</span>
          </label>
          <div className="flex flex-1">
            <TextField
              fullWidth
              onChange={(e) => handleChange("name", e.target.value)}
              error={data["name"]?.isError || false}
              helperText={
                data["name"]?.isError
                  ? data["name"]?.error || "This Field is Required"
                  : ""
              }
              value={data["name"]?.value || ""}
            />
          </div>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <label className="w-[180px]">
            Company / Organisation Name <span className="text-[red]">*</span>
          </label>
          <div className="flex flex-1">
            <TextField
              fullWidth
              onChange={(e) => handleChange("company", e.target.value)}
              value={data["company"]?.value || ""}
              error={data["company"]?.isError || false}
              helperText={

                data["company"]?.isError
                
                  ? data["company"]?.error || "This Field is Required"
                  : ""
              }
            />
          </div>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <label className="w-[180px]">Designation</label>
          <div className="flex flex-1">
            <TextField
              fullWidth
              value={data["designation"]?.value || ""}
              onChange={(e) => handleChange("designation", e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <label className="w-[180px]">
            Email <span className="text-[red]">*</span>
          </label>
          <div className="flex flex-1">
            <TextField
              disabled={submit || isEmailVerified || isOtpSend}
              fullWidth
              value={data["email"]?.value || ""}
              error={data["email"]?.isError || false}
              onChange={(e) => handleChange("email", e.target.value)}
              helperText={
                data["email"]?.isError
                  ? data["email"]?.error || "This Field is Required"
                  : ""
              }
            />
          </div>
        </div>
        {!isEmailVerified && (
          <div className="flex flex-row gap-4 items-center">
            <label className="w-[180px] invisible">
              Email <span className="text-[red]">*</span>
            </label>
            <div className="flex flex-1">
              {isDisabledOtpSendBtn && !isEmailVerified ? (
                <Stack
                  direction={"column"}
                  alignItems={"center"}
                  marginTop={2}
                  gap={1}
                >
                  <Stack direction={"row"} gap={1}>
                    <OTP
                      separator={" "}
                      value={otpInput}
                      disabled={isDisabled}
                      onChange={isDisabled ? () => {} : setOtpInput}
                      length={4}
                    />
                    {isDisabled ? (
                      <h3>Otp is Verifying</h3>
                    ) : (
                      <Button
                        className="text-red-600"
                        onClick={handleEmailVerify}
                      >
                        Verify Otp
                      </Button>
                    )}
                  </Stack>
                  <EmailOtpLoader setIsOtpSend={setIsDisabledOtpSendBtn} />
                </Stack>
              ) : (
                <Button onClick={handleSendEmailOtp}>
                  {isOtpSend ? "Resend " : "Send "}Otp
                </Button>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-row gap-4 items-center">
          <label className="w-[180px]">
            Mobile No. <span className="text-[red]">*</span>
          </label>
          <div className="flex flex-1">
            <TextField
              fullWidth
              value={data["mobile"]?.value || ""}
              error={data["mobile"]?.isError || false}
              onChange={(e) => handleChange("mobile", e.target.value)}
              helperText={
                data["mobile"]?.isError
                  ? data["mobile"]?.error || "This Field is Required"
                  : ""
              }
            />
          </div>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <label className="w-[180px]">
            City <span className="text-[red]">*</span>
          </label>
          <div className="flex flex-1">
            <TextField
              fullWidth
              value={data["city"]?.value || ""}
              error={data["city"]?.isError || false}
              onChange={(e) => handleChange("city", e.target.value)}
              helperText={
                data["city"]?.isError
                  ? data["city"]?.error || "This Field is Required"
                  : ""
              }
            />
          </div>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <label className="w-[180px]">
            Country <span className="text-[red]">*</span>
          </label>
          <div className="flex flex-1">
            <FormControl fullWidth>
              <Autocomplete
                value={data["country"]?.value || null}
                className="cursor-pointer"
                fullWidth
                options={countryData}
                getOptionLabel={(role) => role}
                onChange={(e, value) => handleChange("country", value)}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      label={"Select Country"}
                      error={data["country"]?.isError}
                      helperText={
                        data["country"]?.isError
                          ? data["city"]?.error || "This Field is Required"
                          : ""
                      }
                    />
                  );
                }}
              />
            </FormControl>
          </div>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <label className="w-[180px]">
            How did you hear about the expo?{" "}
            <span className="text-[red]">*</span>
          </label>
          <div className="flex flex-1">
            <FormControl fullWidth>
              <Select
                error={data["about_expo"]?.isError}
                fullWidth
                disabled={false}
                value={data["about_expo"]?.value || " "}
                onChange={(e) => handleChange("about_expo", e.target.value)}
              >
                <MenuItem value={" "}>Select an option</MenuItem>
                <MenuItem value={"Google"}>Google</MenuItem>
                <MenuItem value={"LinkedIn"}>LinkedIn</MenuItem>
                <MenuItem value={"Facebook"}>Facebook</MenuItem>
                <MenuItem value={"Twitter"}>Twitter</MenuItem>
                <MenuItem value={"Instagram"}>Instagram</MenuItem>
                <MenuItem value={"Emailer"}>Emailer</MenuItem>
                <MenuItem value={"Newspaper Ads"}>Newspaper Ads</MenuItem>
                <MenuItem value={"Magazine Ads"}>Magazine Ads</MenuItem>
                <MenuItem value={"Referral from friend / colleague"}>
                  Referral from friend / colleague
                </MenuItem>
                <MenuItem value={"Whatsapp / SMS"}>Whatsapp / SMS</MenuItem>
                <MenuItem value={"Others"}>Others</MenuItem>
              </Select>
              {data["about_expo"]?.isError && (
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {data["about_expo"]?.error || "This Field is Required"}
                </FormHelperText>
              )}
            </FormControl>
          </div>
        </div>
        <div className="flex flex-row gap-4 items-center justify-center">
          {submit ? (
            <PleaseWaitLoader />
          ) : (
            <div
              className={`${styles.btn_container} m-auto justify-center flex`}
            >
              <Button
                onClick={handleSubmit}
                variant="contained"
                className={`${styles.submit_btn} w-[300px] m-auto`}
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      </div>
      {showSuccessModal && <SuccessModal isOpen={true} />}
    </div>
  );
}
