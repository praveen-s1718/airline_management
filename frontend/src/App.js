import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import FlightBooking from './components/FlightBooking';
import Flightselect from './Flightselect';
import LoginPage from './LoginPage';
import Navbar from './components/Navbar';
import FlightDetails from './components/FlightDetails';
import SeatSelection from './components/SeatSelection';
import Confirmation from './components/Confirmation';
import Profile from './components/Profile';
import ProfileDetails from './components/ProfileDetails';
import Trips from './components/Trips';
import CheckIn from './components/CheckIn';
import ReviewForm from './components/ReviewForm';
import Reviews from './components/Review';
import Admin from './components/Admin';
import FlightStatus from './components/FlightStatus';

import MultiCityFlightSelect from './components/MultiCityFlightSelect';
import MultiCityFlightDetails from './components/MultiCityFlightDetails';
import MultiCitySeatSelection from './components/MultiCitySeatSelection';
import MultiCityConfirmation from './components/MultiCityConfirmation';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('token') === 'true';
    });

    return (
        <Router>
            <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </Router>
    );
};

const AppContent = ({ isLoggedIn, setIsLoggedIn }) => {
    return (
        <div>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                <Route exact path="/" element={<FlightBooking />} />
                <Route exact path="/FlightSelect" element={<Flightselect isLoggedIn={isLoggedIn} />} />
                <Route exact path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                <Route exact path="/FlightDetails" element={<FlightDetails />} />
                <Route exact path="/SeatSelection" element={<SeatSelection />} />
                <Route exact path="/Confirmation" element={<Confirmation />} />
                
                <Route exact path="/MultiCityFlightSelect" element={<MultiCityFlightSelect isLoggedIn={isLoggedIn} />} />
                <Route exact path="/MultiCityFlightDetails" element={<MultiCityFlightDetails />} />
                <Route exact path="/MultiCitySeatSelection" element={<MultiCitySeatSelection />} />
                <Route exact path="/MultiCityConfirmation" element={<MultiCityConfirmation />} />

                <Route exact path="/Profile" element={<Profile setIsLoggedIn={setIsLoggedIn} />} />
                <Route exact path="/ProfileDetails" element={<ProfileDetails />} />
                <Route exact path="/Trips" element={<Trips />} />
                <Route exact path='/CheckIn' element={<CheckIn/>} />
                <Route exact path='/RR' element={<ReviewForm/>} />
                <Route exact path='/Reviews_Ratings' element={<Reviews/>} />
                <Route exact path='/Admin' element={<Admin setIsLoggedIn={setIsLoggedIn}/>} />
                <Route exact path='/FlightStatus' element={<FlightStatus/>} />
            </Routes>
        </div>
    );
};

export default App;
