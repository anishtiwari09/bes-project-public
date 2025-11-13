import { fetchApiHub } from "..";

export const checkUserLoginStatus = () => {
  return fetchApiHub("/backend/api/auth/loginCheck/validateToken", "POST");
};
