import '../App.scss';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { doc, where, query, addDoc, setDoc, getDoc, getDocs, deleteDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../Firebase';
import { storage } from '../Firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import { UserContext } from '../contexts/UserContext';

export default function Email() {

    // User authentication
    const { currentUser, login, logout } = useContext(UserContext);
    const [error, setError] = useState(false);

    const [formData, setFormData] = useState({
        email: 'bmp713@yahoo.com',
        subject: 'SendGrid email message',
        message: 'This is a message sent from React.',
    });

    // POST email to express server
    const sendGridEmail = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.subject || !formData.email) {
            setError(true);
            return;
        }
        try {
            // let url = "http://localhost:5000/email";
            url = "https://node-react7l-api.herokuapp.com/email";

            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    from: currentUser.email,
                    subject: formData.subject,
                    message: formData.message
                })
            });
            console.log("formData =>", formData);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div
            className="email text-left align-items-center p-lg-5 p-4"
            style={{ margin: "25px auto" }}
        >
            <div className="text-left">
                <form id='form'>
                    <h3 className="">Send Email</h3>
                    <input
                        value={formData.email}
                        type="textarea" placeholder="Type recipient email"
                        onChange={event => setFormData({ ...formData, email: event.target.value })}
                    />
                    <input
                        value={formData.subject}
                        type="textarea" placeholder="Type subject here"
                        onChange={event => setFormData({ ...formData, subject: event.target.value })}
                    />
                    <input
                        value={formData.message}
                        type="textarea" placeholder="Type message here"
                        onChange={event => setFormData({ ...formData, message: event.target.value })}
                    />
                    <input
                        className="submit-btn" type="submit" value="Send"
                        onClick={sendGridEmail}
                    /><br></br>
                    {error ? <p className="text-danger mx-2"> Please enter a message</p> : ''}
                </form>
            </div>
        </div>
    )
}



