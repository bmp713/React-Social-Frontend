import '../App.scss';
import React, { useState, useEffect } from 'react';

export default function Comment({ msgId, currentUser, showInput = true }) {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");

    // Read comments when msgId changes
    useEffect(() => {
        if (msgId) readComments();
    }, [msgId]);

    // Fetch comments for this message
    const readComments = async () => {
        try {
            const response = await fetch(`https://react-social-backend.up.railway.app/comments/read`)
            // const response = await fetch(`http://localhost:4000/comments/read`);
            const data = await response.json();
            setComments(data.filter(comment => comment.msgId === msgId));
        } catch (err) {
            console.error('Error reading comments:', err);
        }
    };    // Create a new comment
    const createComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            let date = new Date();
            let time = (
                date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + (date.getHours() % 12 || 12) + ":"
                + ((date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes())
                + (date.getHours() >= 12 ? "PM" : "AM");
            let id = Math.floor(Math.random() * 10000000000000000);

            const newComment = {
                id: id,
                msgId: msgId,
                userId: currentUser.id,
                userImg: currentUser.imgURL,
                userName: currentUser.first + ' ' + currentUser.last,
                comment: commentText,
                time: time,
                date: Date.now()
            };

            // Optimistically add the comment to UI immediately
            setComments(prevComments => [...prevComments, newComment]);
            setCommentText("");

            const response = await fetch(`https://react-social-backend.up.railway.app/comments/create`, {
                // const response = await fetch(`http://localhost:4000/comments/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newComment)
            });

            if (!response.ok) {
                await readComments();
            } else {
                const responseData = await response.json();
            }
        } catch (err) {
            console.error('Error creating comment:', err);
            // If there was an error, refresh comments from server
            await readComments();
        }
    };

    // Delete a comment
    const deleteComment = async (id) => {
        try {
            setComments(prevComments => prevComments.filter(comment => comment.id !== id));

            const response = await fetch(`https://react-social-backend.up.railway.app/comments/delete/${id}`, {
                // const response = await fetch(`http://localhost:4000/comments/delete/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                await readComments();
            }
        } catch (err) {
            console.error('Error deleting comment:', err);
            await readComments();
        }
    };

    useEffect(() => {
        if (msgId) readComments();
    }, [msgId]);

    return (
        <div className="comment-section">
            {comments.map(comment => (
                <div
                    className="comment row justify-content-start align-items-start mx-auto my-2 p-1"
                    style={{ width: "100%", background: "#0001" }}
                    key={comment.id}
                >
                    <div className="col-xl-1 col-2">
                        <img
                            height="30" className="m-2"
                            style={{ borderRadius: '50%', transform: "translate(-40%, 0%)" }}
                            src={comment.userImg}
                            alt="new"
                        />
                    </div>
                    <div className="col-xl-11 col-10 my-2">
                        <div style={{ fontWeight: "500" }}>
                            {comment.userName}
                            <span style={{ margin: "0px 5px", fontSize: "10px", fontWeight: "300" }}>{comment.time}</span>
                        </div>
                        {comment.comment}<br />
                        {currentUser && currentUser.id === comment.userId &&
                            <a
                                href="#"
                                className="delete text-dark"
                                onClick={e => { e.preventDefault(); deleteComment(comment.id); }}
                            >X</a>
                        }
                    </div>
                </div>
            ))}
            {showInput && (
                <form onSubmit={createComment} className="comment-form">
                    <input
                        className="mx-auto"
                        style={{ border: "1px solid #5555" }}
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        type="textarea"
                        placeholder="Enter comment"
                    />
                    <input
                        className="mx-auto submit-btn"
                        type="submit"
                        value="Comment"
                    />
                </form>
            )}
        </div>
    );
}



