import '../App.scss';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Friends from '../components/Friends';
import Gallery from '../components/Gallery';
import Messages from '../components/Messages';
import Image from '../components/Image';
import Users from '../components/Users';
import Email from '../components/Email';
import News from '../components/News';

import { UserContext } from '../contexts/UserContext';

export default function Profile() {
    const { currentUser, login, logout, setCurrentUser, updateUserFirebase, deleteUserFirebase } = useContext(UserContext);
    const navigate = useNavigate();

    const logoutProfile = () => {
        updateUserFirebase(currentUser);
        logout();
        navigate('/');
    }

    return (
        <div className='profile page'>
            <div className="header row justify-content-start align-items-start">

                <div className="col-lg-6 text-left">
                    <div className="row justify-content-start align-items-center my-0">
                        <div className="col-lg-10 text-left my-0">
                            <div style={{ fontSize: '14px', lineHeight: '1.2' }}>
                                <button onClick={() => window.location.reload(false)}>
                                    <h2 className="my-0 text-white">
                                        {currentUser.first} {currentUser.last}
                                    </h2>
                                </button><br></br>
                                <span className="d-none d-lg-inline-block mx-1">
                                    {currentUser.email}<br></br>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 py-0 text-lg-end">
                    <p className="profile-settings m-0">
                        <span style={{ color: '#4267d9' }}>{currentUser.email}</span> is signed in
                        <a href>
                            <Image />
                        </a>
                        <button onClick={logoutProfile} className="app-btn m-lg-1">Sign Out</button><br></br>
                        <a href
                            className="mx-2 text-white"
                            onClick={() => {
                                deleteUserFirebase(currentUser);
                                setCurrentUser('');
                                navigate('/');
                            }}
                        >
                            Delete Account
                        </a>
                        <span><img
                            width="20px" className="m-3"
                            src="./assets/Icon-gear-white.png" alt='new'
                        />
                        </span>
                    </p>
                </div>
            </div>
            <div className="row justify-content-center align-items-start">
                <div className="col-lg-5 text-left mx-lg-1 order-2 order-lg-1">
                    <Friends />
                    <Gallery />
                    {/* <Users/> */}
                    <News />
                </div>
                <div className="col-lg-5 text-left mx-lg-1 order-1 order-lg-2">
                    <Messages />
                </div>
            </div>


        </div>
    )
}



