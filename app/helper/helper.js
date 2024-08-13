import jwt from "jsonwebtoken";
export const jwtGenerateToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

export const verifyJsonToken = () => {};
