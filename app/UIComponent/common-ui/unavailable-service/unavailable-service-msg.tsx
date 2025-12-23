import React from "react";

import styles from "@/app/registrationform/Form/form.module.css";
export default function UnavailableServiceMessage() {
  return (
    <div className="w-full  p-4 h-full">
      <div className={styles.container}>
        <h3 className="text-center text-red-600 font-semibold">
          This service is temporarily unavailable. Please try again later.
        </h3>
      </div>
    </div>
  );
}
