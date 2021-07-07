import React, { useContext } from "react";
import "./DeletePopUp.css";
import { AuthContext } from "../../helpers/AuthContext";
/**
 * This component is the delete a purchase pop up component. 
 * 
 * Props: 
 *  - deleteClicked: a state variable representing whether or not to display 
 *                this pop up
 *  - setDeleteClicked: a function that changes the state variable deleteClicked
 *  - purchaseIdDelete: the id of the purchase item in our data base to be deleted
 *  - loadUserTable: a function that queries the database to get the purchase
 *                   history of a suer and sets up the user table to display
 *                   that information
 *  - loadGlobalTable: a function that queries the database to get the 
 *                     top 7 flavours and sets up the global table 
 *                     to display that information
 *  - setIsQuerying: a function that changes the state variable isQuerying 
 *                   (isQuerying tells us whether or the info being displayed
 *                   is generated from the query pop up)
 */
function DeletePopUp({
  deleteClicked,
  setDeleteClicked,
  purchaseIdDelete,
  loadUserTable,
  loadGlobalTable,
  setIsQuerying
}) {
  const { authState } = useContext(AuthContext);

  if (!deleteClicked) {
    return null;
  }
  /**
   * This fuction hides the delete pop up.
   */
  const hideDeletePopUp = () => {
    setDeleteClicked(false);
  };

  /**
   * This function deletes the purchase with id of purchaseIdDelete 
   */
  const deleteEdit = () => {
    const userId = authState.id;
    setIsQuerying(false)
    fetch(`https://bubbletea-expense-tracker.herokuapp.com/user/purchase/${userId}/${purchaseIdDelete}`, {
      method: "DELETE",
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        loadUserTable();
        loadGlobalTable();
      })
      .catch((error) => console.log(error));
    hideDeletePopUp();
  };

  return (
    <div className="delete-pop-up" id="delete-pop-up-id">
      <h1>Are you sure you want to delete this?</h1>
      <div className="delete-pop-up-btn-container">
        <button
          onClick={hideDeletePopUp}
          className="delete-pop-up-cancel-btn"
          id="delete-pop-up-no-btn-id"
        >
          Cancel
        </button>
        <button
          onClick={deleteEdit}
          className="delete-pop-up-submit-btn"
          id="delete-pop-up-yes-btn-id"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default DeletePopUp;
