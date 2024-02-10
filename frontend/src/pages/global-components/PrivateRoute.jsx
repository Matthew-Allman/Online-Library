import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import { isMobile } from "react-device-detect";
import { useGlobalContext } from "../../../contextAPI/AuthContext";

import Axios from "axios";

const PrivateRoute = ({ children, from }) => {
  Axios.defaults.withCredentials = true;
  const { setGlobalType, setGlobalDisplay, setGlobalText } = useGlobalContext();

  const API_URL = import.meta.env.VITE_APP_API_URL;

  const [loggedIn, setLoggedIn] = useState(
    async () =>
      await Axios.get(API_URL + "/sign-in").then((res) =>
        setLoggedIn(res.data.loggedIn)
      )
  );

  if (!loggedIn) {
    // not logged in so redirect to login page with the return url
    //
    <Navigate to="/" state={{ from: from }} />;
  } else if (isMobile) {
    setGlobalType(false);
    setGlobalDisplay(true);
    setGlobalText("Please log in on desktop devices only.");

    return <Navigate to={"/"} />;
  }

  return children;
};

export default PrivateRoute;
