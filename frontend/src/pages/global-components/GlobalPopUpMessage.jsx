import React, { useEffect } from "react";
import { CgCloseO } from "react-icons/cg";
import { BsCheck2Circle } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

import { useGlobalContext } from "../../../contextAPI/AuthContext";

const GlobalPopupMessage = () => {
  const { globalType, globalText, setGlobalDisplay, globalDisplay } =
    useGlobalContext();

  useEffect(() => {
    if (globalDisplay) {
      setTimeout(() => {
        setGlobalDisplay(false);
      }, [7000]);
    }
  }, [globalDisplay]);

  if (globalDisplay) {
    return (
      <div className="w-full flex items-center justify-center absolute z-50">
        <div className="h-auto w-auto fixed bottom-4 mx-auto p-4 bg-black rounded-full">
          <div className="w-full h-full flex flex-row justify-center items-center gap-x-3">
            {globalType ? (
              <BsCheck2Circle size={20} color="#019881" />
            ) : (
              <CgCloseO size={20} color="#EE2E31" />
            )}

            <p className="text-white font-semibold text-[16px]">{globalText}</p>
            <IoMdClose
              className="cursor-pointer"
              color="#FFF"
              size={20}
              onClick={() => setGlobalDisplay(false)}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default GlobalPopupMessage;
