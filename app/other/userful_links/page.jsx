import React from "react";
import styles from "@/app/about_bes/content.module.css";
export default function page() {
  return (
    <div
      className={"flex flex-col max-w-[800px] p-4 " + styles.content_container}
      style={{ margin: "0 auto" }}
    >
      <h2 className="text-[26px] font-bold">Use Ful Links</h2>

      <div>
        <p>
        <strong> WAVES</strong>
          <br />{" "}
          <a href="wavesindia.org" target="_blank">
          wavesindia.org
          </a>
          <br />
          <strong> Ministry of Information & Broadcasting</strong>
          <br />{" "}
          <a href="mib.nic.in" target="_blank">
            mib.nic.in
          </a>
          <br />
          <strong>Prasar Bharati</strong>
          <br />
          <a href="//prasarbharati.gov.in" target="_blank">
            prasarbharati.gov.in
          </a>
          <br />
          <strong> All India Radio</strong>
          <br />{" "}
          <a href="allindiaradio.gov.in" target="_blank">
            allindiaradio.gov.in
          </a>
          <br />
          <strong> Doordarshan</strong>
          <br />
          <a href="www.ddindia.gov.in" target="_blank">
            www.ddindia.gov.in
          </a>
          <br />
          <strong>Digital Radio Mondiale</strong>
          <br />
          <a href="www.drm.org" target="_blank">
            www.drm.org
          </a>
          <br /> <strong>Asia-Pacific Broadcasting Union (ABU)</strong>
          <br />
          <a href="www.abu.org.my" target="_blank">
            {" "}
            www.abu.org.my
          </a>
          <br />
          <strong>
            International Association of Broadcasting Manufacturers (IABM)
          </strong>
          <br />
          <a href="www.theiabm.org">www.theiabm.org</a>
          <br /> <strong>Society of Broadcast Engineers</strong>
          <br />
          <a href="www.sbe.org">www.sbe.org</a>
        </p>
      </div>
    </div>
  );
}
