import React from "react";

import FeeDetails from "./FeeDetails";
import BookYourSpace from "./BookYourSpace";
import { CountryDataApiReponse } from "./types";
export default async function page() {
  let countryData:string[] = [];
  try {
    let data:Response = await fetch("https://restcountries.com/v3.1/all");
    const responseData:CountryDataApiReponse[] = await data.json();
    responseData?.forEach((element:CountryDataApiReponse) => {
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
