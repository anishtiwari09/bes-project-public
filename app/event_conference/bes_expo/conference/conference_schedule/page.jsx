import React from "react";
import styles from "@/app/about_bes/content.module.css";
export default function page() {
  return (
    <div
      className={"flex flex-col max-w-[800px] p-4 " + styles.content_container}
    >
      <h2 className="text-[26px] font-bold">Conference Schedule</h2>
      <div>
        <p>
          A 3–day conference on the theme{" "}
          <strong>
            Transforming the Media Landscape through AI:Create, Collaborate,
            Monetize
          </strong>{" "}
          will be held from <strong>3-5 July 2025</strong> in{" "}
          <strong> Hall No 8,9 & 10 at Pragati Maidan, New Delhi </strong>{" "}
          concurrently with the exhibition. Delegates attending the conference
          invariably visit the exhibition. Besides keynote addresses, the
          conference will have presentations on current and future broadcast
          technologies in Radio and TV broadcasting. Exhibitors desirous of
          speaking in the conference may write to Chairman Conference Committee.
          <br />
          <br />
          Conference fee for Indian and foreign delegates is as shown in the
          table below. Fee is inclusive of conference proceedings, lunch,
          refreshments and delegate kit. BES Life Fellows/ Life Members/ Life
          Corporate Members/ Affiliates/ PSUs/ Associate Members / Student
          Members and Government sponsored delegates can avail 50% concession in
          fee.
          <br />
          <br />
          The conference is by far a best-seller and will be of interest to
          professionals in the broadcast industry. Companies interested in
          participating in the conference or presenting a paper may write to The
          Chairman Conference Committee as soon as possible.
        </p>
      </div>
    </div>
  );
}
