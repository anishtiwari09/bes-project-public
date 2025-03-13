import React from "react";

import FeeDetails from "./FeeDetails";
import BookYourSpace from "./BookYourSpace";
export default async function page() {
  let countryData = [];
  try {
    let data = await fetch("https://restcountries.com/v3.1/all");
    data = await data.json();

    data.forEach((element) => {
      if (element?.name?.common) countryData.push(element?.name?.common);
    });
    countryData.sort();
  } catch (e) {
    console.log("error");
  }
  return (
    <div>
      <BookYourSpace countryData={countryData} />
      <FeeDetails />
    </div>
  );
}
