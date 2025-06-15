import React, { useState } from 'react';
import MessageActions from './MessageActions';
import MessageEditForm from './MessageEditForm';
import Comment from './Comment';

export default function MessageItem({
    message,
    currentUser, onLike,
    onDelete,
    onEdit,
    onComment,
    showCommentInput = false
}) {
    const [showMenu, setShowMenu] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    const handleMenuClick = () => {
        setShowMenu(!showMenu);
        setShowEditForm(true);
    };

    const handleEdit = (updatedData) => {
        onEdit(message.id, updatedData);
        setShowMenu(false);
        setShowEditForm(false);
    };

    const handleDelete = () => {
        onDelete(message.id);
        setShowMenu(false);
    };

    return (
        <div className="message mb-3 mt-2 pb-2" id={message.id}>
            <div className="col-lg-12 px-lg-2 pt-3 pb-2">
                {/* User header */}
                <img
                    width="50" height="50"
                    style={{ borderRadius: '50%' }}
                    src={message.userImg}
                />
                <span className="mx-2" style={{ fontWeight: "500" }}>
                    {message.first} {message.last}
                    <span style={{
                        margin: "0px 5px",
                        color: "#000f",
                        fontSize: "12px",
                        fontWeight: message.edited ? "400" : "200"
                    }}>
                        {message.time}
                    </span>
                </span>

                {/* Menu button for message author only */}
                {currentUser.email === message.email && (
                    <a
                        href="#"
                        className="msgMenu float-end"
                        onClick={(e) => {
                            e.preventDefault();
                            handleMenuClick();
                        }}
                    >
                        <img
                            height="20"
                            className="mx-2 float-end"
                            style={{ transform: "translate(0%,-15%)" }}
                            src="./assets/Icon-dots-black.png"
                            alt="menu"
                        />
                    </a>
                )}

                <br />

                {/* Message image */}
                {message.imageURL && (
                    <a href={message.imageURL} target="_blank" rel="noreferrer">
                        <img
                            width="100%"
                            className='image my-2'
                            src={message.imageURL}
                            alt="message attachment"
                        />
                    </a>
                )}

                {/* Message body */}
                <div className="mx-1">
                    {message.message}<br />
                </div>

                {/* Message edit form */}
                {showMenu && showEditForm && (
                    <MessageEditForm
                        message={message}
                        onSave={handleEdit}
                        onCancel={() => {
                            setShowMenu(false);
                            setShowEditForm(false);
                        }}
                        onDelete={handleDelete}
                    />
                )}
                <hr />
                {/* Message action buttons */}
                <MessageActions
                    message={message}
                    onLike={() => onLike(message.id)}
                    onShare={() => window.open(message.imageURL, '_blank')}
                    onComment={() => onComment(message.id)}
                />
                <Comment msgId={message.id} currentUser={currentUser} showInput={showCommentInput} />
            </div>
        </div>
    );
}
