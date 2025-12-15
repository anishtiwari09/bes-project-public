import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
export default function OTP({
  separator,
  length,
  value,
  onChange,
  isDisabled,
}: any) {
  const inputRefs = React.useRef(new Array(length).fill(null));

  const focusInput = (targetIndex: any) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput.focus();
  };

  const selectInput = (targetIndex: any) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput.select();
  };

  const handleKeyDown = (event: any, currentIndex: any) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
      case " ":
        event.preventDefault();
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (currentIndex < length - 1) {
          focusInput(currentIndex + 1);
          selectInput(currentIndex + 1);
        }
        break;
      case "Delete":
        event.preventDefault();
        onChange((prevOtp: any) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });

        break;
      case "Backspace":
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }

        onChange((prevOtp: any) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });
        break;

      default:
        break;
    }
  };

  const handleChange = (event: any, currentIndex: any) => {
    const currentValue = event.target.value;
    let indexToEnter = 0;

    while (indexToEnter <= currentIndex) {
      if (
        inputRefs.current[indexToEnter].value &&
        indexToEnter < currentIndex
      ) {
        indexToEnter += 1;
      } else {
        break;
      }
    }
    onChange((prev: any) => {
      const otpArray = prev.split("");
      const lastValue = currentValue[currentValue.length - 1];
      otpArray[indexToEnter] = lastValue;
      return otpArray.join("");
    });
    if (currentValue !== "") {
      if (currentIndex < length - 1) {
        focusInput(currentIndex + 1);
      }
    }
  };

  const handleClick = (event: any, currentIndex: any) => {
    selectInput(currentIndex);
  };

  const handlePaste = (event: any, currentIndex: any) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;

    // Check if there is text data in the clipboard
    if (clipboardData.types.includes("text/plain")) {
      let pastedText = clipboardData.getData("text/plain");
      pastedText = pastedText.substring(0, length).trim();
      let indexToEnter = 0;

      while (indexToEnter <= currentIndex) {
        if (
          inputRefs.current[indexToEnter].value &&
          indexToEnter < currentIndex
        ) {
          indexToEnter += 1;
        } else {
          break;
        }
      }

      const otpArray = value.split("");

      for (let i = indexToEnter; i < length; i += 1) {
        const lastValue = pastedText[i - indexToEnter] ?? " ";
        otpArray[i] = lastValue;
      }

      onChange(otpArray.join(""));
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {new Array(length).fill(null).map((_, index) => (
        <React.Fragment key={index}>
          <TextField
            inputRef={(ele) => {
              inputRefs.current[index] = ele;
            }}
            aria-label={`Digit ${index + 1} of OTP`}
            disabled={isDisabled}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onChange={(event) => handleChange(event, index)}
            onClick={(event) => handleClick(event, index)}
            onPaste={(event) => handlePaste(event, index)}
            value={value[index] ?? ""}
            variant="outlined"
            size="small"
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: "center",
                width: "40px",
                height: "40px",
                padding: "8px",
              },
            }}
            sx={{
              width: "56px",
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#3399FF",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3399FF",
                  boxShadow: "0 0 0 3px rgba(51, 153, 255, 0.2)",
                },
              },
            }}
          />
          {index === length - 1 ? null : separator}
        </React.Fragment>
      ))}
    </Box>
  );
}

OTP.propTypes = {
  length: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  separator: PropTypes.node,
  value: PropTypes.string.isRequired,
};
