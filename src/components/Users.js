/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useState, useEffect, useContext } from 'react';
import { doc, addDoc, setDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';

import {UserContext} from '../contexts/UserContext';

export default function Users(){

    // User authentication
    const { currentUser, setCurrentUser, updateUserFirebase, login, logout } = useContext(UserContext);

    const [profilesCount, setProfilesCount] = useState(0);
    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState(false);
    
    const [formData, setFormData] = useState({
    });

    useEffect(() => {
        readprofiles();
    },[]);

    useEffect(() => {
        readprofiles();
        console.log("useEffect() currentUser updated");
    },[currentUser] );

    const readprofiles = async () => {
        let data = await getDocs( collection(db, 'users') );

        // Copy all data to messages state array
        setProfiles( data.docs.map( (doc) => ({
            ...doc.data()
        }) ) );
        
        let profilesCount = 0;
        profiles.forEach( (friend) => {
            profilesCount++;
        });
        setProfilesCount(profilesCount);

    };

    const addFriend = async (id) => {
        console.log("addFriend =>", id);
        console.log("currentUser.friends =>", currentUser.friends);

        // setCurrentUser({
        //     id: currentUser.id,
        //     email: currentUser.email,
        //     first: currentUser.first,
        //     last: currentUser.last,
        //     imgURL: currentUser.imgURL,
        //     friends: currentUser.friends.concat(",", id),
        //     // friendsCount: currentUser.friendsCount + 1    
        // })   
        // updateUserFirebase(currentUser);  
        console.log("addFriend() =>", currentUser.friends);

    };

    return(
        <div className='friends my-2'>
            <div className="row justify-content-lg-center align-items-center px-lg-5 py-lg-4">
            <div className="col-lg-6 text-lg-start">
                    <h2>Users ({profilesCount})</h2> 
                </div>
                <div className="col-lg-6 text-lg-end">
                    <button className="text-decoration-underline text-white">See more users</button> 
                </div>
                {profiles.map( (user) => (
                    <div className="col-lg-3 col-6" id={user.id} key={user.id}>
                        <img className="my-2" width="100%" src={user.imgURL} alt="new"/>
                        <p style={{fontSize:'15px'}}>
                            {user.first} {user.last} 
                            {/* {user.email} */}<br></br>
                            <button 
                                onClick={ () => { addFriend(user.id) } } 
                                style={{
                                    textDecoration:"underline", 
                                    lineHeight:"0.5",
                                    color:"#ffff",
                                    fontSize:"15px", 
                                    padding:'0px'
                                }}>+ Add
                        </button>
                        </p>

                    </div>
                ))}                
            </div>
        </div>  
    )
}



