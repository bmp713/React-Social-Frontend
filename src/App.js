import './App.scss';
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

import { UserProvider } from './contexts/UserContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Reset from './pages/Reset';
import Footer from './components/Footer';

export default function App() {
    return (
        <UserProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route exact path='/' element={<Login />} />
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/reset' element={<Reset />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </UserProvider>
    );
}



