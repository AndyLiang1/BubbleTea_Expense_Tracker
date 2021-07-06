import React from 'react'
import { useState } from 'react'
import './SignUpPopUp.css'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

/**
 * This is the sign up pop up component.
 * 
 * Props:
 *  open: a boolean value that represents whether or not this 
 *        pop up should be opened
 *  closeSignUp: a function to close the sign up pop up
 * 
 */
function SignUpPopUp({ open, closeSignUp }) {
    const [displaySignUpMsg, setDisplaySignUpMsg] = useState(false)
    const [signUpMessage, setSignUpMessage] = useState("")

    if (!open) {
        return null
    }

    const initialValues = {
        name: "",
        email: "",
        password: ""
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(50).required(),
        email: Yup.string().email('Invalid email').required(),
        password: Yup.string().max(50).required(),
    })
    /**
     * @typedef {Object} SubmittedData
     * @property {string} name name of the user being registered
     * @property {string} email email of the user being registered
     * @property {string} password password of the user being registered
     */


    /**
     * This function allows a user to log in.
     * @param {SubmittedData} submittedData information of the user that is logging in
     */
    const signUp = (submittedData) => {
        const { name, email, password } = submittedData
        const emailLowerCase = email.toLowerCase()
        fetch("https://bubbletea-expense-tracker.herokuapp.com/lobby/register", {
            mode: 'cors',
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                name: name,
                email: emailLowerCase,
                password: password
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setDisplaySignUpMsg(true)
                    setSignUpMessage(data.error)
                } else {
                    setDisplaySignUpMsg(true)
                    setSignUpMessage("Signed up successfully!")
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    /**
     * This function clears any error messages so that user does not see it.
     */
    const clearErrorMsg = () => {
        setSignUpMessage("")
    }

    return (
        <div className="sign-up-pop-up">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={signUp}
            >
                {({ errors, touched }) => (
                    <Form className="sign-up-form">
                        <div>
                            <label className="sign-up-label required" htmlFor="">Name </label>
                            <Field className="sign-up-field" name="name" />
                            {errors.name && touched.name ? (
                                <div className="sign-up-field-errors">{errors.name}</div>
                            ) : null}
                        </div>

                        <div>
                            <label className="sign-up-label required" htmlFor="">Email </label>
                            <Field className="sign-up-field" name="email" type="email" />
                            {errors.email && touched.email ? <div className="sign-up-field-errors">{errors.email}</div> : null}
                        </div>

                        <div>
                            <label className="sign-up-label required" htmlFor="">Password </label>
                            <Field className="sign-up-field" name="password" type="password" />
                            {errors.password && touched.password ? (
                                <div className="sign-up-field-errors">{errors.password}</div>
                            ) : null}
                        </div>
                        {displaySignUpMsg ? (
                            <div>
                                <h1 className="sign-up-message" id="sign-up-message-id">{signUpMessage}</h1>
                            </div>
                        ) : null}


                        <div className="sign-up-popup-btn-container" id="sign-up-popup-btn-container-id">
                            <button
                                className="sign-up-cancel-btn"
                                id="sign-up-cancel-btn-id"
                                onClick={() => {
                                    closeSignUp()
                                    clearErrorMsg()
                                }}
                            >
                                Cancel
                        </button>
                            <button type="submit" className="reg-btn" id="reg-btn-id">Register</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignUpPopUp
