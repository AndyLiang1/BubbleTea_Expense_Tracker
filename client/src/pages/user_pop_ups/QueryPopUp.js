import React, { useState, useContext } from "react";
import "./QueryPopUp.css";
import { AuthContext } from "../../helpers/AuthContext";

import { Formik, Form, Field } from "formik";
/**
 * This component is the query information pop up.
 * 
 * Props:
 *  - queryClicked: a state variable representing whether or not to display 
 *                this pop up
 *  - setQueryClicked: a function that changes the state variable queryClicked
 *  - setListOfUserPurchases: this is a state variable containing the information
 *                            of the purchases to be displayed
 *  - setIsQuerying: a function that changes the state variable isQuerying 
 *                   (isQuerying tells us whether or the info being displayed
 *                   is generated from the query pop up)
 */
function QueryPopUp({ queryClicked, setQueryClicked, setListOfUserPurchases, setIsQuerying }) {
  const [errorMsg, setErrorMsg] = useState("");
  const { authState } = useContext(AuthContext);

  if (!queryClicked) {
    return null;
  }

  const initialValues = {
    time: "",
    priceDirection: "",
    flavour: "",
  };
  /**
   * This function hides the query pop up.
   */
  const hideQueryPopUp = () => {
    setErrorMsg("");
    setQueryClicked(false);
  };

  /**
     * @typedef {Object} Data
     * @property {string} time If this property is not empty, it will represent
     *                         the duration from which to query information from
     *                         (ex: last month, week, etc)
     * @property {string} priceDirection either descending or ascending or empty. 
     *                                   If this property is not empty, it 
     *                                   will decide in which direction we order 
     *                                   by price
     * @property {string} flavour if this property is not empty, we will order 
     *                            all of the user's purchases with this flavour by
     *                              1) whether or not there is a location specified
     *                                 (purchases with locations returned first)
     *                              2) from cheapest to most expensive 


    /**
     * This function simply decides which of the 3 query styles the user chose 
     * (time, price direction or flavour)
     * @param {Data} data contains the information from thw query pop up form
     */
  const decideOrderBy = (data) => {
    let numEmpty = 0;
    let timeOption = false;
    let priceDirOption = false;
    let flavourOption = false;
    data.time === "" ? numEmpty++ : (timeOption = true);
    data.priceDirection === "" ? numEmpty++ : (priceDirOption = true);
    data.flavour === "" ? numEmpty++ : (flavourOption = true);

    if (numEmpty != 2) {
      setErrorMsg("Please leave two fields blank!");
      return;
    } else {
      setErrorMsg("");
      queryInfo(timeOption, priceDirOption, flavourOption, data);
    }
  };
  /**
     * This function queries the neccessary information. See defintion of 
     * the object Data above for more details.
     * @param {Data} data contains the information from thw query pop up form
     */
  const queryInfo = (timeOption, priceDirOption, flavourOption, data) => {
    const userId = authState.id;
    setIsQuerying(true)
    if (timeOption) {
      const { time } = data;
      fetch(`https://bubbletea-expense-tracker.herokuapp.com/user/orderByTime/${userId}/${time}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
        .then((response) => response.json())
        .then((result) => {
          setListOfUserPurchases(result);
        });
    } else if (priceDirOption) {
      const direction = data.priceDirection;
      fetch(`https://bubbletea-expense-tracker.herokuapp.com/user/orderByPrice/${userId}/${direction}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
        .then((response) => response.json())
        .then((result) => {
          setListOfUserPurchases(result);
        });
    } else {
      const { flavour } = data;
      fetch(`https://bubbletea-expense-tracker.herokuapp.com/user/orderByFlavour/${userId}/${flavour}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
        .then((response) => response.json())
        .then((result) => {
          setListOfUserPurchases(result);
        });
    }

    hideQueryPopUp();
  };

  return (
    <div className="query-pop-up">

      <Formik initialValues={initialValues} onSubmit={decideOrderBy}>
        <Form className="query-pop-up-form">\
        <h1>Choose one of the 3 search options below! </h1>
          <div>
            <label>Show purchases made in the last </label>
            <Field className="query-pop-up-field" name="time" as="select">
              <option value="--">--</option>
              <option value="month">month</option>
              <option value="week">week</option>
              <option value="day">day</option>
              <option value="year">year</option>
            </Field>
          </div>

          <h1>OR</h1>

          <div>
            <label htmlFor="priceDirection">Order by price </label>
            <Field className="query-pop-up-field" name="priceDirection" as="select">
              <option value="--">--</option>
              <option value="ascending">Least expensive to Most</option>
              <option value="descending">Most expensive to Least</option>
            </Field>
          </div>

          <h1>OR</h1>

          <div>
            <label htmlFor="flavour">Cheapest location for this flavour </label>
            <Field className="query-pop-up-field" name="flavour" type="text" />
          </div>

          <div className="query-pop-up-btn-container">
            <button className="query-pop-up-cancel-btn" onClick={hideQueryPopUp}>Cancel</button>
            <button className="query-pop-up-submit-btn" type="submit">Submit</button>
          </div>
          {errorMsg === "" ? null : <h1>{errorMsg}</h1>}
        </Form>
      </Formik>

    </div>
  );
}

export default QueryPopUp;
