"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  FormControlLabel,
  Select,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import OTP from "@/app/registrationform/Form/otpinput";
import EmailOtpLoader from "@/app/registrationform/Form/EmailOtpLoader";
import SuccessModal from "@/app/UIComponent/Modals/SuccessModal";
import { CountryDataApiReponse, SpaceType } from "./types";
import useSelectedSpacePrice from "@/app/frontend/hooks/useSelectedSpacePrice";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Original email validation regex from your earlier code:
type FormData = z.infer<ReturnType<typeof validateSchema>>;

export default function BookYourSpace({
  countryData,
  currentPath = "bookMySpace",
  spaceTypes,
}: {
  currentPath: string;
  countryData: string[];
  spaceTypes: SpaceType[];
}) {
  const [submit, setSubmit] = useState(false);
  const [showSuccessModal, setSuccessModal] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isDisabledOtpSendBtn, setIsDisabledOtpSendBtn] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isOtpSend, setIsOtpSend] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [selectedSpace, setSelectedSpace] = useState<SpaceType>(spaceTypes[0]);
  const alertBoxRef = useRef(null);

  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(
      validateSchema(
        spaceTypes.map((item) => item?.type),
        selectedSpace
      )
    ),
    mode: "onTouched",
  });

  const emailValue = watch("email");
  const currentSelectedSpace = watch("space_type");
  const areaRequired = watch("area_required");
  if (selectedSpace.type != currentSelectedSpace && currentSelectedSpace) {
    const newSpaceType =
      spaceTypes.filter(
        (spaceType) => spaceType.type === currentSelectedSpace
      )?.[0] || spaceTypes[0];
    setSelectedSpace(newSpaceType);
  }
  const isEnabled =
    isValid &&
    currentSelectedSpace &&
    areaRequired &&
    selectedSpace?.minimum_space_rquired <= areaRequired;
  const { calculatedBasePrice } = useSelectedSpacePrice({
    selectedSpace: currentSelectedSpace,
    totalArea: areaRequired,
    isEnabled: isEnabled,
    delay: 800,
  });
  // Disable editing email after OTP sent or verified
  const isEmailFieldDisabled = submit || isEmailVerified || isOtpSend;

  // Send OTP for email verification
  const sendEmailOtp = async (email: string) => {
    try {
      await axios.post(
        "/backend/api/verification/email_verification/send_otp",
        {
          email,
          from: currentPath,
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isDisabledOtpSendBtn && !isEmailVerified && currentEmail) {
      sendEmailOtp(currentEmail);
    }
  }, [isDisabledOtpSendBtn, currentEmail]);

  // Handle sending email OTP button click
  const handleSendEmailOtp = () => {
    clearErrors("email");

    if (!emailValue || !emailRegex.test(emailValue)) {
      setError("email", {
        type: "manual",
        message: "Please enter valid email",
      });
      return;
    }

    setIsOtpSend(true);
    setIsDisabledOtpSendBtn(true);
    setCurrentEmail(emailValue);
  };

  // Handle verifying OTP
  const handleEmailVerify = async () => {
    if (otpInput.length < 4) {
      setAlertMessage("Please Enter the otp");
      return;
    }
    setIsDisabled(true);
    setAlertMessage("");

    try {
      const result = await axios.post(
        "/backend/api/verification/email_verification/verify_otp",
        {
          email: currentEmail,
          otp: otpInput,
        }
      );

      if (result.data?.status) {
        setIsEmailVerified(true);
        setAlertMessage("");
      } else {
        setAlertMessage(result.data?.message || "Invalid Otp");
      }
    } catch (e: any) {
      setAlertMessage(e?.response?.data?.message || "Invalid Otp");
      console.error(e);
    }
    setIsDisabled(false);
  };

  // Form submit handler
  const onSubmit = async (formData: FormData) => {
    setAlertMessage("");
    if (!isEmailVerified) {
      setAlertMessage("Please Verify the email");
      if (alertBoxRef.current) {
        alertBoxRef.current.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setSubmit(true);
    //force build
    try {
      const res = await axios.post("/backend/api/registration/book_my_space", {
        ...formData,
        otp: otpInput,
      });

      setAlertMessage(res.data?.message || "Something went wrong");

      if (!res.data.status) {
        setSubmit(false);
      } else {
        setSuccessModal(true);
      }
    } catch (e: any) {
      setAlertMessage(e?.response?.data?.message || "Something went wrong");
      setSubmit(false);
    }
  };

  return (
    <div className="flex gap-4 flex-col bg-white p-6 rounded shadow-md max-w-3xl mx-auto">
      <h3 className="text-3xl text-center font-bold mb-4">Book your space</h3>
      <p className="text-lg font-semibold mb-8 text-center">
        Please submit your details in the form below and a member of from our
        team will get back to you.
      </p>

      {alertMessage && (
        <div ref={alertBoxRef}>
          <Alert severity="error">{alertMessage}</Alert>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-6"
      >
        {/* Name */}
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Full Name *"
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              variant="outlined"
            />
          )}
        />

        {/* Company */}
        <Controller
          name="company"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Company / Organisation Name *"
              error={!!errors.company}
              helperText={errors.company?.message}
              fullWidth
              variant="outlined"
            />
          )}
        />

        {/* Designation */}
        <Controller
          name="designation"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Designation"
              fullWidth
              variant="outlined"
            />
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Email *"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              variant="outlined"
              disabled={isEmailFieldDisabled}
            />
          )}
        />

        {/* Email OTP Section */}
        {!isEmailVerified && (
          <div className="flex flex-col gap-3">
            {isDisabledOtpSendBtn && !isEmailVerified ? (
              <Stack direction={"column"} alignItems={"center"} gap={1}>
                <Stack direction={"row"} gap={1} alignItems="center">
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
                    <Button color="error" onClick={handleEmailVerify}>
                      Verify Otp
                    </Button>
                  )}
                </Stack>
                <EmailOtpLoader setIsOtpSend={setIsDisabledOtpSendBtn} />
              </Stack>
            ) : (
              <Button
                onClick={handleSendEmailOtp}
                variant="outlined"
                sx={{ width: 200 }}
              >
                {isOtpSend ? "Resend " : "Send "}Otp
              </Button>
            )}
          </div>
        )}

        {/* Mobile */}
        <Controller
          name="mobile"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Mobile No. *"
              error={!!errors.mobile}
              helperText={errors.mobile?.message}
              fullWidth
              variant="outlined"
              onChange={(e) => {
                // Only allow digits
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  field.onChange(value);
                }
              }}
            />
          )}
        />

        {/* Postal Address */}
        <Controller
          name="postal_address"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Postal Address *"
              error={!!errors.postal_address}
              helperText={errors.postal_address?.message}
              fullWidth
              variant="outlined"
              multiline
              rows={3}
            />
          )}
        />

        {/* City */}
        <Controller
          name="city"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="City *"
              error={!!errors.city}
              helperText={errors.city?.message}
              fullWidth
              variant="outlined"
            />
          )}
        />

        {/* Country */}
        <Controller
          name="country"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={countryData}
              getOptionLabel={(option) => option}
              onChange={(_, value) => field.onChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country *"
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  fullWidth
                  variant="outlined"
                />
              )}
            />
          )}
        />

        {/* GST Number (Optional) */}
        <FormControl fullWidth error={!!errors.gst_number}>
          <Controller
            name="gst_number"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="GST Number (Optional)"
                fullWidth
                variant="outlined"
              />
            )}
          />
          <FormHelperText>{errors.gst_number?.message}</FormHelperText>
        </FormControl>
        {/* About Expo */}

        {/* Participant Type Radio Buttons */}
        <FormControl
          component="fieldset"
          error={!!errors.space_type}
          margin="normal"
        >
          <FormLabel component="legend">Space Type</FormLabel>
          <Controller
            name="space_type"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} row>
                {spaceTypes?.map((item) => {
                  return (
                    <FormControlLabel
                      value={item?.type}
                      control={<Radio />}
                      label={item?.name}
                    />
                  );
                })}
              </RadioGroup>
            )}
          />
          <FormHelperText>{errors.space_type?.message}</FormHelperText>
        </FormControl>
        {currentSelectedSpace && (
          <Stack gap={0}>
            <Controller
              name="area_required"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enter Area In Sqm"
                  error={!!errors.area_required}
                  helperText={errors.area_required?.message}
                  fullWidth
                  variant="outlined"
                  disabled={!currentSelectedSpace}
                  onChange={(e) => {
                    // Only allow digits
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      field.onChange(value);
                    }
                  }}
                />
              )}
            />
            <Typography component="p" fontSize={12}>
              In Sqm
            </Typography>
          </Stack>
        )}
        {!!isEnabled && !!calculatedBasePrice && (
          <Typography component="p" fontSize={14} color={"green"}>
            You have to Pay {calculatedBasePrice} excluding gst
          </Typography>
        )}
        <Controller
          name="about_expo"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.about_expo}>
              <Select {...field} displayEmpty>
                <MenuItem value="">Select an option</MenuItem>
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
              <FormHelperText>{errors.about_expo?.message}</FormHelperText>
            </FormControl>
          )}
        />
        {/* Submit button */}
        <Button
          variant="contained"
          type="submit"
          disabled={submit}
          sx={{ mt: 2 }}
        >
          {submit ? "Submitting..." : "Submit"}
        </Button>
      </form>

      {showSuccessModal && <SuccessModal isOpen={showSuccessModal} />}
    </div>
  );
}

const validateSchema = (space_type, selectedSpace: SpaceType) => {
  // Original mobile validation (numberValidator) simplified as digits only:
  const mobileRegex = /^[0-9]{10,15}$/;
  // Validation schema with participantType added
  const schema = z.object({
    name: z.string().min(1, "This Field is Required"),
    company: z.string().min(1, "This Field is Required"),
    designation: z.string().optional(),
    email: z
      .string()
      .min(1, "This Field is Required")
      .regex(emailRegex, "Please provide valid email"),
    mobile: z
      .string()
      .min(1, "This Field is Required")
      .regex(mobileRegex, "Please provide valid mobile"),
    city: z.string().min(1, "This Field is Required"),
    country: z.string().min(1, "This Field is Required"),
    about_expo: z.string().min(1, "This Field is Required"),

    gst_number: z
      .union([
        z.literal(""),
        z.string().length(15, "GST number must be exactly 15 characters"),
      ])
      .optional(),
    postal_address: z.string().min(1, "This Field is Required"),

    space_type: z
      .string({ required_error: "This Field is Required" })
      .min(1, "This Field is Required")
      .refine((val) => space_type.includes(val), {
        message: "Invalid space type selected",
      }),
    area_required: z.coerce
      .number({ invalid_type_error: "This field must be a number" })
      .min(
        selectedSpace.minimum_space_rquired,
        `Minimum area required is ${selectedSpace.minimum_space_rquired} sqm.`
      ),
  });

  return schema;
};
