import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { Tooltip as ReactTooltip } from "react-tooltip";

import Axios from "axios";

import { useGlobalContext } from "../../../contextAPI/AuthContext";

const DisplayDescription = ({ item, activeTab, setActiveTab }) => {
  return (
    <section
      className={`${
        activeTab
          ? "fixed z-[51] top-0 bottom-0 right-0 left-0 opacity-100 transition duration-500"
          : "hidden"
      }`}
    >
      <div
        className="fixed top-0 bottom-0 right-0 left-0 bg-gray z-[10] opacity-60"
        onClick={() => setActiveTab(false)}
      ></div>
      {/* Delete Account */}
      <div className="w-full h-auto flex justify-center items-center flex-col gap-y-6 absolute mt-16">
        <div className="h-auto w-[98%] lg:w-[45%] bg-white rounded-md border border-lighGray lg:px-0 z-[1000] shadow-2xl overflow-hidden">
          <div className="h-full flex flex-col justify-center items-center mx-auto">
            <div className="w-full h-full flex flex-row justify-between items-center bg-lighterGray p-6 rounded-t-md border-b border-lighGray">
              <p className="text-[17px] font-medium capitalize">{item.title}</p>
              <IoClose
                onClick={() => setActiveTab(false)}
                className="text-gray font-bold cursor-pointer"
                size={25}
              />
            </div>

            <div className="p-6 w-full overflow-auto scroll-container h-[300px]">
              {item.description && (
                <div className="w-full h-auto flex flex-col items-start">
                  <p className="text-[15px] font-normal text-darkestGray text-left text-wrap">
                    {item.description}
                  </p>
                </div>
              )}
            </div>
            <span className="w-full flex items-start justify-start pl-6"></span>
          </div>
        </div>
      </div>
    </section>
  );
};

const MyBooks = () => {
  const {
    accountInfo,
    setLoginStatus,
    setAccountInfo,
    setGlobalType,
    setGlobalText,
    setGlobalDisplay,
  } = useGlobalContext();
  const { mailingAddress, email, id } = accountInfo;

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_APP_API_URL;

  const [photoUrl, setPhotoUrl] = useState(null);
  const [data, setData] = useState(async () => {
    await Axios.get(API_URL + "/get-books")
      .then((response) => setData(response.data))
      .catch((err) => console.log(err));
  });

  const [ownedBooks, setOwnedBooks] = useState([]);
  const [activeTab, setActiveTab] = useState(false);

  // Function to log user out then redirect to sign in page
  //
  const handleLogout = async () => {
    await Axios.post(`${API_URL}/sign-out`, { id: id })
      .then((response) => {
        if (response.data.successMessage) {
          setLoginStatus(false);
          setAccountInfo({});

          setGlobalType(true);
          setGlobalText(response.data.successMessage);
          setGlobalDisplay(true);

          // Go back to either sign in page or non signed in home page if we have one
          //
          navigate("/");
        } else {
          setGlobalType(false);
          setGlobalText("Something went wrong, please try again.");
          setGlobalDisplay(true);
        }
      })
      .catch(() => {
        setGlobalType(false);
        setGlobalText("Something went wrong, please try again.");
        setGlobalDisplay(true);
      });
  };

  const handleAccountDelete = async () => {
    await Axios.post(`${API_URL}/account-delete`, { id: id })
      .then((response) => {
        if (response.data.successMessage) {
          setLoginStatus(false);
          setAccountInfo({});

          setGlobalType(true);
          setGlobalText(response.data.successMessage);
          setGlobalDisplay(true);

          // Go back to either sign in page or non signed in home page if we have one
          //
          navigate("/sign-up");
        } else {
          setGlobalType(true);
          setGlobalText(response.data.errMessage);
          setGlobalDisplay(true);
        }
      })
      .catch((err) => {
        setGlobalType(false);
        setGlobalText("Something went wrong, please try again.");
        setGlobalDisplay(true);
      });
  };

  const handleReturn = async (item) => {
    const url = API_URL + "/return";
    const body = { userID: id, ISBN: item.ISBN };

    await Axios.post(url, body)
      .then(async (response) => {
        if (response.data.successMessage) {
          setGlobalType(true);
          setGlobalText(response.data.successMessage);

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

          await Axios.get(API_URL + "/get-books")
            .then((response) => setData(response.data))
            .catch((err) => console.log(err));
        } else if (response.data.errMessage) {
          setGlobalType(false);
          setGlobalText(response.data.errMessage);
        }
        setGlobalDisplay(true);
      })
      .catch((err) => {
        setGlobalType(false);
        setGlobalText("An error has occurred, please try again.");
        setGlobalDisplay(true);
      });
  };

  useEffect(() => {
    setPhotoUrl(accountInfo.photoUrl);
  }, []);

  useEffect(() => {
    if (typeof accountInfo === "object" && Array.isArray(data)) {
      if (accountInfo.books) {
        setOwnedBooks(
          data.filter((item) => accountInfo.books.includes(item.ISBN)) || []
        );
      } else {
        setOwnedBooks([]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (typeof accountInfo === "object" && Array.isArray(data)) {
      if (accountInfo.books) {
        setOwnedBooks(
          data.filter((item) => accountInfo.books.includes(item.ISBN)) || []
        );
      } else {
        setOwnedBooks([]);
      }
    }
  }, [accountInfo]);

  return (
    <section
      className={`w-full bg-lighterGray ${
        ownedBooks.length >= 3 ? "h-auto pb-8" : "h-screen"
      }`}
    >
      {!mailingAddress && (
        <span className="w-full h-auto py-3 bg-red-200 flex flex-row justify-between items-center text-gray font-medium px-12">
          Before you can borrow any books, please fill in your mailing address.
          <Link
            to={"/complete-my-profile"}
            className="w-auto h-auto text-blue border-b border-blue"
          >
            Complete my profile
          </Link>
        </span>
      )}
      <span className="w-full flex flex-row justify-around xl:gap-x-20  items-center text-gray font-medium px-12 border-b border-lighGray py-4">
        <div className="w-auto h-auto flex flex-row items-center justify-start gap-x-2 flex-1">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Google photo"
              className="h-[50px] w-[50px] border-black rounded-full"
            />
          ) : (
            <MdAccountCircle size={40} />
          )}

          {email}
        </div>
        <span className="h-auto flex-1 flex items-center justify-center">
          <Link
            to={"/dashboard"}
            className="w-auto h-auto text-blue border-b border-blue"
          >
            Dashboard
          </Link>
        </span>
        <div className="w-auto h-auto flex flex-row items-end justify-end gap-x-3 flex-1">
          <button
            onClick={handleLogout}
            className="w-auto h-auto text-blue border-b border-blue"
          >
            Sign out
          </button>
          <button
            onClick={handleAccountDelete}
            className="w-auto h-auto text-red-500 border-b border-red-500"
          >
            Delete my account
          </button>
        </div>
      </span>
      <div className="h-auto lg:container mx-auto">
        <div className="w-full h-full flex flex-col items-center justify-start">
          {ownedBooks.length > 0 ? (
            <div className="xl:w-[80%] w-[90%] h-auto bg-white flex flex-col mt-3 rounded-md border border-lighGray">
              {ownedBooks.map((item, index) => (
                <span
                  key={index}
                  className="w-full h-auto border-b border-lighGray p-3 flex flex-row items-start"
                >
                  <div className="flex-1 h-full flex flex-row items-start justify-start gap-x-6">
                    <div className="w-auto h-full border rounded-md border-green p-2">
                      <img
                        src={item.photoUrl}
                        alt={item.ISBN}
                        className="w-[130px] h-[190px]"
                      />
                    </div>
                    <div className="w-auto h-full flex flex-col items-start justify-start py-2 text-[15px]">
                      <span className="flex flex-row items-start justify-start text-gray gap-x-2">
                        <p className="font-medium text-darkerGray">ISBN:</p>{" "}
                        {item.ISBN}
                      </span>
                      <span className="flex flex-row items-start justify-start text-gray gap-x-2">
                        <p className="font-medium text-darkerGray">Title:</p>{" "}
                        {item.title} {item.subTitle && ` - ${item.subTitle}`}
                      </span>
                      <span className="flex flex-row items-start justify-start text-gray gap-x-2">
                        <p className="font-medium text-darkerGray">
                          Author(s):
                        </p>{" "}
                        {item.authors}
                      </span>
                      <span className="flex flex-row items-start justify-start text-gray gap-x-2">
                        <p className="font-medium text-darkerGray">
                          Available Copies:
                        </p>{" "}
                        {item.inventory}
                      </span>
                      <span className="flex flex-row items-start justify-start text-gray gap-x-2">
                        <p className="font-medium text-darkerGray">
                          Publish Info:
                        </p>{" "}
                        {item.publisher} - {item.publishedDate}
                      </span>
                      <span className="flex flex-row items-start justify-start gap-x-2 mt-2">
                        {item.description && (
                          <span>
                            <button
                              onClick={() => setActiveTab(true)}
                              // onClick={handleLogout}
                              className="w-auto h-auto text-blue border-b border-blue"
                            >
                              View Description
                            </button>{" "}
                            |
                          </span>
                        )}
                        <DisplayDescription
                          item={item}
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                        />
                        <a
                          target="_blank"
                          href={item.previewLink}
                          // onClick={handleLogout}
                          className="w-auto h-auto text-blue border-b border-blue"
                        >
                          Preview Book
                        </a>
                      </span>
                      <button
                        onClick={() => handleReturn(item)}
                        // onClick={handleLogout}
                        className="w-[150px] h-auto bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-white font-medium mt-4"
                      >
                        Return
                      </button>
                    </div>
                  </div>
                </span>
              ))}
            </div>
          ) : (
            <p className="w-full flex items-center justify-center mt-9 text-[16px] font-medium">
              No books associated with this account.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyBooks;
