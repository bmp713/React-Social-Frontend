/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useState, useEffect, useContext } from 'react';
import { doc, addDoc, setDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';

import {UserContext} from '../contexts/UserContext';

export default function Friends(){

    // User authentication
    const { currentUser, login, logout } = useContext(UserContext);

    const [friendsCount, setFriendsCount] = useState(0);
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState(false);
    
    const [formData, setFormData] = useState({
    });

    useEffect(() => {
        readFriends();
    },[] );
    useEffect(() => {
        readFriends();
    },[currentUser] );

    const readFriends = async () => {
        let data = await getDocs( collection(db, 'users') );

        // Copy all data to messages state array
        setFriends( data.docs.map( (doc) => ({
            ...doc.data()
        }) ) );
        
        let count = 0;
        friends.forEach( (friend) => {
            count++;
        });
        setFriendsCount( count );
    };
    
    const deleteFriend = async (id) => {
        console.log('deleteDoc(id) => ' + id);
        try{
            await deleteDoc( doc(db, 'friends', id) );
            readFriends();
        }catch(error){
            console.log(error);
        }
    };

    const createFriend = async (e) => {
        e.preventDefault();

        console.log( "currentUser.friends =>", currentUser.friends);
    //     // Update friend document
    //     await setDoc( doc(db, 'friends', docRef.id.toString()), {
    //         id: docRef.id,
    //         userId: currentUser.id,
    //         name: formData.name,
    //         email: formData.email,
    //         imageURL: formData.image? formData.image : urlImg
    //     })
        readFriends();
    };

    return(
        <div className='friends my-lg-0'>
            <div className="row justify-content-lg-left justify-content-center align-items-center px-lg-5 py-lg-0 py-lg-4">
                <div className="col-lg-6 text-lg-start">
                    <h2>Friends</h2>
                </div>
                <div className="col-lg-6 text-lg-end text-decoration-underline">
                    <button className="text-decoration-underline text-white">See all friends</button> 
                </div>
                {friends.map( (user) => 
                    <div className="col-lg-3 col-6" id={user.id} key={user.id}>
                        <a href>
                            <img className="headshot my-2" width="100%" src={user.imgURL} alt="new"/>
                            <p style={{fontSize:'15px'}}>
                                {user.first} {user.last}<br></br>
                            </p>

                        </a>
                    </div>
                )}                
            </div>
        </div>  
    )
}



