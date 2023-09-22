/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useRef, useState, useEffect, useContext, createContext } from 'react';

import {UserContext} from '../contexts/UserContext';
import {commentContext} from './Messages';

export default function Messages(){

    // User authentication and comment context
    const {currentUser, login, logout } = useContext(UserContext);
    const {readMessages, comment} = useContext(commentContext);

    const [users, setUsers] = useState("");
    const [comments, setComments] = useState([]);
    const [commentID, setCommentID] = useState(0);

    //Read messages and comments from databse
    const readComments = async () => {

        // Fetch comments from Node API
        fetch(`https://react-social-backend.up.railway.app/messages/read`)
        // fetch(`http://localhost:4000/comments/read/`)
            .then(res => res.json())
            .then(data => {
                console.log("readComments data =>", data);

                // Read messages from API
                setComments(data);
            })    
            .catch(err => {
                console.error(err);
            })
    };

    const deleteComment = async (id) => {

        fetch(`https://react-social-backend.up.railway.app/comments/delete/${id}`, {
            method: 'DELETE'
        }) 
           .then(res => {
                return res.json()
            })
           .then(data => {
               console.log("deleteComment ", id);
               readComments();
               readMessages();
           })    
           .catch(err => console.error(err) )
    };

    return(
        <div 
            className="comment row justify-content-start align-items-start mx-auto my-2 p-1"
            style={{width:"100%", background:"#0001"}}
            key={comment.id}
        >
            <div className="col-xl-1 col-2">  
                <img    
                    height="30" className="m-2" 
                    style={{borderRadius:'50%', transform:"translate(-40%, 0%)"}}
                    src={comment.userImg} 
                    alt="new"
                />
            </div>
            <div className="col-xl-11 col-10 my-2"> 
                <div style={{fontWeight:"500"}}>
                    {comment.userName}
                    <span style={{margin:"0px 5px", fontSize:"10px", fontWeight:"300"}}>{comment.time}</span>
                </div>
                {comment.comment}<br></br>
                
                {currentUser.id === comment.userId &&
                    <a href
                        className="delete text-dark"
                        onClick={ () => { deleteComment(comment.id) } } 
                    >X</a>
                }
            </div>
        </div>
    )

}



