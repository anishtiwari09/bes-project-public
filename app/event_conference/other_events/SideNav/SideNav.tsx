import db from "./db.json";
import SideNavMap from "./SideNavMap";
import styles from "@/app/about_bes/SideNav/side.module.css";

export default function SideNav() {
  return (
    <div
      className={"bg-[#faac1d] text-white p-4 sticky top-4 " + styles.sideNav}
    >
      <h3 className="font-bold text-[20px] text-black my-4">Other Events</h3>
      <SideNavMap db={db || []} parentPath={"/event_conference/other_events"} />
    </div>
  );
}
