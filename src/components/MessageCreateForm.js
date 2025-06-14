import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

export default function MessageCreateForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        message: '',
        imageURL: ''
    });
    const [error, setError] = useState(false); const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.message.trim()) {
            setError(true);
            return;
        }

        try {
            const result = await onSubmit(formData);

            // Only clear form if message was successfully created
            if (result && result.success) {
                setFormData({ message: '', imageURL: '' });
                setError(false);
            } else {
                console.error('Failed to create message:', result?.error);
            }
        } catch (error) {
            console.error('Error submitting message:', error);
        }
    };

    const handleMessageChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, message: value });
        setError(!value.trim());
    };

    const handleImageUpload = (imageURL) => {
        setFormData({ ...formData, imageURL });
    };

    return (
        <div className="create text-left my-2 mb-2">
            <form onSubmit={handleSubmit}>
                <h3 className="mx-1">Message</h3>

                <input
                    value={formData.message}
                    onChange={handleMessageChange}
                    type="text"
                    placeholder="Type your message here"
                    required
                />

                <ImageUpload
                    currentImageURL={formData.imageURL}
                    onImageUpload={handleImageUpload}
                />

                <input
                    type="submit"
                    value="Send"
                    className="submit-btn"
                />
            </form>
        </div>
    );
}
