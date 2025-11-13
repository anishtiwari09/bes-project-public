import { checkUserLoginStatus } from "@/app/frontend/actions/login";
import React, { useEffect, useState } from "react";
import { AuthContextReturn, IUserData } from "./types";

const AuthContext = React.createContext<AuthContextReturn>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState<IUserData | null>(null);
  const updateUserState = (userData: IUserData) => {
    if (userData) {
      let firstName = userData?.firstName || "";
      let lastName = userData?.lastName || "";
      let name = "";
      if (!firstName && !lastName) {
        name = userData?.email?.split("@")[0];
      } else {
        name = firstName + " " + lastName;
      }
      let newUserData = {
        ...userData,
        name: name,
      };
      setUserData(newUserData);
      return;
    }

    setUserData(userData);
  };
  useEffect(() => {
    if (true) {
      checkUserLoginStatus()
        .then((res) => {
          updateUserState(res?.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userData, setUserData: updateUserState }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
