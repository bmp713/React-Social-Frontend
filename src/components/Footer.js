import '../App.scss';
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { UserContext } from '../contexts/UserContext';

export default function Footer() {

    const { currentUser, login, logout } = useContext(UserContext);
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const logoutProfile = () => {
        logout();
        navigate('/');
    };

    return (
        <footer className="">
            <div className="row justify-content-center align-items-center">
                <div className="col-lg-12 justify-content-center align-items-center text-center p-2">
                    {console.log("currentUser => ", currentUser)}
                    {currentUser.email ? (
                        <div>
                            <span style={{ margin: '10px', fontSize: '16px' }}>{currentUser.email} is signed in</span>
                            <button className='app-btn' onClick={logoutProfile}>Sign Out</button>
                        </div>
                    ) : (
                        <div>
                            <Link to='/' type="button" className="app-btn">Sign In</Link>
                            <Link to='/signup' type="button" className="text-white mx-5"><span>Register Free</span></Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="row links justify-content-center align-items-center">
                <div className="col-lg-3">
                    <ul className="mx-auto col-lg-3 list-unstyled text-start text-white">
                        <li><a href="#!" className="text-white">About Us</a></li>
                        <li><a href="#!" className="text-white">Contact</a></li>
                    </ul>
                </div>
                <div className="col-lg-3">
                    <ul className="mx-auto col-lg-3 list-unstyled text-start text-white">
                        <li><a href="#!" className="text-white">Site Map</a></li>
                        <li><a href="#!" className="text-white">Preferences</a></li>
                    </ul>
                </div>
                <div className="col-lg-3">
                    <ul className="mx-auto col-lg-3 list-unstyled text-start text-white">
                        <li><a href="#!" className="text-white">Privacy Policy</a></li>
                        <li><a href="#!" className="text-white">Terms of Use</a></li>
                    </ul>
                </div>
            </div>
            <div className="row justify-content-center align-items-center">
                <div className="social col-lg-12 text-center m-0 p-3">
                    <span className="mx-2">Follow Us</span>
                    <img className="mx-2" height="30" src="./assets/Icon-facebook-white.png" alt="new" />
                    <img className="mx-2" height="30" src="./assets/Icon-instagram-circle-white.png" alt="new" />
                    <img className="mx-2" height="30" src="./assets/Icon-twitter-white.png" alt="new" />
                    <img className="mx-2" height="30" src="./assets/Icon-google-white.png" alt="new" />
                </div>
            </div>
            <div className="row copyright justify-content-center align-items-center m-0">
                <div className="col-lg-12 p-2 text-center">
                    ©2022 Copyright
                </div>
            </div>
        </footer>
    )
}



