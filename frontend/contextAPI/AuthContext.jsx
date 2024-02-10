import React, { useContext, useState, useEffect } from "react";
import Axios from "axios";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  Axios.defaults.withCredentials = true;

  const API_URL = import.meta.env.VITE_APP_API_URL;

  const [loginStatus, setLoginStatus] = useState(false);
  const [accountInfo, setAccountInfo] = useState(
    async () =>
      await Axios.get(`${API_URL}/sign-in`)
        .then((res) => res.data.user)
        .then((Response) => (Response ? setAccountInfo(Response || {}) : {}))
        .catch(() => {})
  );

  const [globalType, setGlobalType] = useState(false);
  const [globalText, setGlobalText] = useState("");
  const [globalDisplay, setGlobalDisplay] = useState(false);

  useEffect(() => {
    const getLoggedIn = async () => {
      await Axios.get(`${API_URL}/sign-in`)
        .then((response) => {
          if (response.data.loggedIn && loginStatus === false) {
            setLoginStatus(true);
          } else if (!response.data.loggedIn && loginStatus) {
            setLoginStatus(false);
          }
        })
        .catch(() => {});
    };

    getLoggedIn();
  }, []);

  return (
    <AppContext.Provider
      value={{
        accountInfo,
        setAccountInfo,
        loginStatus,
        setLoginStatus,
        globalType,
        setGlobalType,
        globalText,
        setGlobalText,
        globalDisplay,
        setGlobalDisplay,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
