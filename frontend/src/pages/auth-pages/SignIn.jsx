import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import GoogleIcon from "../../assets/google_icon.png";

import { Nav } from "./components";
import Axios from "axios";

import { useGlobalContext } from "../../../contextAPI/AuthContext";

const SignIn = () => {
  const {
    setGlobalType,
    setGlobalText,
    setGlobalDisplay,
    loginStatus,
    setAccountInfo,
  } = useGlobalContext();

  const [errMessage, setErrMessage] = useState("");
  const [errMessage1, setErrMessage1] = useState("");
  const [color, setColor] = useState("#000");
  const [color1, setColor1] = useState("#000");

  const email = useRef("");
  const password = useRef("");

  const navigate = useNavigate();

  const signIn = {
    text: "Don't have an account?",
    link: {
      name: "Sign up.",
      href: "/sign-up",
    },
  };

  const API_URL = import.meta.env.VITE_APP_API_URL;
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

  const login = async (event) => {
    event.preventDefault();

    setErrMessage("Email address");
    setColor("#000");
    setErrMessage1("Password");
    setColor1("#000");

    if (email.current.value && password.current.value) {
      const url = `${API_URL}/sign-in`;

      const loginInfo = {
        email: email.current.value,
        password: password.current.value,
      };

      Axios.defaults.withCredentials = true;

      await Axios.post(url, loginInfo)
        .then(async (response) => {
          if (response.data.successMessage) {
            setGlobalType(true);
            setGlobalText(response.data.successMessage);

            await Axios.get(url)
              .then((response) => {
                if (response.data.user) {
                  setAccountInfo(response.data.user);
                } else {
                  // console.log(response.data);
                  navigate("/");
                }
              })
              .catch(() => navigate("/"));

            navigate("/dashboard");
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

      //   loginPostReq(url, loginInfo, displayMessage, setLoginStatus);
    } else {
      if (!email.current.value && !password.current.value) {
        setErrMessage("Please enter a valid email address");
        setColor("#FF0000");
        setErrMessage1("Please enter a password");
        setColor1("#FF0000");
      } else if (!email.current.value) {
        setErrMessage("Please enter a valid email address");
        setColor("#FF0000");
      } else {
        setErrMessage1("Please enter a password");
        setColor1("#FF0000");
      }
    }
  };

  async function handleCredentialResponse(response) {
    let access_token = response.access_token;

    const url = `${API_URL}/sign-in`;
    const body = {
      access_token: access_token,
    };

    Axios.defaults.withCredentials = true;

    await Axios.post(url, body)
      .then(async (response) => {
        if (response.data.successMessage) {
          setGlobalType(true);
          setGlobalText(response.data.successMessage);

          await Axios.get(url)
            .then((response) => {
              if (response.data.user) {
                setAccountInfo(response.data.user);
              } else {
                // console.log(response.data);
                navigate("/");
              }
            })
            .catch(() => navigate("/"));

          navigate("/dashboard");
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
    scope: "https://www.googleapis.com/auth/userinfo.email",
    callback: handleCredentialResponse,
  });

  const googleAuthSignin = () => {
    tokenClient.requestAccessToken();
  };

  useEffect(() => {
    if (loginStatus) {
      navigate("/dashboard");
    }
  }, [loginStatus]);

  useEffect(() => {
    if (loginStatus) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <section className="w-full mb-3 lg:mb-0 h-screen lg:h-screen bg-lighterGray">
      <Nav items={signIn} />

      <div className="flex flex-col justify-center items-center w-full gap-y-3">
        <div className="flex flex-col items-center w-full">
          <h3 className="text-[26px] font-semibold">Welcome back</h3>
        </div>

        <div className="w-full h-auto flex justify-center items-center flex-col gap-y-6">
          <div className="h-auto w-[90%] lg:w-[40%] xl:w-[27%] bg-white rounded-md border border-lighGray py-12 px-5 lg:px-0">
            <div className="h-full lg:w-[80%] flex flex-col justify-center items-center mx-auto gap-y-4">
              <button
                onClick={googleAuthSignin}
                className="w-full lg:h-[55px] shadow-md hover:shadow-lg transition duration-300 cursor-pointer border border-lighGray rounded-md disabled:hover:shadow-md disabled:cursor-not-allowed disabled:bg-lighGray"
              >
                <span className="w-full h-[60px] lg:h-full flex flex-row justify-center items-center gap-x-4">
                  <img
                    src={GoogleIcon}
                    alt={"Google Icon"}
                    className="w-[22px]"
                  />
                  <p className="font-semibold text-[16px]">
                    Sign in with Google
                  </p>
                </span>
              </button>

              <div className="w-[95%] lg:h-[55px] flex flex-row justify-center items-center text-gray  my-3 lg:mt-1 lg:mb-0">
                <span className="border-b-[0.1px] border-gray w-full"></span>{" "}
                <p className="mx-3 text-[13px] font-semibold">OR</p>{" "}
                <span className="border-b-[0.1px] border-gray w-full"></span>
              </div>
              <form className="flex flex-col justify-center items-center gap-y-2 w-full">
                <label
                  htmlFor="companyMailb"
                  style={{ color: `${color}` }}
                  className={`w-full font-semibold text-[14px]`}
                >
                  {errMessage ? errMessage : "Email Address"}
                </label>
                <input
                  id="companyMail"
                  type="email"
                  placeholder={"you@example.com"}
                  ref={email}
                  className="w-full h-[50px] border border-lightestGray pl-4 rounded-md focus:outline-none focus:border-green transition duration-300 mb-1"
                />
                <div className="w-full flex flex-col items-start gap-y-1">
                  <label
                    htmlFor="password"
                    style={{ color: `${color1}` }}
                    className={`w-full font-semibold text-[14px]`}
                  >
                    {errMessage1 ? errMessage1 : "Password"}
                  </label>
                  <input
                    ref={password}
                    id="password"
                    type="password"
                    placeholder={"Enter a secured password..."}
                    className="w-full border border-grey focus:outline-none focus:border-green transition duration-300 h-[50px] pl-4 rounded-md mb-3"
                  />
                </div>
                <button
                  onClick={login}
                  type="submit"
                  className="w-full h-[50px] flex justify-center items-center text-white text-[15px] font-medium bg-green hover:bg-darkGreen transition duration-300 rounded-md"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
