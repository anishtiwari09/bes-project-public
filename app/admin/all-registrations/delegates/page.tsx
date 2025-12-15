import AdminServices from "@/app/backend/lib/services/admin-services";
import React from "react";
import AllRegistrations from "./ui/all-registrations";
async function getCookieData() {
  const admin = new AdminServices();
  return new Promise(async (resolve) => {
    try {
      const db = await admin.getAllDelegateUsers();
      resolve(db);
    } catch (e) {
      console.log("error while fetching cookies", e?.message);
      resolve(null);
    }
  });
}
export default async function page() {
  const db = await getCookieData();
  return <AllRegistrations db={(db || []) as any} />;
}
