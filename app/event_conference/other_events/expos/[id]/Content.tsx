"use client";
import styles from "@/app/about_bes/content.module.css";
import parse from "html-react-parser";
export default function Content({
  db,
  council_data
}: any) {
  return (
    <div
      className={
        "flex flex-col max-w-[800px] m-auto p-4 " + styles.content_container
      }
    >
      <h2 className="text-[26px] font-bold">BES EXPO {council_data}</h2>

      <div className="mt-[20px]">{parse(db)}</div>
    </div>
  );
}
