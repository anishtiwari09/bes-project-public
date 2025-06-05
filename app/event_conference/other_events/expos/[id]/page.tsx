import React from "react";
import Content from "./Content";

export default function page({
  params: { id }
}: any) {
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
          ".custom.html"
      )
    );
    data = data.toString();
  } catch (e) {
    console.log(e);
  }

  return (
    <div>{data ? <Content db={data} council_data={id} /> : "Invalid Url"}</div>
  );
}
