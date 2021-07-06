import React from "react";
import { useState } from "react";
import "./Lobby.css";
import SignUpPopUp from "./lobby_pop_ups/SignUpPopUp";
import SignInPopUp from "./lobby_pop_ups/SignInPopUp";
/**
 * This is the page that contains the sign in and sign up options.
 */
function Lobby() {
  const [signUpClicked, setSignUpClicked] = useState(false);
  const [signInClicked, setSignInClicked] = useState(false);
  /**
   * This function shows the sign up pop up.
   */
  const showSignUp = () => {
    setSignUpClicked(true);
  };
   /**
   * This function shows the sign in pop up.
   */
  const showSignIn = () => {
    setSignInClicked(true);
  };
  /**
   * This function hides the sign up pop up
   */  
  const closeSignUp = () => {
    setSignUpClicked(false);
  };
  /**
   * This function hides the sign in pop up
   */
  const closeSignIn = () => {
    setSignInClicked(false);
  };

  return (
    <div className="lobby">
      <div className="main-container">
        <h1 className="message">To help you track your spendings and more!</h1>
        <div className="sign-up-in-btn-container">
          <button
            id="sign-up-btn-id"
            className="sign-up-btn"
            onClick={showSignUp}
          >
            Sign Up
          </button>
          <button
            id="sign-in-btn-id"
            className="sign-in-btn"
            onClick={showSignIn}
          >
            Login
          </button>
        </div>
        <h1>{signUpClicked}</h1>
        <SignUpPopUp
          open={signUpClicked}
          closeSignUp={closeSignUp}
        ></SignUpPopUp>
        <SignInPopUp
          open={signInClicked}
          closeSignIn={closeSignIn}
        ></SignInPopUp>
      </div>
    </div>
  );
}

export default Lobby;
