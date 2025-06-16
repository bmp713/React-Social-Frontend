import { useState, useEffect } from 'react';

export const useMessages = (currentUser) => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    // Format timestamps for messages
    const formatDate = () => {
        const date = new Date();
        return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " +
            (date.getHours() % 12 || 12) + ":" +
            ((date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()) +
            (date.getHours() >= 12 ? "PM" : "AM");
    };

    // Read messages from API
    const readMessages = async (sortOrder = false) => {
        try {
            const response = await fetch(`https://react-social-backend.up.railway.app/messages/read`);
            // const response = await fetch(`http://localhost:4000/messages/read`);
            const data = await response.json();

            const sortedData = data.sort((a, b) => {
                return sortOrder ? (a.date - b.date) : (b.date - a.date);
            });

            setMessages(sortedData);
        } catch (err) {
            setError(err.message);
            console.error('Error reading messages:', err);
        }
    };

    const createMessage = async (messageData) => {
        try {
            const id = Math.floor(Math.random() * 10000000000000000);
            const time = formatDate();
            const response = await fetch(`https://react-social-backend.up.railway.app/messages/create`, {
                // const response = await fetch(`http://localhost:4000/messages/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                    email: currentUser.email,
                    first: currentUser.first,
                    last: currentUser.last,
                    message: messageData.message,
                    userImg: currentUser.imgURL,
                    userID: currentUser.id,
                    imageURL: messageData.imageURL || '',
                    likes: 0,
                    liked: ",",
                    time: time, date: Date.now()
                })
            });

            if (response.ok) {
                await readMessages();
                return { success: true };
            } else {
                const errorData = await response.text();
                return { success: false, error: `Server error: ${response.status} - ${errorData}` };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const updateMessage = async (messageId, updatedData) => {
        try {
            const response = await fetch(`https://react-social-backend.up.railway.app/messages/read/${messageId}`);
            // const response = await fetch(`http://localhost:4000/messages/read/${messageId}`);
            const currentData = await response.json();

            const time = formatDate();
            const updateResponse = await fetch(`https://react-social-backend.up.railway.app/messages/update/${messageId}`, {
                // const updateResponse = await fetch(`http://localhost:4000/messages/update/${messageId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...currentData,
                    message: updatedData.message !== undefined ? updatedData.message : currentData.message,
                    imageURL: updatedData.imageURL !== undefined ? updatedData.imageURL : currentData.imageURL,
                    time: time,
                    date: Date.now(),
                    edited: true
                })
            });

            if (updateResponse.ok) {
                await readMessages();
                return { success: true };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const deleteMessage = async (messageId) => {
        try {
            const response = await fetch(`https://react-social-backend.up.railway.app/messages/delete/${messageId}`, {
                // const response = await fetch(`http://localhost:4000/messages/delete/${messageId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await readMessages();
                return { success: true };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const updateLikes = async (messageId) => {
        try {
            const response = await fetch(`https://react-social-backend.up.railway.app/messages/read/${messageId}`);
            // const response = await fetch(`http://localhost:4000/messages/read/${messageId}`);
            const data = await response.json();

            let liked;
            let newLikes;

            if (!data.liked.includes(currentUser.id)) {
                liked = data.liked.concat(currentUser.id + ',');
                newLikes = parseInt(data.likes) + 1;
            } else {
                liked = data.liked.replace(currentUser.id + ",", "");
                newLikes = parseInt(data.likes) - 1;
            }

            const updateResponse = await fetch(`https://react-social-backend.up.railway.app/messages/update/${messageId}`, {
                // const updateResponse = await fetch(`http://localhost:4000/messages/update/${messageId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    likes: newLikes,
                    liked: liked
                })
            });

            if (updateResponse.ok) {
                await readMessages();
                return { success: true };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    return {
        messages,
        error,
        readMessages,
        createMessage,
        updateMessage,
        deleteMessage,
        updateLikes
    };
};
