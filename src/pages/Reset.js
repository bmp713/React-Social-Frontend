/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useState, useEffect, useContext } from 'react';
import {Link, Route, Routes, useNavigate, BrowserRouter as Router, Navigate} from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
//import { db } from '../Firebase';

import {UserContext} from '../contexts/UserContext';

export default function Reset(){

    const { currentUser, login, signup, logout, reset } = useContext(UserContext);

    const auth = getAuth();

    useEffect(() => {
    },[]);

    const [msgSubmit, setMsgSubmit] = useState( { message: '', color: 'red'} );
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const sendPasswordEmail = (e) => {
        e.preventDefault();
        console.log('sendPasswordEmail() => ' + formData.email);

        reset(formData.email)
            .then(() => {
                setMsgSubmit({
                      message: `A password reset email has been sent to ${formData.email}`,
                      color: 'green'
                });
            })
            .catch( (error) => {
                console.log(error);
                setMsgSubmit({
                    message: error.toString(),
                    color: 'red'
                });          
            });
    }

    return(
        <div className="reset">
            <div className="row reset justify-content-lg-center align-items-center">

                <div className="col-lg-5 text-center m-3">
                    <img className="w-100" src="./assets/Devices7.png" alt="new"/>
                </div>
                <div className="col-lg-5 text-start ">
                    <div className="col-lg-10 text-left text-lg-white p-4">
                        <h1>Password Reset</h1>
                    </div>
                    <div className="App-modal">
                        <form onSubmit={sendPasswordEmail}>
                            <h2>Reset Password</h2>
                            <p>An email will be sent to reset your password</p>
                            <input 
                                // style={{borderColor:border}}
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})}                   
                                name="email" type="text" placeholder="Email"
                            /><br></br>
                            <input 
                                className="submit-btn" type="submit" value="Send Email" href='/profile'
                            />
                            <p style={{marginLeft:"10px", color:msgSubmit.color, fontSize:"14px"}}>{msgSubmit.message}</p>
                            <div className="row justify-content-lg-center align-items-stretch">
                                <div className="col-lg-6 text-center">
                                    <p>Don't have an account? <Link to='/signup'><strong> Sign Up</strong></Link></p>
                                </div>
                                <div className="col-lg-6 text-center">
                                    <Link to='/' className="float-lg-end">
                                        <p><strong>Sign In</strong></p>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}



