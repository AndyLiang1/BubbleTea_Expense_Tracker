import React, { useEffect, useContext, useState } from "react";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import { GoDiffAdded } from "react-icons/go";
import { IoIosRefresh } from "react-icons/io";

import "./UserTable.css";
import AddPopUp from "../user_pop_ups/AddPopUp";
import { AuthContext } from "../../helpers/AuthContext";
import EditPopUp from "../user_pop_ups/EditPopUp";
import DeletePopUp from "../user_pop_ups/DeletePopUp";
import QueryPopUp from "../user_pop_ups/QueryPopUp";
import Card from "./Card";

/**
 * This is the component to display the table with the 7 most popular purchases.
 * 
 * Props:
 *  - listOfUserPurchases: a state variable of all the user purchases
 *  - setListOfUserPurchases: changes the state variable that contains the user's purchases
 *  - userClicked: a state variable representing whether or not to display the 
 *                   user table 
 *  - setUserClicked: a function that changes the state of whether or not to display the 
 *                    individual user table 
 *  - setGlobalClicked: a function that changes the state of whether or not to 
 *                    display the global table 
 *  - loadGlobalTable: a function that queries the database to get the 
 *                     top 7 flavours and sets up the global table 
 *                     to display that information
 *
 */
function UserTable({
  listOfUserPurchases,
  setListOfUserPurchases,
  userClicked,
  setUserClicked,
  setGlobalClicked,
  loadGlobalTable,
}) {
  const [addClicked, setAddClicked] = useState(false);
  const [editClicked, setEditClicked] = useState(false);
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [queryClicked, setQueryClicked] = useState(false);
  const [purchaseIdEdit, setPurchaseIdEdit] = useState(0);
  const [purchaseIdDelete, setPurchaseIdDelete] = useState(0);
  const [formObject, setFormObject] = useState({})
  const [spendings, setSpendings] = useState(0);
  const [isQuerying, setIsQuerying] = useState(false)

  const { authState, setAuthState } = useContext(AuthContext);

  /**
   * This function queries from the database and gathers all of the purchases 
   * of the user with an id of authState.id (which is the user's id)
   */
  const loadUserTable = () => {
    if (isQuerying) {
      return;
    }
    fetch("https://bubbletea-expense-tracker.herokuapp.com/user/purchase/" + authState.id, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setListOfUserPurchases(data);
        getSpendings();

      })
      .catch((error) => {
        console.log(error);
      });
  };
  /**
   * This function calculates the total spendings of all the purchases BEING DISPLAYED.
   */
  const getSpendings = () => {
    let spendingTotal = 0;
    listOfUserPurchases.forEach((onePurchase) => {
      spendingTotal += onePurchase.quantity * onePurchase.price
    })
    spendingTotal = spendingTotal.toFixed(2)
    setSpendings(spendingTotal)
  }

  /**
   * Helper function to grab 
   *  1) id of user
   *  2) status of whether user is logged in or not
   *  3) name of user
   * from local storage.
   * @returns an object that contains the
   *  1) id of user
   *  2) status of whether user is logged in or not
   *  3) name of user
   */
  const retrieveAuthState = async () => {
    const tempAuthState = {
      logged_in: localStorage.getItem("logged_in") === "true" ? true : false,
      name: localStorage.getItem("name"),
      id: parseInt(localStorage.getItem("id")),
    };
    return tempAuthState;
  };
  /**
   * This function fills in the labels for the edit pop up with the previous
   * values of the purchase. It's purpose is to make it so if the user only
   * wants to edit one field, they can only edit one field and not 
   * have to re-enter the same data for the other fields.
   */
  const fillInLabelsWithPrevValues = () => {
    const userId = authState.id;
    fetch(`https://bubbletea-expense-tracker.herokuapp.com/user/purchase/${userId}/${purchaseIdEdit}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const dataObject = {
          flavour: data[0].flavour,
          quantity: data[0].quantity,
          price: data[0].price,
          location: data[0].location,
          date: data[0].date
        }
        setFormObject(dataObject)
      })
      .catch((error) => console.log(error));
  }

  // ===========================================================================
  // Use Effect Hooks
  // ===========================================================================
  useEffect(() => {
    async function asyncWrapper() {
      const tempAuthState = await retrieveAuthState();
      if (authState.logged_in === false) {
        setAuthState({
          logged_in: tempAuthState.logged_in === true ? true : false,
          name: tempAuthState.name,
          id: tempAuthState.id,
        });
      }
    }
    asyncWrapper();
  }, []);

  useEffect(() => {
    loadUserTable();
  }, [authState]);

  useEffect(() => {
    getSpendings()
  }, [listOfUserPurchases])

  useEffect(() => {
    fillInLabelsWithPrevValues()
  }, [purchaseIdEdit])

  useEffect(() => {
    loadUserTable()
  }, [spendings])

  useEffect(() => {
    loadUserTable()
  }, [isQuerying])

  useEffect(() => {
    if (formObject && Object.keys(formObject).length === 0 && formObject.constructor === Object) {
      return
    }
    if (editClicked) {
      // prevent bug of clicking 2 edit btn sequentially, overwriting wrong val
      setEditClicked(false);
    }
    if (deleteClicked) {
      // prevent bug of clicking 2 edit btn sequentially, overwriting wrong val
      setDeleteClicked(false);
    }
    setEditClicked(true);
  }, [formObject])

  if (!userClicked) {
    return null;
  }
  /**
   * This function displays the add a purchase pop up.
   */
  const showAddPopUp = () => {
    setAddClicked(true);
  };

  /**
   * This function displays the global table instead of the user table.
   */
  const showGlobalTable = () => {
    setGlobalClicked(true);
    setUserClicked(false);
  };

  /**
   * This function displays the edit a purchase pop up.
   */
  const showEditPopUp = (event) => {
    setPurchaseIdEdit(event.currentTarget.getAttribute("purchaseid"));
    // fillInLabelsWithPrevValues()
    // if (editClicked) {
    //   // prevent bug of clicking 2 edit btn sequentially, overwriting wrong val
    //   setEditClicked(false);
    // }
    // if (deleteClicked) {
    //   // prevent bug of clicking 2 edit btn sequentially, overwriting wrong val
    //   setDeleteClicked(false);
    // }
    // setEditClicked(true);  
  };

  /**
   * This function displays the delete a purchase pop up.
   */
  const showDeletePopUp = (event) => {
    setPurchaseIdDelete(event.currentTarget.getAttribute("purchaseid"));
    if (deleteClicked) {
      setDeleteClicked(false);
    }
    if (editClicked) {
      setEditClicked(false);
    }
    setDeleteClicked(true);
  };

  /**
    * This function displays the query information pop up.
    */
  const showQueryPopUp = () => {
    if (queryClicked) {
      setQueryClicked(false);
    }
    setQueryClicked(true);
  };

  /**
   * This function reverts the information being displayed for the user table
   * back to containing a log of all the purchases that user made, ordered by
   * date.
   */
  const revertFunction = () => {
    setIsQuerying(false)
    loadUserTable()
  }
  return (
    <div className="user-container">
      <div className="user-tab-table-container">
        <div className="user-tab-table">
          <div className="user-tab-container">
            <ul>
              <li>
                <h1 className="user_user-tab" id="user_user-tab-id">
                  User
             </h1>
              </li>
              <li>
                <h1
                  onClick={showGlobalTable}
                  className="user_global-tab"
                  id="user_global-tab-id"
                >
                  Global
              </h1>
              </li>
            </ul>
          </div>

          <div className="user-table-container">
            <table className="user-table" id="user-table-id">
              <thead className="user-table-head" id="user-table-head-id">
                <tr>
                  <td>Flavour</td>
                  <td>Quantity</td>
                  <td>Price</td>
                  <td>Location</td>
                  <td>Date</td>
                  <td>Edit</td>
                  <td>Delete</td>
                </tr>
              </thead>
              <tbody className="user-table-body" id="user-table-body-id">
                {listOfUserPurchases.map((onePurchase) => {
                  return (
                    <tr className="user-table-body-row" key={onePurchase.id}>
                      <td>{onePurchase.flavour}</td>
                      <td>{onePurchase.quantity}</td>
                      <td>{onePurchase.price}</td>
                      <td>{onePurchase.location}</td>
                      <td>{onePurchase.date}</td>
                      <td>
                        <FaEdit
                          className="user-table-body-row-edit"
                          purchaseid={onePurchase.id}
                          onClick={showEditPopUp}
                          id="edit-btn-id"
                        >
                          Edit
                     </FaEdit>
                      </td>
                      <td>
                        <FaTrashAlt
                          className="user-table-body-row-delete"
                          onClick={showDeletePopUp}
                          purchaseid={onePurchase.id}
                          id="delete-btn-id"
                        >
                          Delete
                     </FaTrashAlt>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {listOfUserPurchases.map((onePurchase) => {
              return (
                <Card
                  className="card"
                  flavour={onePurchase.flavour}
                  quantity={onePurchase.quantity}
                  price={onePurchase.price}
                  location={onePurchase.location}
                  date={onePurchase.date}
                  purchaseId={onePurchase.id}
                  showEditPopUp={showEditPopUp}
                  showDeletePopUp={showDeletePopUp}
                ></Card>
              );
            })}
          </div>
        </div>
      </div>


      <div className="user-button-container">
        <GoDiffAdded
          className="user-side-button"
          onClick={showAddPopUp}
          id="add-btn-id"
        >
          Add
      </GoDiffAdded>
        <FaSearch
          className="user-side-button"
          onClick={showQueryPopUp}
          id="query-btn-id"
        >
          Search
      </FaSearch>
        <IoIosRefresh
          className="user-side-button"
          onClick={revertFunction}
          id="revert-btn"
        >
          Revert
      </IoIosRefresh>
      </div>
      <div className="spending-message-container">
        <div className="spending-message-wrapper">
          <h1 className="spending-message-1">Spendings:</h1>
          <h1 className="spending-message-2">${spendings}</h1>
        </div>
      </div>

      <AddPopUp
        addClicked={addClicked}
        setAddClicked={setAddClicked}
        loadUserTable={loadUserTable}
        loadGlobalTable={loadGlobalTable}
        setIsQuerying={setIsQuerying}
      ></AddPopUp>
      <EditPopUp
        editClicked={editClicked}
        setEditClicked={setEditClicked}
        purchaseIdEdit={purchaseIdEdit}
        setPurchaseIdEdit={setPurchaseIdEdit}
        formObject={formObject}
        loadUserTable={loadUserTable}
        loadGlobalTable={loadGlobalTable}
        setIsQuerying={setIsQuerying}
      ></EditPopUp>
      <DeletePopUp
        deleteClicked={deleteClicked}
        setDeleteClicked={setDeleteClicked}
        purchaseIdDelete={purchaseIdDelete}
        loadUserTable={loadUserTable}
        loadGlobalTable={loadGlobalTable}
        setIsQuerying={setIsQuerying}
      ></DeletePopUp>
      <QueryPopUp
        queryClicked={queryClicked}
        setQueryClicked={setQueryClicked}
        setListOfUserPurchases={setListOfUserPurchases}
        setIsQuerying={setIsQuerying}
      ></QueryPopUp>
    </div>

  );
}

export default UserTable;
