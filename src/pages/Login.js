import '../App.scss';
import React, { useState, useEffect, useContext } from 'react';
import { Link, Route, Routes, useNavigate, BrowserRouter as Router, Navigate } from 'react-router-dom';
//import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";

import { UserContext } from '../contexts/UserContext';

export default function Login() {

    const { currentUser, login, logout } = useContext(UserContext);

    const [msgSubmit, setMsgSubmit] = useState({ message: '', color: 'red' })
    const [passwordShow, setPasswordShow] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "demo@yahoo.com",
        password: "Welcome123"
    });

    useEffect(() => {
    }, []);

    const signInUserPassword = (e) => {
        e.preventDefault();

        if (!(formData.email && formData.password)) {
            setMsgSubmit({
                message: 'Please fill in all input fields',
                color: 'red'
            });
            return;
        }

        login(formData.email, formData.password)
            .then(() => {
                navigate('/profile');
            })
            .catch((error) => {
                console.log("login =>", error);

                setMsgSubmit({
                    message: error.toString(),
                    color: 'red'
                });
            });
    }

    return (
        <div className="signin">
            <div className="row signin justify-content-lg-center align-items-center">
                <div className="col-lg-5 text-center p-4">
                    <img className="w-100" src="./assets/Devices7.png" alt="new" />
                </div>
                <div className="col-lg-5 text-left">
                    <div className="col-lg-10 text-left p-3 p-lg-0">
                        <h1>Welcome</h1>
                        <h2>Connect Today and Change The World</h2>
                    </div>
                    <div className="App-modal">
                        <form>
                            <h2>Sign In</h2>
                            <p>Log in with existing account or click sign up below.</p>
                            <input
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                name="email" type="text" placeholder="Username"
                            /><br></br>
                            <div className="eye-container">
                                <input
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    type={passwordShow ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                />
                                <a
                                    className="btn-invisible"
                                    onClick={() => { passwordShow ? setPasswordShow(false) : setPasswordShow(true) }}>
                                    <img
                                        id="eye" className="eye"
                                        src={passwordShow ? "./assets/Icon-eye-open.png" : "./assets/Icon-eye-closed.png"} alt="new"
                                    />
                                </a>
                            </div>
                            <input
                                onClick={signInUserPassword}
                                className="submit-btn" type="submit" value="Sign In" href='/profile'
                            />
                            <p style={{ marginLeft: "10px", color: msgSubmit.color, fontSize: "14px" }}>{msgSubmit.message}</p>

                            <div className="row justify-content-lg-center align-items-stretch">
                                <div className="col-lg-6 text-center">
                                    <p>Don't have an account? <Link to='/signup'><strong> Sign Up</strong></Link></p>
                                </div>
                                <div className="col-lg-6 text-center">
                                    <Link to='/reset' className="float-lg-end">
                                        <p><strong>Forgot Password?</strong></p>
                                    </Link>
                                </div>
                            </div>
                        </form>
                        <div className="row justify-content-lg-center align-items-stretch">
                            <div className="col-lg-6 text-center">
                                <span><button className=".app-btn">
                                    <img width='75' src="./assets/Icon-facebook.png" alt="new" />
                                </button></span>
                                <span><button className=".app-btn">
                                    <img width='75' src="./assets/Icon-google.png" alt="new" />
                                </button></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row signin-row justify-content-lg-center align-items-center text-black">
                <div className="col-lg-5 text-left">
                    <div className="col-lg-10 text-left px-4">
                        <h1 style={{ color: '#4267d9' }}>Social Media</h1>
                        <h2>Its Impact Changed The World</h2>
                        <br></br><br></br>
                        <p>
                            Social media was originally intended to bring us closer together but in many ways it has
                            done the opposite. Algorithms have increasingly emphasized rewarding
                            controversy to increase ad revenue.
                            <br></br><br></br>
                            This is a social media app intended to reverse that trend by rewarding positivity,
                            and promoting personal growth among users.
                        </p>
                    </div>
                </div>
                <div className="col-lg-5 text-center p-4">
                    <img className="w-100" src="./assets/App-screens.png" alt="new" />
                </div>
            </div>
        </div>

    )
}












