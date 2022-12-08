/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { doc, where, query, addDoc, setDoc, getDoc, getDocs, deleteDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../Firebase';
import { storage } from '../Firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import {UserContext} from '../contexts/UserContext';

export default function Messages(){

    // User authentication
    const {currentUser, login, logout } = useContext(UserContext);

    const [messagesCount, setMessagesCount] = useState(4);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(false);
    const [edited, setEdited] = useState(false);
    const [sort, setSort] = useState(false);

    const [showMenuID, setShowMenuID] = useState(null);
    const [showMenu, setShowMenu] = useState(false);

    const [users, setUsers] = useState("");
    const [userImage, setUserImage] = useState();


    const [showComment, setShowComment] = useState(false);
    const [commentIDS, setCommentIDS] = useState([]);
    const [commentID, setCommentID] = useState(0);
    const [comments, setComments] = useState([]);

    const [formData, setFormData] = useState({
        message: '',
        comment: '',
        imageURL: ''
    });

    // const fileRef = useRef(null);
    const [file, setFile] = useState("");
    const [imageURL, setImageUrl] = useState(null);
    const [imageURLEdit, setImageUrlEdit] = useState(null);
    const [msgUser, setMsgUser] = useState(null);
    const [comment, setComment] = useState(null);
    const [time, setTime] = useState("");

    const [likes, setLikes] = useState(0);
    const [likeID, setLikeID] = useState();

    useEffect(() => {
        readUsers();
        readMessages();
    },[]);

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

    //Read messages from Firebase
    const readMessages = async () => {
        let data;
        try{
            data = await getDocs( collection(db, 'messages') );
            setMessages( 
                data.docs.map( (doc) => 
                    ({ ...doc.data() }) 
                ) 
                .sort( (a, b) => {
                    console.log("readMessages() sort => ", sort);
                    if(sort)
                        return (b.likes - a.likes)
                    return (b.date - a.date)
                })
            );
        }catch(error){ console.log(error); }

        try{
            data = await getDocs( collection(db, 'comments') );
            setComments( 
                data.docs.map( (doc) => 
                    ({ ...doc.data() }) 
                ) 
                .sort( (a,b) => {
                    return (a.date - b.date)
                })
            );
        }catch(error){ console.log(error); }
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
        let docRef;
        try{
            docRef = await addDoc( collection(db, 'messages'), {});
            console.log('id => '+ docRef.id);
            readMessages();
        }catch(error){
            console.log(error);
        }
        try{
            await setDoc( doc(db, 'messages', docRef.id.toString()), {
                id: docRef.id,
                email: currentUser.email,
                first: currentUser.first,
                last: currentUser.last,
                message: formData.message,
                userImg: currentUser.imgURL,
                userID: currentUser.id,
                imageURL: imageURL,
                likes: 0,
                time: time,
                date: date
            })
            readMessages();
            setImageUrl("");
            setImageUrl(null);
            setFile(null);
        }catch(error){
            console.log(error);
        }
    };  

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
                
        try{
            docRef = await addDoc( collection(db, 'comments'), {});
            console.log('id => '+ docRef.id);
            readMessages();
        }catch(error){
            console.log(error);
        }
        try{
            await setDoc( doc(db, 'comments', docRef.id.toString()), {
                id: docRef.id,
                msgId: formData.msgId,
                userId: currentUser.id,
                userImg: formData.userId,
                userName: formData.userName,
                comment: formData.comment,
                time: time,
                date: date 
            })
            readMessages();
            // setShowComment(!showComment);
            setFormData({...formData, comment:''});
            setCommentID(0);
        }catch(error){
            console.log(error);
        }
    };  

    const deleteComment = async (id) => {
        console.log('deleteComment(id) => ' + id);
        // setShowMenu( !showMenu );

        try{
            await deleteDoc( doc(db, 'comments', id) );
            readMessages();
        }catch(error){
            console.log(error);
        }
    };

    const deleteMessage = async (id) => {
        setShowMenu( !showMenu );
        try{
            await deleteDoc( doc(db, 'messages', id) );
            readMessages();
            setImageUrl("");

        }catch(error){
            console.log(error);
        }
    };

    // Clear all forms 
    const clearForms = () => {
    }

    // Edit message by message ID
    const editMessage = async (id) => {
        setShowMenu( !showMenu );

        let data = await doc( db, 'messages', id );
        const docSnap = await getDoc(data);

        let date = new Date();
        let time = ( 
            date.getMonth()+ 1 ) + "/" + date.getDate() + "/" + date.getFullYear() + " " + (date.getHours() % 12 || 12) + ":" 
            + ( (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes() )
            + (date.getHours() >=12 ? "PM":"AM" );        

        // if( docSnap.data().imageURL ){
            setImageUrl( docSnap.data().imageURL );
        // }
        try{
            await setDoc( doc(db, 'messages', id ), {
                ...docSnap.data(),
                message: formData.message,
                imageURL: imageURL,
                time: time,
                date: date,
                edited: true
            })
            readMessages();
            setImageUrl("");            
        }catch(error){
            console.log(error);
        }
    };

    // Update likes by message id
    const updateLikes = async (id) => {
        console.log('updateMessage(id) likes =>', id);

        try{
            let data = await doc( db, 'messages', id );
            const docSnap = await getDoc(data);

            let newLikes = docSnap.data().likes + 1; 
            try{
                await setDoc( doc(db, 'messages', id ), {
                    ...docSnap.data(),
                    likes: newLikes
                })
                readMessages();
            }catch(error){
                console.log(error);
            }
            readMessages();
        }catch(error){
            console.log(error);
        }
    };

    // Upload new image to message
    const uploadFile = (e) => {
        e.preventDefault();

        const file = e.target.files[0];
        const storageRef = ref(storage, 'files/'+ file.name );

        uploadBytes(storageRef, file )
            .then( (snapshot) => {
                console.log('snapshot =>', snapshot);
                setError(false);

                getDownloadURL(snapshot.ref).then( (url) => {
                    console.log('File URL =>', url);
                    setImageUrl(url);
                    setFormData({...formData, image: url})
                });
                setImageUrl('');
            })
            .catch( (error) => {
                console.log("File error =>", error);
            })
    }

    const msgMenuClicked = async (e) => {
        setShowMenuID(e.currentTarget.id);
        setShowMenu( !showMenu );

        let data = await doc( db, 'messages', e.currentTarget.id );
        const docSnap = await getDoc(data);

        setFile(docSnap.data().imageURL); 
        setImageUrl( docSnap.data().imageURL );
        setFormData({...formData, imageURL: docSnap.data().imageURL});
    }

    const showCommentID = async (id) => {
        setCommentID(id);
    }

    return(
        <div className="messages row text-left align-items-center p-lg-5 pt-lg-4 pb-lg-3 p-3 my-0">
            <h2 className="mx-2">News Feed 
                <span className="float-end">
                    <a href 
                        onClick={ (e) => { 
                            console.log("sort = ", sort);
                            readMessages();
                            setSort(!sort);
                        }}
                    >
                        <div    
                            style={{fontSize:"12px",transform:"translate(0,100%)"}}>
                            Sort <></>
                            { sort ?
                                    <span style={{textDecoration:"underline", fontSize:"12px"}}>Date</span> :
                                    <span style={{textDecoration:"underline", fontSize:"12px"}}>Likes</span> 
                            }
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
                            src={readUser(message.userID)} 
                            alt="new"
                        />
                        <span 
                            className="mx-2"
                            style={{fontWeight:"500"}}
                        >
                            {message.first} {message.last} 

                            {   message.edited ? 
                                    <span style={{margin:"0px 5px", color:"#000f",fontSize:"12px", fontWeight:"300"}}>
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
                                    msgMenuClicked(e); 
                                    // setShowMenu(!showMenu);
                                    formData.message = message.message;
                                }}
                            >    
                                <img 
                                    height="20" 
                                    className="mx-2 float-end" 
                                    style={{transform: "translate(0%,-15%)"}}
                                    src="./assets/Icon-dots-black.png" alt='new'
                                />
                                { showMenu && <div id={message.id}></div> }
                            </a>
                        }
                        <br></br>

                        {   message.imageURL &&
                            <a href={message.imageURL} target="_blank" rel="noreferrer">
                                <img width="100%" className='image my-2' src={message.imageURL} alt=''/>
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
                                        type="textarea" placeholder="Update your message"
                                    />
                                    <input 
                                        className="hide"
                                        style={{margin:'0px'}}
                                        value={formData.imageURL} 
                                        onChange={ function(event){ 
                                            if( event.target.value )
                                                setFormData({...formData, imageURL: event.target.value}) 
                                            else
                                                setFormData({...formData, imageURL: message.imgURL}) 
                                        } }    
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
                                    {file &&
                                        <div 
                                            className="thumb col-lg-12 text-left p-2">
                                            <img 
                                                onClick={ () => {
                                                    setFile(null); 
                                                    setImageUrl('');
                                                }}
                                                width="25%" src={imageURL} alt=""></img>
                                            <br></br>
                                            <p style={{ fontSize:'10px', wordWrap: 'break-word'}}>
                                                {imageURL}
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
                                    { message.likes ? 
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
                                        <div 
                                            className="comment row justify-content-start align-items-start mx-auto my-2 p-1"
                                            style={{width:"100%", background:"#0001"}}
                                        >
                                            <div className="col-xl-1 col-2">  
                                                <img    
                                                    height="30" className="m-2" 
                                                    style={{borderRadius:'50%', transform:"translate(-40%, 0%)"}}
                                                    src={readUser(comment.userId)} 
                                                    alt="new"
                                                />
                                                
                                            </div>
                                            <div className="col-xl-11 col-10 my-2"> 
                                                <div style={{fontWeight:"500"}}>
                                                    {comment.userName}
                                                    <span style={{margin:"0px 5px", fontSize:"10px", fontWeight:"300"}}>{comment.time}</span>
                                                </div>
                                                {comment.comment}<br></br>
                                                
                                                { currentUser.id === comment.userId &&
                                                    <a href
                                                        className="delete text-dark"
                                                        onClick={ () => { deleteComment(comment.id) } } 
                                                    >X</a>
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                            )
                            )}


                            { 
                                // commentID === message.id && commentIDS[message.id] &&
                                // commentID === message.id && showComment &&
                                commentID === message.id && 

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
                        } }    
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



