import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CgCloseO } from "react-icons/cg";
import { BsCheck2Circle } from "react-icons/bs";

import Axios from "axios";

import GoogleIcon from "../../assets/google_icon.png";
import { Nav } from "./components";

import { useGlobalContext } from "../../../contextAPI/AuthContext";

const SignUp = () => {
  const { setGlobalType, setGlobalText, setGlobalDisplay } = useGlobalContext();

  const navigate = useNavigate();

  const [activePassword, setActivePassword] = useState(false);

  const [threeFullfilled, setThreeFullfilled] = useState(false);
  const [identicalCharInRow, setIDenticalCharInRow] = useState(true);
  const [containsLower, setContainsLower] = useState(false);
  const [containsUpper, setContainsUpper] = useState(false);
  const [containsNumber, setContainsNumber] = useState(false);
  const [containsSpecChar, setContainsSpecChar] = useState(false);

  const [email, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [nextStep, setNextStep] = useState(false);

  const [message, setMessage] = useState("");
  const [errMessage, setErrMessage] = useState();
  const [color, setColor] = useState("#000");

  const signUp = {
    text: "Already have an account?",
    link: {
      name: "Sign in.",
      href: "/",
    },
  };

  const API_URL = import.meta.env.VITE_APP_API_URL;
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

  const testEmailInDB = async (url, body) => {
    let message = "";

    await Axios.post(url, body).then((res) => {
      if (res.data.message) {
        message = res.data.message;
      } else if (res.data.errorMessage) {
        message = "Please enter an email";
      }
    });

    return message;
  };

  const handleContinue = async (event) => {
    event.preventDefault();

    let url = API_URL + "/verify-email";

    const emailRegex = new RegExp(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    );

    if (emailRegex.test(email)) {
      let response = await testEmailInDB(url, { email: email });

      if (response) {
        setMessage(response);
        setColor("#FF0000");
      } else {
        setNextStep(true);
        setColor("#000");
      }
    } else {
      setMessage("Please enter a valid email");
      setColor("#FF0000");
    }
  };

  const register = async (event) => {
    event.preventDefault();

    setColor("#000");

    if (threeFullfilled && identicalCharInRow && firstName && lastName) {
      let url = API_URL + "/sign-up";

      let registerInfo = {
        email: email,
        password: passwordReg,
        firstName: firstName,
        lastName: lastName,
      };

      await Axios.post(url, registerInfo)
        .then((response) => {
          if (response.data.successMessage) {
            setGlobalType(true);
            setGlobalText(response.data.successMessage);

            navigate("/");
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
    } else {
      if (!firstName || !lastName) {
        setGlobalDisplay(true);
        setGlobalType(false);
        setGlobalText("All fields are required to be filled in.");
      } else {
        setErrMessage("Please make sure password fulfills requirements");
        setColor("#FF0000");
      }
    }
  };

  async function handleCredentialResponse(response) {
    let access_token = response.access_token;

    const body = {
      access_token: access_token,
    };

    Axios.defaults.withCredentials = true;

    await Axios.post(API_URL + "/sign-up", body)
      .then((response) => {
        if (response.data.successMessage) {
          setGlobalType(true);
          setGlobalText(response.data.successMessage);

          navigate("/");
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
  }

  const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    callback: handleCredentialResponse,
  });

  const googleAuthSignup = () => {
    tokenClient.requestAccessToken();
  };

  useEffect(() => {
    if (
      (containsLower && containsUpper && containsNumber) ||
      (containsLower && containsUpper && containsSpecChar) ||
      (containsLower && containsNumber && containsSpecChar) ||
      (containsUpper && containsNumber && containsSpecChar)
    )
      setThreeFullfilled(true);
    else setThreeFullfilled(false);
  }, [containsLower]);

  useEffect(() => {
    if (
      (containsLower && containsUpper && containsNumber) ||
      (containsLower && containsUpper && containsSpecChar) ||
      (containsLower && containsNumber && containsSpecChar) ||
      (containsUpper && containsNumber && containsSpecChar)
    ) {
      setThreeFullfilled(true);
    } else {
      setThreeFullfilled(false);
    }
  }, [containsUpper]);

  useEffect(() => {
    if (
      (containsLower && containsUpper && containsNumber) ||
      (containsLower && containsUpper && containsSpecChar) ||
      (containsLower && containsNumber && containsSpecChar) ||
      (containsUpper && containsNumber && containsSpecChar)
    ) {
      setThreeFullfilled(true);
    } else {
      setThreeFullfilled(false);
    }
  }, [containsNumber]);

  useEffect(() => {
    if (
      (containsLower && containsUpper && containsNumber) ||
      (containsLower && containsUpper && containsSpecChar) ||
      (containsLower && containsNumber && containsSpecChar) ||
      (containsUpper && containsNumber && containsSpecChar)
    ) {
      setThreeFullfilled(true);
    } else {
      setThreeFullfilled(false);
    }
  }, [containsSpecChar]);

  return (
    <section
      onClick={() => {
        if (activePassword) setActivePassword(false);
      }}
      className="w-full h-screen bg-lighterGray"
    >
      <div className="w-full h-full">
        {/* Register */}
        <Nav items={signUp} />
        <div className="flex flex-col justify-center items-center w-full gap-y-9">
          <div className="flex flex-col items-center w-full">
            <h3 className="text-[26px] font-semibold">
              Welcome to the Online Library
            </h3>
            <p className="text-[19px] text-gray font-medium hidden lg:inline">
              Create an account
            </p>
          </div>
          <div className="w-full h-auto flex justify-center items-center">
            <div className="h-auto w-[80%] lg:w-[52%] bg-white rounded-md border border-lighGray py-12 px-5 lg:px-0">
              {nextStep ? (
                <form className="h-full fade-in w-full lg:w-[60%] flex flex-col justify-center items-center mx-auto gap-y-4">
                  <div className="flex flex-col lg:flex-row justify-center items-center w-full gap-y-4 lg:gap-x-8">
                    <div className="lg:w-[50%] w-full flex flex-col items-start gap-y-1">
                      <label
                        htmlFor="first"
                        className="font-semibold text-[14px]"
                      >
                        First name
                      </label>
                      <input
                        required={true}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                        }}
                        id="first"
                        type="text"
                        placeholder={"First name"}
                        className="w-full border border-grey focus:outline-none focus:border-green transition duration-300 h-[50px] pl-4 rounded-md"
                      />
                    </div>
                    <div className="lg:w-[50%] w-full flex flex-col items-start gap-y-1">
                      <label
                        htmlFor="last"
                        className="font-semibold text-[14px]"
                      >
                        Last name
                      </label>
                      <input
                        required={true}
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                        id="last"
                        type="text"
                        placeholder={"Last name"}
                        className="w-full border border-grey focus:outline-none focus:border-green transition duration-300 h-[50px] pl-4 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col justify-center gap-y-5">
                    <div className="w-full flex flex-col items-start gap-y-1">
                      <label
                        htmlFor="password"
                        style={{ color: `${color}` }}
                        className={`w-full font-semibold text-[14px]`}
                      >
                        {errMessage ? errMessage : "Password"}
                      </label>
                      <input
                        onClick={() => {
                          setActivePassword(true);
                        }}
                        onChange={(e) => {
                          const checkLower = new RegExp(".*[a-z].*");
                          const checkUpper = new RegExp(".*[A-Z].*");
                          const checkNum = new RegExp(".*\\d.*");
                          const checkSpecChar = new RegExp(".*\\W");
                          const checkIDenticalChar = new RegExp(
                            "([a-zA-Z0-9])\\1"
                          );
                          // console.log(e.target.value);

                          if (e.target.value.match(checkLower)) {
                            setContainsLower(true);
                          } else {
                            setContainsLower(false);
                          }

                          if (e.target.value.match(checkUpper))
                            setContainsUpper(true);
                          else setContainsUpper(false);

                          if (e.target.value.match(checkNum))
                            setContainsNumber(true);
                          else setContainsNumber(false);

                          if (e.target.value.match(checkSpecChar))
                            setContainsSpecChar(true);
                          else setContainsSpecChar(false);

                          if (e.target.value.match(checkIDenticalChar))
                            setIDenticalCharInRow(false);
                          else setIDenticalCharInRow(true);

                          setPasswordReg(e.target.value);
                        }}
                        id="password"
                        type="password"
                        placeholder={"Enter a secured password..."}
                        className="w-full border border-grey focus:outline-none focus:border-green transition duration-300 h-[50px] pl-4 rounded-md"
                      />
                    </div>
                    <div
                      className={`hidden flex-row justify-start items-center absolute lg:left-5 xl:left-[11rem] top-[18rem] ${
                        activePassword ? "lg:flex" : "hidden"
                      }`}
                    >
                      <div className="w-[325px] h-auto bg-lighterGray rounded-md shadow-2xl">
                        <div className="w-full h-full flex flex-col p-6">
                          <p className="font-semibold text-[13px] mb-3">
                            Your password must contain:
                          </p>

                          <ul className="w-full h-auto flex-col justify-start items-start">
                            <li className="flex flex-row items-center gap-x-2 mb-3">
                              {threeFullfilled ? (
                                <BsCheck2Circle color="#019881" />
                              ) : (
                                <CgCloseO color="#EE2E31" />
                              )}
                              <p className="text-darkerGray font-medium text-[12px]">
                                At least 3 of the following:
                              </p>
                            </li>
                            <ul className="flex flex-col justify-start items-start pl-5 gap-y-1 mb-3">
                              <li className="flex flex-row items-center gap-x-2">
                                {containsLower ? (
                                  <BsCheck2Circle color="#019881" />
                                ) : (
                                  <CgCloseO color="#EE2E31" />
                                )}
                                <p className="text-darkerGray font-medium text-[12px]">
                                  Lowercase letters (a-z)
                                </p>
                              </li>
                              <li className="flex flex-row items-center gap-x-2">
                                {containsUpper ? (
                                  <BsCheck2Circle color="#019881" />
                                ) : (
                                  <CgCloseO color="#EE2E31" />
                                )}
                                <p className="text-darkerGray font-medium text-[12px]">
                                  Uppercase letters (A-Z)
                                </p>
                              </li>
                              <li className="flex flex-row items-center gap-x-2">
                                {containsNumber ? (
                                  <BsCheck2Circle color="#019881" />
                                ) : (
                                  <CgCloseO color="#EE2E31" />
                                )}
                                <p className="text-darkerGray font-medium text-[12px]">
                                  Numbers (0-9)
                                </p>
                              </li>
                              <li className="flex flex-row items-center gap-x-2">
                                {containsSpecChar ? (
                                  <BsCheck2Circle color="#019881" />
                                ) : (
                                  <CgCloseO color="#EE2E31" />
                                )}
                                <p className="text-darkerGray font-medium text-[12px]">
                                  Special characters (ex. !@#)
                                </p>
                              </li>
                            </ul>
                            <li className="flex flex-row items-start gap-x-2">
                              {identicalCharInRow ? (
                                <BsCheck2Circle color="#019881" />
                              ) : (
                                <CgCloseO color="#EE2E31" />
                              )}
                              <p className="text-darkerGray font-medium text-[12px]">
                                No more than 2 identical characters in a row
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="border-l-8 border-l-lighterGray border-t-8 border-t-transparent w-0 h-0 border-b-[10px] border-b-transparent flex"></div>
                    </div>
                    <button
                      onClick={register}
                      type="submit"
                      className="w-full h-[50px] flex justify-center items-center text-white text-[15px] font-medium bg-green hover:bg-darkGreen transition duration-300 rounded-md"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              ) : (
                <div className="h-full lg:w-[60%] flex flex-col justify-center items-center mx-auto gap-y-4">
                  <div className="w-full flex flex-col justify-center items-center gap-y-3">
                    <button
                      onClick={googleAuthSignup}
                      className="w-full lg:h-[55px] shadow-md hover:shadow-lg transition duration-300 cursor-pointer border border-lighGray rounded-md disabled:hover:shadow-md disabled:cursor-not-allowed disabled:bg-lighGray"
                    >
                      <span className="w-full h-[60px] lg:h-full flex flex-row justify-center items-center gap-x-4">
                        <img
                          src={GoogleIcon}
                          alt={"Google Icon"}
                          className="w-[22px]"
                        />
                        <p className="font-semibold text-[16px]">
                          Sign up with Google
                        </p>
                      </span>
                    </button>

                    <div className="w-[95%] lg:h-[55px] flex flex-row justify-center items-center text-gray  my-3 lg:mt-2 lg:mb-0">
                      <span className="border-b-[0.1px] border-gray w-full"></span>{" "}
                      <p className="mx-3 text-[11px] font-semibold">OR</p>{" "}
                      <span className="border-b-[0.1px] border-gray w-full"></span>
                    </div>
                  </div>
                  <form className="flex flex-col justify-center items-center gap-y-3 w-full">
                    <label
                      htmlFor="companyMail"
                      style={{ color: `${color}` }}
                      className={`w-full font-semibold text-[14px]`}
                    >
                      {message ? message : "Email address"}
                    </label>
                    <input
                      id="companyMail"
                      type="email"
                      placeholder={"you@example.com"}
                      className="w-full h-[50px] border border-lightestGray pl-4 rounded-md focus:outline-none focus:border-green transition duration-300"
                      onChange={(e) => {
                        setEmailReg(e.target.value);
                      }}
                    />

                    <button
                      onClick={handleContinue}
                      type="submit"
                      className="w-full h-[50px] flex justify-center items-center text-white text-[15px] font-medium bg-green hover:bg-darkGreen transition duration-300 rounded-md"
                    >
                      Continue
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
