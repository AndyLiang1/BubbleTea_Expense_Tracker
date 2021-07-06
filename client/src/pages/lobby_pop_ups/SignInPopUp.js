import React from 'react'
import './SignInPopUp.css'
import { useState, useContext } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useHistory } from "react-router-dom"
import { AuthContext } from '../../helpers/AuthContext'

/**
 * This is the sign in pop up component.
 * 
 * Props:
 *  open: a boolean value that represents whether or not this 
 *        pop up should be opened
 *  closeSignIn: a function to close the sign in pop up
 * 
 */
function SignInPopUp({ open, closeSignIn }) {
    const [badLogin, setBadLogin] = useState(false)
    const [signInMessage, setSignInMessage] = useState("")
    const { setAuthState } = useContext(AuthContext)
    let history = useHistory()

    if (!open) {
        return null
    }

    const initialValues = {
        email: "",
        password: ""
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required(),
        password: Yup.string().max(50).required(),
    })

    /**
     * @typedef {Object} Data
     * @property {string} email email of the user being registered
     * @property {string} password password of the user being registered
     */

    /**
     * This function registers a user into the database.
     * @param {Data} data contains the email and password of the user
     */
    const onSubmit = (data) => {
        const { email, password } = data
        const emailLowerCase = email.toLowerCase()
        fetch("https://bubbletea-expense-tracker.herokuapp.com/lobby/login", {
            headers: {
                "Content-type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                email: emailLowerCase,
                password: password,
            }),
        })
            .then(response => response.json())
            .then((data) => {
                if (data.error) {
                    setBadLogin(true)
                    setSignInMessage(data.error)
                } else {
                    setAuthState({ logged_in: true, name: data.name, id: data.id })
                    localStorage.setItem("logged_in", true)
                    localStorage.setItem("name", data.name)
                    localStorage.setItem("id", data.id.toString())

                    localStorage.setItem("accessToken", data.token)
                    history.push("../user")
                }
            })
    }

    /**
     * This function clears the error message so that user does not see it.
     */
    const clearErrorMsg = () => {
        setSignInMessage("")
    }

    return (
        <div className="sign-in-pop-up">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="sign-in-form">
                        <div>
                            <label className="sign-in-label required" htmlFor="">Email </label>
                            <Field className="sign-in-field" name="email" type="email" />
                            {errors.email && touched.email ? <div className="sign-in-field-errors">{errors.email}</div> : null}
                        </div>

                        <div>
                            <label className="sign-in-label required" htmlFor="">Password </label>
                            <Field className="sign-in-field" name="password" type="password" />
                            {errors.password && touched.password ? (
                                <div className="sign-in-field-errors">{errors.password}</div>
                            ) : null}
                        </div>
                        {badLogin ? (
                            <div>
                                <h1 className="sign-in-message" id="sign-in-message-id">{signInMessage}</h1>
                            </div>
                        ) : null}


                        <div className="sign-in-popup-btn-container" id="sign-in-popup-btn-container-id">
                            <button
                                className="sign-in-cancel-btn"
                                id="sign-in-cancel-btn-id"
                                onClick={() => {
                                    closeSignIn()
                                    clearErrorMsg()
                                }}
                            >
                                Cancel
                        </button>
                            <button type="submit" className="login-btn" id="login-btn-id">Login</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignInPopUp
