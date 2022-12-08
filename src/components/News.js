/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useState, useEffect, useContext } from 'react';
import { doc, query, where, addDoc, setDoc, getDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';
import { storage } from '../Firebase';

import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import {UserContext} from '../contexts/UserContext';

export default function News(){

    useEffect( () => {
        searchNews();
    }, []);

    // User authentication
    const {currentUser, login, logout} = useContext(UserContext);
    const [formData, setFormData] = useState({});
    
    const [articles, setArticles] = useState([]);
    const [numArticles, setNumArticles]= useState(4);
    const [maxArticles, setMaxArticles]= useState(0);

    // Create user additional profile data in users db
    const searchNews = async (e) => {
        //e.preventDefault();

        // NY Times API
        // all, arts, automobiles, books, business, fashion, food, health, home, insider, magazine, movies, nyregion,
        // opinion, politics, realestate, science, sports, sundayreview, technology, theater, t-magazine, 
        // travel, upshot, us, world

        let url;
        url = "https://api.nytimes.com/svc/topstories/v2/us.json?api-key=l0pE8ZYsNeEx6MAKnAyKmNnxJrOhAfCB"
        url = "https://api.nytimes.com/svc/topstories/v2/technology.json?api-key=l0pE8ZYsNeEx6MAKnAyKmNnxJrOhAfCB"
        url = "https://api.nytimes.com/svc/news/v3/content/nyt/all.json?api-key=l0pE8ZYsNeEx6MAKnAyKmNnxJrOhAfCB";

        // url = "http://localhost:5000/news";

        try{
            await fetch(url)
                .then( response => response.json() )
                .then( data => {
                    console.log("NY Times data => ", data) 

                    setArticles(data.results);
                    setMaxArticles(data.num_results);
                });
        }catch(error){
            console.log(error);
        }
    }

    return(
            <div 
                className="row justify-content-lg-between align-items-start p-lg-4 p-2 text-white"
                style={{
                    margin:'25px 0px', 
                    color:'#ffff', 
                    background: '#0007',
                    borderRadius: '2px',
                }}
            >
                <div className="col-lg-12 text-left px-3">
                    <h2>NY Times    
                        <p>Top Headlines
                        <span>
                            <button 
                                className="text-decoration-underline text-white float-end"
                                onClick={ () => { setNumArticles(maxArticles) }}
                            >
                            See all articles
                            </button>
                        </span>    
                        </p>               

                    </h2>
                    <hr></hr>  
                </div>

                <div className="row text-left px-4">
                        { articles.slice(0, numArticles).map( (article, index ) =>  
                                <div className="col-xl-5" key={index}>
                                    <a 
                                        className="text-white" 
                                        href={article.url} 
                                        target="_blank"
                                        style={{fontSize:'15px'}}
                                    >
                                        <img 
                                            height="125" 
                                            className="my-2" 
                                            src={article.multimedia !== null ? article.multimedia[2].url :''} alt=""
                                        ></img><br></br>

                                        <strong >{article.title}</strong>
                                    </a><br></br><br></br>

                                    <p style={{fontSize:'12px'}}>{article.abstract}</p>
                                </div>
                            )}
                </div>


                <button 
                    className="submit-btn"
                    style={{padding:'11px 0px', fontSize:'14px'}}
                    onClick={ () =>{ setNumArticles( numArticles + 2) }}
                >
                    Load more...
                </button>
                <hr></hr>  

            </div>
    )
}



