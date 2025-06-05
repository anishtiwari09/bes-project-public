import React from "react";

import styles from "@/app/event_conference/bes_expo/Enquiry/styles.module.css";
export default function Enquiry() {
  return (
    <div>
      <p>
        <strong>ENQUIRY:</strong> For details regarding{" "}
        <strong>BES EXPO</strong>, please contact
      </p>
      <table className={"mt-4 " + styles.enquiry_table}>
        <thead>
          <tr>
            <th className="text-left ">For Conference:</th>
            <th className="text-left">For Exhibition:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-left pr-8">
              The Chairman Conference Committe <br />
              BES EXPO, 912 Surya Kiran Building
              <br />
              19 Kasturba Gandhi Marg, New Delhi-110001
              <br /> <strong>Tel:</strong> 91-11-23316709 <br />
              <strong> E-mail:</strong>{" "}
              <a href="mailto:conference@besindia.com">
                conference@besindia.com
              </a>
              , <a href="bes@besindia.com">bes@besindia.com</a>
            </td>
            <td>
              The Coordinator BES EXPO
              <br />
              <strong>E-mail:</strong>{" "}
              <a href="mailto:exhibition@besindia.com">
                exhibition@besindia.com
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
