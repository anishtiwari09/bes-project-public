import Link from "next/link";
import footerData from "./Utility/footerdb.json";
import React from "react";
import { handleGetDynamicLink } from "@/app/Utility/helper/helper";
import  { Toaster } from "react-hot-toast";
export default function Footer({ initialCount = 0 }) {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          // Define default options
          className: "",
          duration: 50000000,
          style: {
            background: "transparent",
            boxShadow: "initial",
          },
          // Default options for specific types
          success: {
            duration: 5000000,
            
          },
        }}
      />
      <div className="bg-black opacity-80 py-4">
        <div className="w-[96%] m-auto">
          <h3 className="text-[#adff2f] text-lg min-w-[150px] text-center">
            Total Visitors: {initialCount}
          </h3>
          {footerData.map((item, key) => (
            <React.Fragment key={item.id}>
              <div className="flex gap-4 mt-2">
                <h3 className="text-white min-w-[150px] text-left">
                  {item.name}:{" "}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {item.subTopic.map((sub_item, sub_key) => {
                    let newPath = handleGetDynamicLink(sub_item.id);
                    sub_item.path = newPath ? `/${newPath}` : sub_item.path;
                    return (
                      <div key={sub_item.id} className="text-white">
                        {sub_item?.path ? (
                          sub_item?.normalLink ? (
                            <a
                              target={sub_item?.target ?? "_self"}
                              href={sub_item?.path}
                            >
                              {sub_item.name}
                            </a>
                          ) : (
                            <Link
                              target={sub_item.target ?? "_self"}
                              href={sub_item?.path}
                            >
                              {sub_item.name}
                            </Link>
                          )
                        ) : (
                          sub_item.name
                        )}
                        {sub_key + 1 < item.subTopic.length ? " | " : ""}
                      </div>
                    );
                  })}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
