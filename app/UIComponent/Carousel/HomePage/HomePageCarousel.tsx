"use client";
import Image from "next/image";
import React from "react";
import Carousel from "react-material-ui-carousel";
import { ReactSVG } from "react-svg";
export default function HomePageCarousel({
  data,
  url,
  path1
}: any) {
  return (
    <div>
      <Carousel
        autoPlay={true}
        animation={"slide"}
        indicators={false}
        key={data.id}
        stopAutoPlayOnHover={true}
        interval={5000}
      >
        {data?.map((item: any, key: any) => (
          <div className="w-full cursor-pointer" key={item?.key}>
            {item?.includes(".svg") ? (
              <ReactSVG src={`${url}/${item}`} />
            ) : (
              <img
                src={`${url}/${item}`}
                className="w-full min-w-full object-contain"
              />
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
}
