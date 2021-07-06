import React, { useState } from "react";
import "./User.css";
import GlobalTable from "./user_components/GlobalTable";
import UserTable from "./user_components/UserTable";
/**
 * This is the page that appears when the user is logged in.
 * It displays either the global or user table along with 
 * addition buttons such as add a purchase button,
 * query info button, etc (if user table is being displayed).
 */
function User() {

  const [userClicked, setUserClicked] = useState(true);
  const [globalClicked, setGlobalClicked] = useState(false);

  const [listOfUserPurchases, setListOfUserPurchases] = useState([]);
  const [listOfGlobalPurchases, setListOfGlobalPurchases] = useState([]);

  /**
   * This function queries the database to get the 
   * top 7 flavours and sets up the global table 
   * to display that information
   */
  const loadGlobalTable = () => {
    fetch("https://bubbletea-expense-tracker.herokuapp.com/user/getGlobalPurchases", {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setListOfGlobalPurchases(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <UserTable
        listOfUserPurchases={listOfUserPurchases}
        setListOfUserPurchases={setListOfUserPurchases}
        userClicked={userClicked}
        setUserClicked={setUserClicked}
        setGlobalClicked={setGlobalClicked}

        loadGlobalTable={loadGlobalTable}
      ></UserTable>

      <GlobalTable
        loadGlobalTable={loadGlobalTable}
        listOfGlobalPurchases={listOfGlobalPurchases}
        setUserClicked={setUserClicked}
        globalClicked={globalClicked}
        setGlobalClicked={setGlobalClicked}
      ></GlobalTable>
    </div>
  );
}

export default User;
