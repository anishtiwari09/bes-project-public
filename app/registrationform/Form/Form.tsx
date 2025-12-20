"use client";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import styles from "./form.module.css";
import { numberValidator, emailValidator } from "@/app/Utility/validator";
import PleaseWaitLoader from "@/app/UIComponent/Loader/PleaseWaitLoader";
import axios from "axios";
import SuccessModal from "@/app/UIComponent/Modals/SuccessModal";
import EmailOtpLoader from "./EmailOtpLoader";
import OTP from "./otpinput";
import {
  ApiPayload,
  ApiResponse,
} from "@/app/event_conference/bes_expo/exibition/participation_fee/types";
export default function Form({
  db,
  onClick,
  apiLink,
  currentPath,
  isBypassEmailValidation,
}: any) {
  const [visitorDb, setVisitorDb] = useState(db);
  const [showSuccessModal, setSuccessModal] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOtpSend, setIsOtpSend] = useState(false);
  const [isDisabledOtpSendBtn, setIsDisabledOtpSendBtn] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [otpInput, setOtpInput] = React.useState("");
  const handleChange = async (e: any, index: any) => {
    let value = e.target.value;
    if (isOtpSend && visitorDb[index].name === "email") return;
    if (visitorDb[index].fieldType === "number" && value) {
      let isValid = numberValidator(value);
      if (!isValid) return;
    }
    visitorDb[index].value = e.target.value;

    if (e.target.value && visitorDb[index]?.showError)
      visitorDb[index].showError = false;
    setVisitorDb([...visitorDb]);
  };
  const invalidEmailShowMessage = (item: any) => {
    item.showError = true;
    item.prevErrorMsg = item?.errorMsg;
    item.errorMsg = "Please Enter Valid email";
  };
  const handleValidate = async (e: any) => {
    setErrorMsg("");
    if (!isEmailVerified && !isBypassEmailValidation) {
      setErrorMsg("Please Verify the email");
      return;
    }
    let isValidate = true;
    for (let item of visitorDb) {
      let value = item?.value || "";
      value = value.trim();
      if (item?.required && !value) {
        isValidate = false;
        if (item.key == "email") {
          item.errorMsg = item.prevErrorMsg || item.errorMsg;
        }
        item.showError = true;
        break;
      } else if (item.key === "email") {
        isValidate = emailValidator(value);
        if (!isValidate) {
          invalidEmailShowMessage(item);
          break;
        }
      }
    }
    if (isValidate) {
      setSubmit(isValidate);
      if (apiLink) {
        try {
          let finalObj: ApiPayload = {};
          for (let item of visitorDb) finalObj[item?.key] = item?.value;
          let res: ApiResponse = await axios({
            method: "POST",
            url: apiLink,
            data: { ...finalObj, otp: otpInput },
          });
          setErrorMsg(res?.message || "Something went wrong");
          if (!res.status) {
            setSubmit(false);
          } else {
            setSuccessModal(true);
          }
        } catch (e: any) {
          console.log(e);

          setErrorMsg(e?.response?.data?.message || "Something went wrong");
          setSubmit(false);
        }
      }
      typeof onClick === "function" && onClick(visitorDb, e);
    } else {
      setVisitorDb([...visitorDb]);
    }
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
    } catch (e) {}
  };
  const handleSendEmailOtp = async () => {
    let isValidEmail = true;
    let value = "";
    for (let item of visitorDb) {
      if (item.key === "email") {
        value = item?.value?.trim();
        isValidEmail = emailValidator(value);
        if (!isValidEmail) {
          invalidEmailShowMessage(item);
        }
        break;
      }
    }
    if (isValidEmail) {
      setIsOtpSend(true);
      setIsDisabledOtpSendBtn(true);
      setCurrentEmail(value);
    } else {
      setVisitorDb([...visitorDb]);
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
      let result: ApiResponse = await axios({
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
    } catch (e: any) {
      setAlertMessage(e?.response?.data?.message || "Invalid Otp");
      console.log(e);
    }
    setIsDisabled(false);
  };
  useEffect(() => {
    if (isDisabledOtpSendBtn && !isEmailVerified && currentEmail) {
      sendEmailOtp(currentEmail);
    }
  }, [isDisabledOtpSendBtn, currentEmail]);
  return (
    <React.Fragment>
      {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
      {visitorDb.map((item: any, key: any) => (
        <React.Fragment key={key}>
          {
            <div className={styles.boxContainer}>
              <div>
                <label>{item?.name || ""}</label>
              </div>
              <div>
                {item?.type === "select" ? (
                  <FormControl fullWidth>
                    <Select
                      error={item?.showError}
                      fullWidth
                      disabled={submit}
                      value={item?.value || " "}
                      onChange={(e) => handleChange(e, key)}
                      name={item.key}
                    >
                      {item?.options?.map((sub_item: any, key: any) => (
                        <MenuItem key={key} value={sub_item.value}>
                          {sub_item?.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {item?.showError && (
                      <FormHelperText sx={{ color: "#d32f2f" }}>
                        {item?.errorMsg}
                      </FormHelperText>
                    )}
                  </FormControl>
                ) : item?.type === "textarea" ? (
                  <AutoSizeTextarea
                    value={item.value || ""}
                    index={key}
                    state={visitorDb}
                    dispatcher={setVisitorDb}
                    name={item.key}
                  />
                ) : (
                  <Box>
                    {item?.key === "email" ? (
                      <TextField
                        error={item?.showError}
                        fullWidth
                        disabled={submit || isEmailVerified || isOtpSend}
                        value={item?.value || ""}
                        onChange={(e) => handleChange(e, key)}
                        helperText={item?.showError ? item?.errorMsg : ""}
                        name={item.key}
                      />
                    ) : (
                      <TextField
                        error={item?.showError}
                        fullWidth
                        disabled={submit}
                        value={item?.value || ""}
                        onChange={(e) => handleChange(e, key)}
                        helperText={item?.showError ? item?.errorMsg : ""}
                        name={item.key}
                      />
                    )}
                    {item.key === "email" &&
                      !isEmailVerified &&
                      (isDisabledOtpSendBtn && !isEmailVerified ? (
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
                          <EmailOtpLoader
                            setIsOtpSend={setIsDisabledOtpSendBtn}
                          />
                        </Stack>
                      ) : isBypassEmailValidation ? null : (
                        <Button onClick={handleSendEmailOtp}>
                          {isOtpSend ? "Resend " : "Send "}Otp
                        </Button>
                      ))}
                  </Box>
                )}
              </div>
            </div>
          }
        </React.Fragment>
      ))}
      {submit ? (
        <PleaseWaitLoader />
      ) : (
        <div className={styles.btn_container}>
          <Button
            fullWidth
            onClick={handleValidate}
            variant="contained"
            className={styles.submit_btn}
            // disabled={isDisabled}
          >
            Submit
          </Button>
          {errorMsg && (
            <p
              style={{ color: submit ? "green" : "red" }}
              className="text-center"
            >
              {errorMsg}
            </p>
          )}
        </div>
      )}
      {showSuccessModal && <SuccessModal isOpen={true} />}
    </React.Fragment>
  );
}

const useStyles: { autoSizeTextarea: CSSProperties } = {
  autoSizeTextarea: {
    width: "100%",
    minWidth: "100px",
    minHeight: "150px",
    resize: "none",
    padding: "8px 12px",
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  },
};
const AutoSizeTextarea = ({ index, value, dispatcher, state, name }: any) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const handleTextareaChange = (event: any) => {
    state[index].value = event.target.value;
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    dispatcher([...state]);
  };
  return (
    <React.Fragment>
      <TextareaAutosize
        ref={textareaRef}
        style={useStyles.autoSizeTextarea}
        value={value}
        onChange={handleTextareaChange}
        name={name}
      />
    </React.Fragment>
  );
};
