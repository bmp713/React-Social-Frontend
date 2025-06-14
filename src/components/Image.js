import '../App.scss';
import React, { useState, useEffect, useContext } from 'react';
import { doc, query, where, addDoc, setDoc, getDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';
import { storage } from '../Firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import { UserContext } from '../contexts/UserContext';

//AIzaSyA5JEadZzVUBGMrn0dygRdx5t-5uqAuBKo 

export default function Image() {

    // User authentication
    const { currentUser, login, logout } = useContext(UserContext);

    const [error, setError] = useState(false);
    const [formData, setFormData] = useState({});
    const [formMsg, setFormMsg] = useState()

    const [docID, setDocID] = useState(null);

    // const fileRef = useRef(null);
    const [file, setFile] = useState("");
    const [imageURL, setImageUrl] = useState(currentUser.imgURL);

    useEffect(() => {
    }, []);

    // Create user additional profile data in users db
    const updateUserImage = async (imageURL) => {

        console.log("updateUserImage URL =>", imageURL);

        try {
            let docs = query(collection(db, "users"), where("id", "==", currentUser.id));
            let data = await getDocs(docs);

            data.forEach((doc) => {
                console.log("updateUserImage() doc.data() =>", doc.data());
            });

            try {
                await setDoc(doc(db, 'users', currentUser.id), {
                    ...currentUser,
                    imgURL: imageURL
                })
                currentUser.imgURL = imageURL;

                window.location.reload();
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log("readProfile(error) => " + error);
        }
    };

    // Upload new profile image to Firebase
    const uploadFile = (e) => {
        setFormMsg(false);

        const file = e.target.files[0];
        const storageRef = ref(storage, 'files/' + file.name);

        uploadBytes(storageRef, file)
            .then((snapshot) => {
                console.log('Uploaded file');
                console.log('snapshot =>', snapshot);
                setError(false);

                getDownloadURL(snapshot.ref).then((url) => {
                    console.log('File URL =>', url);
                    setImageUrl(url);
                    setFormData({ ...formData, image: url });
                    updateUserImage(url);
                });
            })
            .catch((error) => {
                console.log("File error =>", error);
            })
    }

    return (
        <form id='form'>
            <label for="image">
                <img
                    width="40" height="40" className="my-2 mx-3"
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                    src={currentUser.imgURL}
                    alt="new"
                />
                <input
                    id="image" type="file"
                    style={{ width: "100%", display: "none" }}
                    onChange={(e) => {
                        setFile(e.target.files[0]);
                        uploadFile(e);
                    }}
                />
            </label>
        </form>
    )
}



