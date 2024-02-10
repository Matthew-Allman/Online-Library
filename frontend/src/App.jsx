import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PrivateRoute from "./pages/global-components/PrivateRoute";
import ScrollToTop from "./pages/global-components/ScrollToTop";
import GlobalPopupMessage from "./pages/global-components/GlobalPopUpMessage";

import { SignIn, SignUp } from "./pages/auth-pages";
import { Dashboard, Mailing, MyBooks } from "./pages/authenticated-pages";

import { useGlobalContext } from "../contextAPI/AuthContext";

function App() {
  const { accountInfo } = useGlobalContext();

  return (
    <Router>
      <GlobalPopupMessage />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SignIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>

        <Route
          path="/dashboard"
          element={
            <PrivateRoute from={"/dashboard"}>
              {Object.keys(accountInfo).length > 0 && <Dashboard />}
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/complete-my-profile"
          element={
            <PrivateRoute from={"/complete-my-profile"}>
              {Object.keys(accountInfo).length > 0 && <Mailing />}
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/my-books"
          element={
            <PrivateRoute from={"/my-books"}>
              {Object.keys(accountInfo).length > 0 && <MyBooks />}
            </PrivateRoute>
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
