import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from '../Firebase';

export default function ImageUpload({ currentImageURL, onImageUpload }) {
    const [file, setFile] = useState(null);
    const [imageURL, setImageURL] = useState(currentImageURL || '');
    const [uploading, setUploading] = useState(false);

    // Update internal state when prop changes (for form clearing)
    useEffect(() => {
        setImageURL(currentImageURL || '');
        if (!currentImageURL) {
            setFile(null);
        }
    }, [currentImageURL]);

    const handleFileUpload = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setUploading(true);
        setFile(selectedFile);

        try {
            const storageRef = ref(storage, 'files/' + selectedFile.name);
            const snapshot = await uploadBytes(storageRef, selectedFile);
            const url = await getDownloadURL(snapshot.ref);

            setImageURL(url);
            onImageUpload(url);
        } catch (error) {
            console.error("File upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setFile(null);
        setImageURL('');
        onImageUpload('');
    };

    return (
        <div className="image-upload">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                style={{ margin: '10px 0', border: 'none' }}
            />

            {uploading && (
                <p>Uploading image...</p>
            )}

            {imageURL && (
                <div className="image-preview col-lg-12 text-left p-2">
                    <img
                        onClick={handleRemoveImage}
                        width="50%"
                        src={imageURL}
                        alt="Preview"
                        style={{ cursor: 'pointer' }}
                        title="Click to remove image"
                    />
                    <br />
                    <p style={{ fontSize: '10px', wordWrap: 'break-word' }}>
                        {imageURL}
                    </p>
                    <small>Click image to remove</small>
                </div>
            )}

            {/* Hidden input for direct URL entry if needed */}
            <input
                className="hide"
                value={imageURL}
                onChange={(e) => {
                    setImageURL(e.target.value);
                    onImageUpload(e.target.value);
                }}
                type="text"
                placeholder="Image URL"
                style={{ display: 'none' }}
            />
        </div>
    );
}
