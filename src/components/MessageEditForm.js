import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';

export default function MessageEditForm({ message, onSave, onCancel, onDelete }) {
    const [formData, setFormData] = useState({
        message: message.message || '',
        imageURL: message.imageURL || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleImageUpload = (imageURL) => {
        setFormData({ ...formData, imageURL });
    };

    return (
        <div className="edit-form">
            <form onSubmit={handleSubmit}>
                <input
                    style={{ margin: '0px 0px 10px 0px' }}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    type="text"
                    placeholder="Update your message"
                />

                <ImageUpload
                    currentImageURL={formData.imageURL}
                    onImageUpload={handleImageUpload}
                />

                <div className="form-actions">
                    <button
                        type="submit"
                        style={{ color: '#222f' }}
                        className="btn-black"
                    >
                        Update
                    </button>

                    <button
                        type="button"
                        style={{ color: '#f000', background: '#f000', border: "2px solid #000f" }}
                        onClick={onDelete}
                        className="app-btn"
                    >
                        Delete
                    </button>
                </div>
            </form>
        </div>
    );
}
