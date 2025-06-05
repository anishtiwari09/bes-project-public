import React from "react";
import styles from "@/app/about_bes/content.module.css";
import Image from "next/image";
export default function page() {
  return (
    <div
      className={"flex flex-col max-w-[800px] p-4 " + styles.content_container}
    >
      <h2 className="text-[26px] font-bold">Floor Plan</h2>

      <div>
        <p>
          <strong>BES EXPO 2025  </strong>is being organized at Pragati Maidan,
          New Delhi.
        </p>
      </div>
      
      <div style={{ position: 'relative', width: '100%',height:500 }}>
  <Image
    src="/Images/common/floor-plan.jpg"
    alt="Sample"
fill
style={{ objectFit: 'contain' }} 
  />
</div>



    </div>
  );
}
