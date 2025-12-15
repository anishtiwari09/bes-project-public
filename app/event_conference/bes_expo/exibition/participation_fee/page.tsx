import React from "react";

import FeeDetails from "./FeeDetails";
import BookYourSpace from "./BookYourSpace";
import { CountryDataApiReponse } from "./types";

import SpaceTypeScheme from "@/app/backend/models/space_type_scheme";
import mongoConnection from "@/app/backend/lib/db/db-config";
export const revalidate = 14400; // 4 hours in seconds (4 * 60 * 60)
export default async function page() {
  let countryData: string[] = [];
  let spaceTypesData = [];
  try {
    await mongoConnection.connect();
    let data: Response = await fetch("https://restcountries.com/v3.1/all");

    const responseData: CountryDataApiReponse[] = await data.json();
    responseData?.forEach((element: CountryDataApiReponse) => {
      if (element?.name?.common) countryData.push(element?.name?.common);
    });
    countryData.sort();
  } catch (e) {
    console.log("error");
  }
  try {
    spaceTypesData = await SpaceTypeScheme.find(
      { is_active: true },
      { type: 1, _id: 0, name: 1, description: 1, minimum_space_rquired: 1 }
    ).lean();
  } catch (e) {
    console.log("error while fetch space");
  }

  return (
    <div>
      <BookYourSpace
        countryData={countryData}
        spaceTypes={spaceTypesData}
        currentPath="bookMySpace"
      />
      <FeeDetails />
    </div>
  );
}
