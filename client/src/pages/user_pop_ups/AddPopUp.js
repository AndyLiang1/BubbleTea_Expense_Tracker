import React from "react";
import { useContext, useState } from "react";
import "./AddPopUp.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../helpers/AuthContext";
/**
 * This component is the add a purchase pop up component. 
 * 
 * Props: 
 *  - addClicked: a state variable representing whether or not to display 
 *                this pop up
 *  - setAddClicked: a function that changes the state variable addClicked
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
function AddPopUp({
  addClicked,
  setAddClicked,
  loadUserTable,
  loadGlobalTable,
  setIsQuerying
}) {
  const { authState } = useContext(AuthContext);
  if (!addClicked) return null;

  const initialValues = {
    flavour: "",
    quantity: "",
    price: "",
    location: "",
    date: "",
  };

  const validationSchema = Yup.object().shape({
    flavour: Yup.string().max(50).required(),
    quantity: Yup.number().min(1).integer().required(),
    price: Yup.number().min(0).required(),
    location: Yup.string(),
    date: Yup.string(),
  });
  /**
   * This function hides the add pop up.
   */
  const cancelFunction = () => {
    hideAddPopUp();
  };

  /**
   * This function hides the add pop up.
   */
  const hideAddPopUp = () => {
    setAddClicked(false);
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
   * This function adds a purchase into the database.
   * @param {Data} data contains the information of the purchase being made
   */
  const addPurchase = (data) => {
    setIsQuerying(false)
    const userId = authState.id;
    fetch("https://bubbletea-expense-tracker.herokuapp.com/user/purchase", {
      method: "POST",
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
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        loadUserTable()
        loadGlobalTable();
      })
      .catch((error) => console.log(error));
    hideAddPopUp();
  };
  return (
    <div className="add-pop-up">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={addPurchase}
      >
        <Form className="add-pop-up-form required">
          <div className="add-pop-up-input">
            <label className="add-pop-up-label required">Flavour:</label>
            <ErrorMessage className="add-pop-up-field-error" name="flavour" component="span"></ErrorMessage>
            <Field
              className="add-pop-up-field"
              autoComplete="off"
              name="flavour"
              placeholder="Ex: Mango"
            ></Field>
          </div>

          <div className="add-pop-up-input">
            <label className="add-pop-up-label required">Quantity:</label>
            <ErrorMessage className="add-pop-up-field-error" className="add-pop-up-field-error" name="quantity" component="span"></ErrorMessage>
            <Field
              className="add-pop-up-field"
              autoComplete="off"
              name="quantity"
              placeholder="Ex: 2"
            ></Field>
          </div>

          <div className="add-pop-up-input">
            <label className="add-pop-up-label required">Price:</label>
            <ErrorMessage className="add-pop-up-field-error" name="price" component="span"></ErrorMessage>
            <Field
              className="add-pop-up-field"
              autoComplete="off"
              name="price"
              placeholder="Ex: 4.75"
            ></Field>
          </div>

          <div className="add-pop-up-input">
            <label className="add-pop-up-label">Location: </label>
            <ErrorMessage name="location" component="span"></ErrorMessage>
            <Field
              className="add-pop-up-field"
              autoComplete="off"
              name="location"
              placeholder="Ex: Kingsway Milk and Sugar"
            ></Field>
          </div>

          <div className="add-pop-up-input" id="add-pop-up-input-date">
            <label className="add-pop-up-label">Date: </label>
            <ErrorMessage name="date" component="span"></ErrorMessage>
            <Field
              className="add-pop-up-field"
              autoComplete="off"
              name="date"
              placeholder="Ex: 2021-06-16"
            ></Field>
          </div>

          <div className="add-pop-up-btn-container">
            <button
              onClick={cancelFunction}
              className="add-pop-up-cancel-btn"
              id="add-pop-up-cancel-btn-id"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="add-pop-up-submit-btn"
              id="add-pop-up-submit-btn-id"
            >
              Submit
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default AddPopUp;
