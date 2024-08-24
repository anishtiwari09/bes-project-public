import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export const jwtGenerateToken = (user) => {
  return jwt.sign({ user }, process.env.SECRET_KEY, {
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

export const decodeJsonToken = (token) => {
  let verifiedToken = "";
  try {
    let obj = jwt.decode(token);
    verifiedToken = obj?.user?.verifiedToken || "";
  } catch (e) {
    console.log("invalid token");
  }
  if (!verifiedToken) {
    return null;
  }
  return verifiedToken;
};

export const isValidPassword = (str) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).{8,}$/;
  return regex.test(str);
};

export const generateBcryptPassword = async (original, salt = 4) => {
  return bcrypt.hash(original, salt);
};

export const compareHashPassword = async (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
};

export const isPureString = (string) => {
  let regex = /^[a-zA-Z\s]+$/;

  return regex.test(string);
};
