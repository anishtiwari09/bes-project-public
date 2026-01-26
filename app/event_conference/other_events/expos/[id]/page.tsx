import React from "react";
import Content from "./Content";
import { redirect } from "next/navigation";

export default function page({ params: { id } }: any) {
  let data = null;
  const pathname = "";
  const fs = require("fs");
  const path = require("path");
  try {
    data = fs.readFileSync(
      path.join(
        process.cwd(),
        "app/event_conference/other_events/expos/CouncilDB" +
          "/" +
          id +
          ".custom.html",
      ),
    );
    data = data.toString();
  } catch (e) {
    console.log(e);
  }
  if (!data) {
    return redirect("/not-found");
  }

  return (
    <div>{data ? <Content db={data} council_data={id} /> : "Invalid Url"}</div>
  );
}
