import React, { useContext } from "react";
import "./EditPopUp.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../helpers/AuthContext";
/**
 * This component is the edit a purchase pop up component. 
 * 
 * Props: 
 *  - editClicked: a state variable representing whether or not to display 
 *                this pop up
 *  - setEditClicked: a function that changes the state variable editClicked
 *  -formObject: a state variable that is an object containing the fields of the
 *               old purchase information
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
function EditPopUp({
  editClicked,
  setEditClicked,
  purchaseIdEdit,
  setPurchaseIdEdit,
  formObject,
  loadUserTable,
  loadGlobalTable,
  setIsQuerying
}) {
  const { authState } = useContext(AuthContext);

  if (!editClicked) {
    return null;
  }

  const initialValues = {
    flavour: formObject.flavour,
    quantity: formObject.quantity,
    price: formObject.price,
    location: formObject.location,
    date: formObject.date,
  };

  const validationSchema = Yup.object().shape({
    flavour: Yup.string().max(50).required(),
    quantity: Yup.number().min(1).integer().required(),
    price: Yup.number().min(0).required(),
    location: Yup.string(),
    date: Yup.string(),
  });

  /**
   * This function hides the edit pop up.
   */
  const hideEditPopUp = () => {
    setPurchaseIdEdit(0)
    setEditClicked(false);
  };

  /**
   * @typedef {Object} Data
   * @property {string} flavour flavour of the purchase being added
   * @property {integer} quantity quantity of the purchase being added
   * @property {double} price price of the purchase being added
   * @property {string} location location of the purchase being added
   * @property {string} date date of the purchase being added
   */

  /**
   * This function edits a purchase with an id of "purchaseId" in the database.
   * @param {Data} data contains the new information of the purchase 
   *               to be edited
   */
  const editPurchase = (data) => {
    setIsQuerying(false)
    const userId = authState.id;
    fetch("https://bubbletea-expense-tracker.herokuapp.com/user/purchase", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        accessToken: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        flavour: data.flavour,
        quantity: data.quantity,
        price: data.price,
        location: data.location,
        date: data.date,
        userId: userId,
        purchaseId: purchaseIdEdit,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        loadUserTable();
        loadGlobalTable();
      })
      .catch((error) => console.log(error));
    hideEditPopUp();
  };

  /**
   * This function hides the edit pop up.
   */
  const cancelFunction = () => {
    hideEditPopUp();
  };

  return (
    <div className="edit-pop-up" id="edit-pop-up-id">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={editPurchase}
      >
        <Form className="edit-pop-up-form">
          <div className="edit-pop-up-input">
            <label className="edit-pop-up-label required">Flavour:</label>
            <ErrorMessage className="edit-pop-up-field-error" name="flavour" component="span"></ErrorMessage>
            <Field
              className="edit-pop-up-field"
              autoComplete="off"
              name="flavour"
              placeholder="Ex: Mango"
            ></Field>
          </div>

          <div className="edit-pop-up-input">
            <label className="edit-pop-up-label required">Quantity:</label>
            <ErrorMessage className="edit-pop-up-field-error" name="quantity" component="span"></ErrorMessage>
            <Field
              className="edit-pop-up-field"
              autoComplete="off"
              name="quantity"
              placeholder="Ex: 2"
            ></Field>
          </div>

          <div className="edit-pop-up-input">
            <label className="edit-pop-up-label required">Price:</label>
            <ErrorMessage className="edit-pop-up-field-error" name="price" component="span"></ErrorMessage>
            <Field
              className="edit-pop-up-field"
              autoComplete="off"
              name="price"
              placeholder="Ex: 4.75"
            ></Field>
          </div>

          <div className="edit-pop-up-input">
            <label className="edit-pop-up-label">Location: </label>
            <ErrorMessage name="location" component="span"></ErrorMessage>
            <Field
              className="edit-pop-up-field"
              autoComplete="off"
              name="location"
              placeholder="Ex: Kingsway Milk and Sugar"
            ></Field>
          </div>

          <div className="edit-pop-up-input">
            <label className="edit-pop-up-label">Date: </label>
            <ErrorMessage name="date" component="span"></ErrorMessage>
            <Field
              className="edit-pop-up-field"
              autoComplete="off"
              name="date"
              placeholder="Ex: 2021-06-16"
            ></Field>
          </div>

          <div className="edit-pop-up-btn-container">
            <button onClick={cancelFunction} className="edit-pop-up-cancel-btn" id="edit-pop-up-cancel-btn-id">
              Cancel
            </button>
            <button type="submit" className="edit-pop-up-submit-btn" id="edit-pop-up-submit-btn-id">
              Submit
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default EditPopUp;
