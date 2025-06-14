import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useMessages } from '../hooks/useMessages';

import MessageItem from './MessageItem';
import MessageCreateForm from './MessageCreateForm';

export default function Messages() {
    const { currentUser } = useContext(UserContext);
    const {
        messages,
        readMessages, createMessage, updateMessage, deleteMessage, updateLikes
    } = useMessages(currentUser);

    const [sortOrder, setSortOrder] = useState(false);
    const [messagesCount, setMessagesCount] = useState(4);
    const [commentInputID, setCommentInputID] = useState(0);

    useEffect(() => {
        readMessages(sortOrder);
    }, [sortOrder]);    // Create, Read, Update, Delete messages    
    const handleCreateMessage = async (messageData) => {
        const result = await createMessage(messageData);
        return result; // Return the result so the form can handle success/failure
    };
    const handleEditMessage = async (messageId, updatedData) => {
        const result = await updateMessage(messageId, updatedData);
    };
    const handleDeleteMessage = async (messageId) => {
        const result = await deleteMessage(messageId);
    };

    // Toggle like status and update likes count up or down only 1 time per user
    const handleLikeMessage = async (messageId) => {
        const result = await updateLikes(messageId);
    };

    // Toggle comment form visibility 
    const handleComment = (messageId) => {
        setCommentInputID(commentInputID === messageId ? 0 : messageId);
    };

    const handleLoadMore = () => {
        setMessagesCount(messagesCount + 2);
    };

    const handleSortChange = (newSortOrder) => {
        setSortOrder(newSortOrder);
    };

    return (
        <div className="messages row text-left align-items-center p-lg-5 pt-lg-4 pb-lg-3 p-3 my-0">
            {/* News header with Sort Control */}
            <h2 className="mx-0 px-0">
                News Feed <span className="float-end">
                    <a
                        href="#"
                        style={{ color: "white", textDecoration: "none" }}
                        onClick={(e) => {
                            e.preventDefault();
                            handleSortChange(!sortOrder);
                        }}
                    >
                        <div style={{ fontSize: "12px", transform: "translate(0,100%)", color: "white" }}>
                            Sort{' '}
                            <span style={{ textDecoration: "underline", fontSize: "12px", color: "white" }}>
                                {sortOrder ? "Newest" : "Oldest"}
                            </span>
                        </div>
                    </a>
                </span>
            </h2>

            {/* Display all messages posted */}
            {messages.slice(0, messagesCount).map((message) => (
                <MessageItem
                    key={message.id}
                    message={message}
                    currentUser={currentUser}
                    onDelete={handleDeleteMessage}
                    onEdit={handleEditMessage}
                    onLike={handleLikeMessage}
                    onComment={handleComment}
                    showCommentInput={commentInputID === message.id}
                />
            ))}

            {/* Create new message form */}
            <MessageCreateForm onSubmit={handleCreateMessage} />

            {/* Load more messagges */}
            {messagesCount < messages.length && (
                <button
                    style={{
                        padding: '10px 0px',
                        color: "white",
                        fontSize: '14px',
                    }}
                    onClick={handleLoadMore}
                >
                    Load more...
                </button>
            )}
        </div>
    );
}
