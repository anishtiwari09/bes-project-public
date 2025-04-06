import React from "react";
export default function Partener() {
  return (
    <div
    className="bg-[#f2f2f2]"
    style={{
      padding: "32px 10%",
    }}
  >
    <h1 className="text-center text-[24px] font-bold mb-8 mt-8">
      Approved & Supported By
    </h1>
    <div className="flex gap-8 flex-wrap justify-center partner_container">
      <div className="supporeted_partner">
        <a href="https://www.meity.gov.in/" target="_blank">
          <img src="/Images/homepage/meity.jpg" alt="MeitY" />
        </a>
      </div>
      <div>
        <a href="https://prasarbharati.gov.in/doordarshan/" target="_blank">
          <img src="/Images/homepage/doordarshan.png" alt="Doordarshan" />
        </a>
      </div>
  
      <div>
        <a href="https://www.abu.org.my/" target="_blank">
          <img src="/Images/homepage/abu_1.jpg" alt="ABU" />
        </a>
      </div>
      <div>
        <a href="http://www.aesindia.org" target="_blank">
          <img src="/Images/homepage/aes.png" alt="AES" />
        </a>
      </div>
      <div>
        <a href="" target="_blank">
          <img src="/Images/homepage/aimbda.jpg" alt="AIMBDA" />
        </a>
      </div>
    </div>
    <h1 className="text-center text-[24px] font-bold mb-8 mt-8">
      Media Partners
    </h1>
    <div className="flex gap-8 flex-wrap justify-center partner_container">
      <div>
        <a href="https://www.broadcastandcablesat.co.in" target="_blank">
          <img src="/Images/expo2020/Media1.jpg" alt="Media 1" />
        </a>
      </div>
      <div>
        <a href="http://www.cinematographyart.org" target="_blank">
          <img src="/Images/expo2020/Media2.jpg" alt="Media 2" />
        </a>
      </div>
    </div>
  </div>
  
  );
}
