import React from "react";
import Content from "../../Content";
export default function page({
  params: { id }
}: any) {
  let data = null;
  const fs = require("fs");
  const path = require("path");
  try {
    data = fs.readFileSync(
      path.join(
        process.cwd(),
        "app/event_conference/other_events/seminars/view_details/htmlsdb" +
          "/" +
          id +
          ".custom.html"
      )
    );
    data = data.toString();
  } catch (e) {
    data = null;
    console.log(e);
  }

  return (
    <div>{data ? <Content db={data} council_data={""} /> : "Invalid Url"}</div>
  );
}
