import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Axios from "axios";

import { useGlobalContext } from "../../../contextAPI/AuthContext";

const Mailing = () => {
  const {
    accountInfo,
    setGlobalType,
    setGlobalText,
    setGlobalDisplay,
    setAccountInfo,
  } = useGlobalContext();
  const { mailingAddress, zipCode, province, city, id } = accountInfo;

  const API_URL = import.meta.env.VITE_APP_API_URL;

  const [address, setAddress] = useState(mailingAddress);
  const [zip, setZip] = useState(zipCode);
  const [prov, setProv] = useState(province);
  const [userCity, setCity] = useState(city);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = API_URL + "/complete-profile";
    const body = {
      userID: id,
      mailingAddress: address,
      zipCode: zip,
      province: prov,
      city: userCity,
    };

    await Axios.post(url, body)
      .then(async (response) => {
        if (response.data.successMessage) {
          await Axios.get(`${API_URL}/sign-in`)
            .then((response) => {
              if (response.data.user) {
                setAccountInfo(response.data.user);
              } else {
                // console.log(response.data);
                navigate("/");
              }
            })
            .catch(() => navigate("/"));

          setGlobalType(true);
          setGlobalText(response.data.successMessage);
        } else if (response.data.errMessage) {
          setGlobalType(false);
          setGlobalText(response.data.errMessage);
        }
        setGlobalDisplay(true);
      })
      .catch((err) => {
        console.log(err);
        setGlobalType(false);
        setGlobalText("An error has occurred, please try again.");
        setGlobalDisplay(true);
      });
  };

  return (
    <section className="w-full h-screen bg-lighterGray">
      <section className="w-full h-[100px] mb-6 lg:mb-0">
        <div className="flex flex-row items-center justify-between w-full h-full px-5 lg:px-10">
          <Link to={"/dashboard"} className="h-[50px] text-[30px] font-bold">
            Online Library
          </Link>

          <span className="lg:flex flex-row items-center gap-x-2 text-gray hidden">
            <Link
              className="border-b-[0.1px] border-lighGray"
              to={"/dashboard"}
            >
              Back to dashboard
            </Link>
          </span>
        </div>
      </section>

      <div className="h-auto py-12 px-8 lg:w-[50%] flex flex-col justify-center items-center mx-auto gap-y-6 bg-white rounded-md mt-12">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-y-2 w-full"
        >
          <div className="w-full flex-1 flex flex-row items-start justify-center gap-x-8">
            <div className="w-[300px] h-auto flex flex-col items-start justify-start">
              <label
                htmlFor="companyMailb"
                className="w-full font-semibold text-[14px]"
              >
                Mailing Address
              </label>
              <input
                required
                onChange={(e) => setAddress(e.target.value)}
                id="companyMail"
                defaultValue={mailingAddress}
                type="text"
                className="w-full h-[50px] border border-lightestGray pl-4 rounded-md focus:outline-none focus:border-green transition duration-300 mb-2 bg-lightBlue"
              />
            </div>

            <div className="w-[300px] h-auto flex flex-col items-start justify-start">
              <label
                htmlFor="password"
                className="w-full font-semibold text-[14px]"
              >
                Zip Code
              </label>
              <input
                required
                id="password"
                defaultValue={zipCode}
                onChange={(e) => setZip(e.target.value)}
                type="text"
                className="w-full h-[50px] border border-lightestGray pl-4 rounded-md focus:outline-none focus:border-green transition duration-300 mb-1 bg-lightBlue"
              />
            </div>
          </div>
          <div className="w-full flex-1 flex flex-row items-start justify-center gap-x-8">
            <div className="w-[300px] h-auto flex flex-col items-start justify-start">
              <label
                htmlFor="companyMailb"
                className="w-full font-semibold text-[14px]"
              >
                Province
              </label>
              <input
                required
                onChange={(e) => setProv(e.target.value)}
                id="companyMail"
                defaultValue={province}
                type="text"
                className="w-full h-[50px] border border-lightestGray pl-4 rounded-md focus:outline-none focus:border-green transition duration-300 mb-2 bg-lightBlue"
              />
            </div>
            <div className="w-[300px] h-auto flex flex-col items-start justify-start">
              <label
                htmlFor="password"
                className="w-full font-semibold text-[14px]"
              >
                City
              </label>
              <input
                id="password"
                onChange={(e) => setCity(e.target.value)}
                type="text"
                defaultValue={city}
                className="w-full h-[50px] border border-lightestGray pl-4 rounded-md focus:outline-none focus:border-green transition duration-300 mb-1 bg-lightBlue"
              />
            </div>
          </div>
          <button
            onSubmit={handleSubmit}
            type="submit"
            className="w-auto px-3 h-[50px] flex justify-center items-center text-white text-[15px] font-medium bg-green hover:bg-darkGreen transition duration-300 rounded-md mt-3"
          >
            Complete my profile
          </button>
        </form>
      </div>
    </section>
  );
};

export default Mailing;
