import jwt from "jsonwebtoken";
export const jwtGenerateToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

export const verifyJsonToken = (token) => {
  let isValid = false;
  try {
    let temp = jwt.verify(token, process.env.SECRET_KEY);
    isValid = temp;
  } catch (e) {
    console.log(e);
  }
  return isValid;
};

export const isValidPassword = (str) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).{8,}$/;
  return regex.test(str);
};
