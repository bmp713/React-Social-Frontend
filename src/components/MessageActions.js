import React from 'react';

export default function MessageActions({ message, onLike, onShare, onComment }) {
    return (
        <div className="icons row justify-content-around align-items-start">
            <div className="col-4 text-start">
                <a href="#" onClick={(e) => { e.preventDefault(); onLike(); }}>
                    {message.likes > 0 ? (
                        <img
                            height="20px"
                            className="mx-1"
                            src="./assets/Icon-thumb-lightblue.png"
                            alt="liked"
                        />
                    ) : (
                        <img
                            height="20px"
                            className="mx-1"
                            src="./assets/Icon-thumb-black.png"
                            alt="like"
                        />
                    )}
                    {message.likes}
                </a>
            </div>

            <div className="col-4 text-center">
                <a
                    className="text-dark"
                    href="#"
                    onClick={(e) => { e.preventDefault(); onShare(); }}
                >
                    <img
                        height="20px"
                        className="mx-1"
                        src="./assets/Icon-share-black.png"
                        alt="share"
                    />
                    Share
                </a>
            </div>

            <div className="my-1 col-4 text-end">
                <a href="#" onClick={(e) => { e.preventDefault(); onComment(); }}>
                    <img
                        height="1px"
                        className="mx-1"
                        src="./assets/Icon-comment-black.png"
                        alt="comment"
                    />
                    <div className="d-none d-lg-inline-block">Comment</div>
                </a>
            </div>
        </div>
    );
}
