/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useRef, useState, useEffect, useContext, createContext } from 'react';
import { doc, where, query, addDoc, setDoc, getDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';
import { storage } from '../Firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import Comment from './Comment';
import {UserContext} from '../contexts/UserContext';

export const commentContext = createContext();
 
export default function Messages(){

    // User authentication
    const {currentUser, login, logout } = useContext(UserContext);

    const [messagesCount, setMessagesCount] = useState(4);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(false);
    const [sort, setSort] = useState(false);

    const [showMenuID, setShowMenuID] = useState(null);
    const [showMenu, setShowMenu] = useState(false);

    const [users, setUsers] = useState("");
    const [commentID, setCommentID] = useState(0);
    const [comments, setComments] = useState([]);

    const [formData, setFormData] = useState({
        message: '',
        comment: '',
        imageURL: ''
    }); 

    const [file, setFile] = useState("");
    const [imageURL, setImageUrl] = useState(null);

    const [message, setMessage] = useState("");
    const [messageFile, setMessageFile] = useState("");
    const [messageImageURL, setMessageImageUrl] = useState(null);

    useEffect(() => {
        readUsers();
        readMessages();
    },[]);

    useEffect(() => {
        readMessages();
    },[sort]);

    //Read users from Firebase
    const readUsers = async () => {

        let data = await getDocs( collection(db, 'users') );
        setUsers(   
            data.docs.map( (doc) => 
                ({ ...doc.data() }) 
            ) 
        );
    };

    // Read single user to update profile images and comments
    const readUser = (id) => {
        let user = users.find( (user) => user.id === id);
        return user.imgURL;
    }

    //Read messages and comments from databse
    const readMessages = async () => {
        console.log("readMessages()",);

        // Fetch messages from Node API
        fetch(`https://react-social-backend.up.railway.app/messages/read`)
        // fetch(`http://localhost:4000/messages/read`)
            .then(res => res.json())
            .then(data => {
                console.log("readMessages data =>", data);

                // Read messages from API
                data = data.sort( (a, b) => {
                    if(sort)
                        return (a.date - b.date)
                    else 
                        return (b.date - a.date )
                }) 
                setMessages(data);
            })   
            .catch(err => {
                console.error(err);
            }) 

        // Fetch comments from Node API
        fetch(`https://react-social-backend.up.railway.app/comments/read`)
        // fetch(`http://localhost:4000/comments/read`)
            .then(res => res.json())
            .then(data => {
                // Read messages from API
                setComments(data);
            })    
            .catch(err => {
                console.error(err);
            })
    };

    // Create message post
    const createMessage = async (e) => {

        e.preventDefault();
        console.log("createMessage");
 
        let date = new Date();
        let time = ( 
            date.getMonth()+ 1 ) + "/" + date.getDate() + "/" + date.getFullYear() + " " + (date.getHours() % 12 || 12) + ":" 
            + ( (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes() )
            + (date.getHours() >=12 ? "PM":"AM" );       

        let id = Math.floor(Math.random() * 10000000000000000);

        // Create message with Node API
        fetch(`https://react-social-backend.up.railway.app/messages/create`, {
        // fetch(`http://localhost:4000/messages/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' , 
            },
            body: JSON.stringify({ 
                id: id,
                email: currentUser.email,
                first: currentUser.first,
                last: currentUser.last,
                message: formData.message,
                userImg: currentUser.imgURL,
                userID: currentUser.id,
                imageURL: imageURL,
                likes: 0, 
                liked: ",", 
                time: time,
                date: Date.now()
            })
        })
        .then(res => res.json()) 
        .then(data => {
            setImageUrl("");
            setFile("");
            formData.message = "";
            formData.imageURL = "";
            readMessages();
        })    
        .catch(err => {
            console.error(err);
        })
    };  

    const deleteMessage = async (id) => {
        setShowMenu( !showMenu );

        fetch(`https://react-social-backend.up.railway.app/messages/delete/${id}`, {
        // fetch(`http://localhost:4000/messages/delete/${id}`, {
            method: 'DELETE'
        }) 
           .then(res => res.json() )
           .then(data => {
               readMessages();
           })    
           .catch(err => {
               console.error(err);
           })
    };

    const msgMenuClicked = async (id) => {
        setShowMenuID(id);
        setShowMenu(!showMenu);
    
        fetch(`https://react-social-backend.up.railway.app/messages/read/${id}`)
        // fetch(`http://localhost:4000/messages/read/${id}`)
            .then(res => res.json())
            .then(data => {
                setMessageImageUrl(data.imageURL);
                setMessageFile(data.imageURL);
                // setFile(file); 
                // setImageUrl(data.imageURL); 

                setFormData({
                    ...formData, 
                    imageURL: data.imageURL, 
                    message: data.message
                });
            })    
    }

    // Edit message by message ID
    const editMessage = async (id) => {
        setShowMenu( !showMenu );

        let date = new Date();
        let time = ( 
            date.getMonth()+ 1 ) + "/" + date.getDate() + "/" + date.getFullYear() + " " + (date.getHours() % 12 || 12) + ":" 
            + ( (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes() )
            + (date.getHours() >=12 ? "PM":"AM" );        

        try{
            let res = await fetch(`https://react-social-backend.up.railway.app/messages/read/${id}`);
            // let res = await fetch(`http://localhost:3000/messages/read/${id}`);

            let data = await res.json();

            setMessageImageUrl(data.imageURL);
            setMessageFile(data.imageURL);
            let newMessage = formData.message ? formData.message : data.message;

            fetch(`https://react-social-backend.up.railway.app/messages/update/${id}`, {
            // fetch(`http://localhost:4000/messages/update/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' , 
                },
                body: JSON.stringify({ 
                    id: id,
                    email: currentUser.email,
                    first: currentUser.first,
                    last: currentUser.last,
                    message: newMessage,
                    userImg: currentUser.imgURL,
                    userID: currentUser.id,
                    imageURL: messageImageURL,
                    likes: data.likes,
                    liked: data.liked,
                    time: time,
                    date: Date.now(),
                    edited: true
                })
            })
            .then(res => res.json()) 
            .then(data => {
                formData.message = "";
                formData.imageURL = "";
                readMessages();        
            })    
            .catch(err => {
                console.error(err);
            })
            readMessages();
        }
        catch(err){ console.error(err) };
    };

    // Comments
    const createComment = async (e) => {
        e.preventDefault();
        console.log("createComment =>", formData.comment);
 
        // Add new comment to database
        let docRef;

        let date = new Date();
        let time = ( 
            date.getMonth()+ 1 ) + "/" + date.getDate() + "/" + date.getFullYear() + " " + (date.getHours() % 12 || 12) + ":" 
            + ( (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes() )
            + (date.getHours() >=12 ? "PM":"AM" );        
                
        let id = Math.floor(Math.random() * 10000000000000000);

        // Create comment with Node API
        fetch(`https://react-social-backend.up.railway.app/comments/create`, {
        // fetch(`http://localhost:4000/comments/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' , 
            },
            body: JSON.stringify({ 
                id: id,
                msgId: formData.msgId,
                userId: currentUser.id,
                userImg: formData.userId,
                userName: formData.userName,
                comment: formData.comment,
                time: time,
                date: Date.now() 
            })
        })
        .then(res => res.json()) 
        .then(data => {

            readMessages();
            // setImageUrl("");
            // setImageUrl(null);
            // setFile(null);
            showCommentID(!formData.msgId);
            setFormData("");
        })    
        .catch(err => {
            console.error(err);
        })
    };  

    // Update likes by message id
    const updateLikes = async (id) => {

        console.log(`${currentUser.id} liked`, id);

        fetch(`https://react-social-backend.up.railway.app/messages/read/${id}`)
        // fetch(`http://localhost:4000/messages/read/${id}`)
            .then(res => res.json()) 
            .then(data => {

                let liked;
                if( !data.liked.includes(currentUser.id)){
                    liked = data.liked.concat(currentUser.id + ',');
                    data.likes = parseInt(data.likes) + 1;
                }
                else{
                    liked = currentUser.id + ",";
                    data.likes = parseInt(data.likes) - 1;
                    liked = liked.replace(currentUser.id + ",", ",")
                }
                fetch(`https://react-social-backend.up.railway.app/messages/update/${id}`, {
                // fetch(`http://localhost:4000/messages/update/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' , 
                    },
                    body: JSON.stringify({ 
                        ...data,
                        likes: parseInt(data.likes),
                        liked: liked
                    })
                }) 
                .then(data => {
                    readMessages();
                })    
                .catch(err => {
                    console.error(err);
                })
            })    
            .catch(err => {
                console.error(err);
            })
    };

    // Upload new image to message
    const uploadFile = (e) => {
        e.preventDefault();

        const file = e.target.files[0];
        const storageRef = ref(storage, 'files/'+ file.name );

        uploadBytes(storageRef, file )
            .then( (snapshot) => {
                setError(false);
                getDownloadURL(snapshot.ref).then( (url) => {
                    if(showMenu){
                        setMessageImageUrl(url);
                        setImageUrl('');
                    }
                    else{
                        setImageUrl(url);
                        setMessageImageUrl('');
                    }
                    setFormData({...formData, image: url})
                });
                setImageUrl('');
            })
            .catch( (error) => {
                console.log("File error =>", error);
            })
    }


    const showCommentID = async (id) => {
        setCommentID(id);
    }

    // const sortMessages = () => {
    //     setSort(!sort);
    // }

    return(
        <div className="messages row text-left align-items-center p-lg-5 pt-lg-4 pb-lg-3 p-3 my-0">
            <h2 className="mx-0 px-0">News Feed 
                <span className="float-end">
                    <a href 
                        onClick={ (e) => { 
                            console.log("sort = ", sort);
                            setSort(!sort);
                        }}
                    >
                        <div style={{fontSize:"12px",transform:"translate(0,100%)"}}>
                            Sort <></>
                            <span style={{textDecoration:"underline", fontSize:"12px"}}>
                                { sort? "Newest": "Oldest"  }
                            </span>
                        </div>
                    </a>
                </span>
            </h2>
            
            
            {messages.slice(0, messagesCount).map( (message) => (

                <div className="message mb-3 mt-2 pb-2" id={message.id} key={message.id}>
                    <div className="col-lg-12 px-lg-2 pt-3 pb-2" >              
                        <img 
                            width="50" height="50" 
                            style={{borderRadius:'50%'}}
                            src={message.userImg} 
                            alt="new"
                        />
                        <span 
                            className="mx-2"
                            style={{fontWeight:"500"}}
                        >
                            {message.first} {message.last} 
                            {message.edited ? 
                                    <span style={{margin:"0px 5px", color:"#000f",fontSize:"12px", fontWeight:"400"}}>
                                        {message.time}
                                    </span>
                                    :
                                    <span style={{margin:"0px 5px", color:"#000f",fontSize:"12px", fontWeight:"200"}}>
                                        {message.time}
                                    </span>
                            }
                        </span>

                        { currentUser.email === message.email && 
                            <a href
                                className="msgMenu float-end"
                                id={message.id} 
                                onClick={ (e) => { 
                                    msgMenuClicked(message.id); 
                                }}
                            >    
                                <img 
                                    height="20" 
                                    className="mx-2 float-end" 
                                    style={{transform: "translate(0%,-15%)"}}
                                    src="./assets/Icon-dots-black.png" alt='new'
                                />
                            </a>
                        }
                        <br></br>

                        { message.imageURL &&
                            <a className="" href={message.imageURL} target="_blank" rel="noreferrer">
                                <img 
                                    width="100%" className='image my-2' 
                                    src={message.imageURL} alt=''
                                />
                            </a>
                        }
                        <br></br>
                        <div className="mx-1">
                            {message.message}<br></br>
                        </div>


                        {   currentUser.email === message.email &&
                            showMenuID === message.id &&
                            showMenu &&
                                <div>
                                    <input 
                                        style={{margin:'0px 0px 10px 0px'}}
                                        value={formData.message} 
                                        onChange={ function(event){ 
                                            setFormData({...formData, message: event.target.value}) 
                                        } }    
                                        type="textarea" 
                                        placeholder="Update your message"
                                    />
                                    <input 
                                        className="hide"
                                        style={{margin:'0px'}}
                                        value={messageImageURL} 
                                        onChange={ e => { 
                                            if( e.target.value )
                                                setFormData({...formData, imageURL: e.target.value}) 
                                            else
                                                setFormData({...formData, imageURL: message.imgURL}) 
                                        }}    
                                        type="textarea" placeholder="Image URL"
                                    />
                                    <input 
                                        style={{margin:'0px', border:'none'}}
                                        type="file"
                                        onChange={ (e) => { 
                                            setFile( e.target.files[0] );
                                            uploadFile(e);
                                        }}    
                                    /><br></br>
                                    {messageImageURL &&
                                        <div 
                                            className="thumb col-lg-12 text-left p-2">
                                            <img 
                                                onClick={ () => {
                                                    setFile(null); 
                                                    setMessageImageUrl('');
                                                }}
                                                width="25%" 
                                                src={messageImageURL} 
                                                alt="">
                                            </img>
                                            <br></br>
                                            <p style={{ fontSize:'10px', wordWrap: 'break-word'}}>
                                                {messageImageURL}
                                            </p>                         
                                        </div>
                                    } 
                                    <button 
                                        onClick={ () => { 
                                            editMessage(message.id);
                                        }} 
                                        style={{color:'#222f '}}
                                        className="app-btn">Update
                                    </button>
                                    <button 
                                        style={{color:'#ffff', background:'#f00f'}}
                                        onClick={ () => { deleteMessage(message.id) } } 
                                        className="btn-black">Delete
                                    </button>
                                </div>
                        }


                        <hr></hr>
                        <div className="icons row justify-content-around align-items-start">
                            <div className="col-4 text-start">
                                <a href
                                    id={message.id} 
                                    onClick={ (e) => {
                                        updateLikes(message.id);
                                    }} 
                                >
                                    { message.likes > 0? 
                                        <img height="20px" className="mx-1" src="./assets/Icon-thumb-lightblue.png" alt='new'/> 
                                        : 
                                        <img height="20px" className="mx-1" src="./assets/Icon-thumb-black.png" alt='new'/>
                                    } {message.likes}
                                </a>
                            </div>
                            <div className="col-4 text-center">
                                <a className="text-dark" href={message.imageURL} target="_blank" rel="noreferrer">
                                    <img height="20px" className="mx-1" src="./assets/Icon-share-black.png" alt='new'/>Share
                                </a>
                            </div>
                            <div className="my-1 col-4 text-end">
                                <a href
                                    onClick={ (e) => {
                                        console.log("Message =>", message.id);
                                        showCommentID(message.id);
                                    }} 
                                >
                                    <img height="1px" className="mx-1" src="./assets/Icon-comment-black.png" alt='new'/>
                                        <div className="d-none d-lg-inline-block">Comment</div>
                                </a>
                            </div>

                            { comments.map( (comment) => (
                                <div>
                                    { message.id === comment.msgId &&
                                    <commentContext.Provider value={{readMessages, currentUser, comment}}>
                                        <Comment/>
                                    </commentContext.Provider>
                                    }
                                </div>
                            )
                            )}
                            
                            { commentID === message.id && 
                                <div className="mx-auto">
                                    <form id='comment'>
                                        <input 
                                            className="mx-auto"
                                            style={{border:"1px solid #5555"}}
                                            value={formData.comment} 
                                            onChange={ (e) => { 
                                                setFormData({
                                                    ...formData, comment: e.target.value, userId: currentUser.imgURL, 
                                                    userName: currentUser.first +' '+ currentUser.last, 
                                                    msgId: message.id
                                                }) 
                                            }}    
                                            type="textarea" placeholder="Enter comment"
                                        />
                                        <input 
                                            onClick={createComment}
                                            className="mx-auto submit-btn" type="submit" value="Comment"
                                        />
                                    </form>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            ))} 


            <div className="create text-left my-2 mb-2">        
                <form id='form'>
                    <h3 className="mx-1">Message</h3>
                    <input 
                        value={formData.message} 
                        onChange={ (event) => { 
                            setFormData({...formData, message: event.target.value}) 
                            event.target.value ? setError(false) : setError(true)
                        } }    
                        type="textarea" placeholder="Type your message here"
                    />
                    <input 
                        className="hide"
                        value={imageURL} 
                        onChange={ (event) => { 
                            setFormData({...formData, imageURL: event.target.value}) 
                            event.target.value ? setError(false) : setError(true)
                        }}    
                        type="textarea" placeholder="Image URL"
                    /><br></br>
                    <input 
                        onChange={ (e) => { 
                            setFile( e.target.files[0] );
                            uploadFile(e);
                        }}    
                        type="file"
                    /><br></br>
                    {file &&
                        <div className="col-lg-12 text-left p-2">
                            <img 
                                onClick={ () => { setFile(null); setImageUrl(null); }}
                                width="50%" src={imageURL} alt=""></img>
                            <br></br>
                            {imageURL}                            
                        </div>
                    }
                    <input 
                        onClick={createMessage}
                        className="submit-btn" type="submit" value="Send"
                    />
                        { error ? <p className="text-danger mx-2"> Please enter a message</p> : '' }
                </form>
            </div>
            { (messagesCount < messages.length) &&
            <button 
                style={{padding:'10px 0px', 
                    color:"white", fontSize:'14px', 
                }}
                onClick={ () =>{ setMessagesCount( messagesCount + 2) }}
            >
                Load more...
            </button>
            }




        </div>
    )
}



