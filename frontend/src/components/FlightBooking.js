import React, { useState , useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft, faShieldAlt, faClock, faHeadset, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import CustomSelect from './CustomSelect';
import { useNavigate } from 'react-router-dom';

const FlightBooking = () => {
    const [from, setFrom] = useState('Select a City');
    const [to, setTo] = useState('Select a City');
    const [showFromOptions, setShowFromOptions] = useState(false);
    const [showToOptions, setShowToOptions] = useState(false);
    const [ways, setWays] = useState('One way');
    const [fromSearch, setFromSearch] = useState('');
    const [toSearch, setToSearch] = useState('');
    const [departDate, setDepartDate] = useState('');
    const [returnDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [cities, setCities] = useState([]);
    const navigate = useNavigate();

    const [multicitySegments, setMulticitySegments] = useState([
        { from: 'Select a City', to: 'Select a City', date: '', showFrom: false, showTo: false, searchFrom: '', searchTo: '' },
        { from: 'Select a City', to: 'Select a City', date: '', showFrom: false, showTo: false, searchFrom: '', searchTo: '' }
    ]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch('https://airline-management-tco0.onrender.com/api/airports');
                const data = await response.json();
                const cityNames = data.map(airport => airport.city);
                setCities(cityNames);
            } catch (error) {
                console.error('Error fetching cities:', error);
                setErrorMessage('There was an error fetching the city data. Please try again later.');
            }
        };

        fetchCities();
    }, []);

    const filteredFromCities = cities.filter(city => city.toLowerCase().includes(fromSearch.toLowerCase()));
    const filteredToCities = cities.filter(city => city.toLowerCase().includes(toSearch.toLowerCase()));
    
    const handleSegmentChange = (index, field, value) => {
        const newSegments = [...multicitySegments];
        newSegments[index][field] = value;
        setMulticitySegments(newSegments);
    };

    const addSegment = () => {
        if (multicitySegments.length < 5) {
            setMulticitySegments([...multicitySegments, { from: 'Select a City', to: 'Select a City', date: '', showFrom: false, showTo: false, searchFrom: '', searchTo: '' }]);
        }
    };

    const removeSegment = (index) => {
        if (multicitySegments.length > 2) {
            setMulticitySegments(multicitySegments.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (ways === 'Multi-city') {
            for (let seg of multicitySegments) {
                if (seg.from === 'Select a City' || seg.to === 'Select a City' || !seg.date) {
                    setErrorMessage("Please fill in all the required fields for all flights !!");
                    return;
                }
            }
            try {
                const segmentsPayload = multicitySegments.map(seg => ({
                    from: seg.from,
                    to: seg.to,
                    date: seg.date
                }));
                fetch('https://airline-management-tco0.onrender.com/api/flights/multicity', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ segments: segmentsPayload })
                })
                .then((response) => response.json())
                .then((data) => {
                    localStorage.setItem('multiCitySearchResults', JSON.stringify(data));
                    navigate('/MultiCityFlightSelect');
                })
                .catch((error) => {
                    console.error('Error fetching flight data:', error);
                    setErrorMessage('There was an error fetching the flight data. Please try again later.');
                });
            } catch (error) {
                console.error('Unexpected error:', error);
                setErrorMessage('An unexpected error occurred. Please try again later.');
            }
            return;
        }

        if (from === 'Select a City' || to === 'Select a City' || !departDate || !ways) {
            setErrorMessage("Please fill in all the required fields !!");
            return;
        }
        try {
            fetch(`https://airline-management-tco0.onrender.com/api/flightsavailable?from=${from}&to=${to}&startDate=${departDate}&endDate=${returnDate}&tripType=${ways}`)
                .then((response) => response.json())
                .then((data) => {
                    localStorage.setItem('flightSearchResults', JSON.stringify(data));
                    navigate('/Flightselect');
                })
                .catch((error) => {
                    console.error('Error fetching flight data:', error);
                    setErrorMessage('There was an error fetching the flight data. Please try again later.');
                });
        } catch (error) {
            console.error('Unexpected error:', error);
            setErrorMessage('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className="hero-section">
            <div className="hero-text">
                <h1>Where do you want to go?</h1>
                <p>Search flights, compare prices, and book your trip — all in one place.</p>
            </div>

            <div className="flight-booking">
                <div className="heading">
                    <h1>Book a Flight</h1>
                </div>
                <div className="main-box">
                    <div className="upper-part">
                        <div className="trip-type-selector">
                            <label className={`trip-radio ${ways === 'One way' ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="tripType" 
                                    value="One way" 
                                    checked={ways === 'One way'} 
                                    onChange={(e) => setWays(e.target.value)} 
                                />
                                <span className="custom-radio">
                                    {ways === 'One way' && <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                </span>
                                One Way
                            </label>
                            
                            <label className={`trip-radio ${ways === 'Round Trip' ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="tripType" 
                                    value="Round Trip" 
                                    checked={ways === 'Round Trip'} 
                                    onChange={(e) => setWays(e.target.value)} 
                                />
                                <span className="custom-radio">
                                    {ways === 'Round Trip' && <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                </span>
                                Round Trip
                            </label>

                            <label className={`trip-radio ${ways === 'Multi-city' ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="tripType" 
                                    value="Multi-city" 
                                    checked={ways === 'Multi-city'} 
                                    onChange={(e) => setWays(e.target.value)} 
                                />
                                <span className="custom-radio">
                                    {ways === 'Multi-city' && <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                </span>
                                Multi-city
                            </label>
                        </div>
                    </div>
                    <form id="form" onSubmit={handleSubmit}>
                        {ways === 'Multi-city' ? (
                            <div className="multicity-container">
                                {multicitySegments.map((seg, index) => (
                                    <div className="multicity-segment" key={index}>
                                        <div className="segment-header">
                                            <span>Flight {index + 1}</span>
                                            {index >= 2 && (
                                                <button type="button" className="remove-btn" onClick={() => removeSegment(index)}>
                                                    <FontAwesomeIcon icon={faTrash} /> Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="lower-part-1">
                                            <CustomSelect
                                                label="From"
                                                selected={seg.from}
                                                setSelected={(val) => handleSegmentChange(index, 'from', val)}
                                                showOptions={seg.showFrom}
                                                setShowOptions={(val) => handleSegmentChange(index, 'showFrom', val)}
                                                search={seg.searchFrom}
                                                setSearch={(val) => handleSegmentChange(index, 'searchFrom', val)}
                                                filteredCities={cities.filter(city => city.toLowerCase().includes(seg.searchFrom.toLowerCase()))}
                                            />
                                            <FontAwesomeIcon icon={faArrowRightArrowLeft} className="double-arrow" />
                                            <CustomSelect
                                                label="To"
                                                selected={seg.to}
                                                setSelected={(val) => handleSegmentChange(index, 'to', val)}
                                                showOptions={seg.showTo}
                                                setShowOptions={(val) => handleSegmentChange(index, 'showTo', val)}
                                                search={seg.searchTo}
                                                setSearch={(val) => handleSegmentChange(index, 'searchTo', val)}
                                                filteredCities={cities.filter(city => city.toLowerCase().includes(seg.searchTo.toLowerCase()))}
                                            />
                                        </div>
                                        <div className="date-box">
                                            <span className="date-label">Travel Date</span>
                                            <input
                                                type="date"
                                                className="date-field"
                                                value={seg.date}
                                                onChange={(e) => handleSegmentChange(index, 'date', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {multicitySegments.length < 5 && (
                                    <button type="button" className="add-segment-btn" onClick={addSegment}>
                                        <FontAwesomeIcon icon={faPlus} /> Add Flight
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="lower-part-1">
                                    <CustomSelect
                                        label="From"
                                        selected={from}
                                        setSelected={setFrom}
                                        showOptions={showFromOptions}
                                        setShowOptions={setShowFromOptions}
                                        search={fromSearch}
                                        setSearch={setFromSearch}
                                        filteredCities={filteredFromCities}
                                    />
                                    <FontAwesomeIcon icon={faArrowRightArrowLeft} className="double-arrow" />
                                    <CustomSelect
                                        label="To"
                                        selected={to}
                                        setSelected={setTo}
                                        showOptions={showToOptions}
                                        setShowOptions={setShowToOptions}
                                        search={toSearch}
                                        setSearch={setToSearch}
                                        filteredCities={filteredToCities}
                                    />
                                </div>
                                <div className="date-box">
                                    <span className="date-label">Travel Date</span>
                                    <input
                                        type="date"
                                        className="date-field"
                                        value={departDate}
                                        onChange={(e) => setDepartDate(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        <button type="submit" className="search-button">Search Flights</button>
                    </form>
                </div>
            </div>

            <div className="features-section">
                <div className="feature-card">
                    <span className="feature-icon"><FontAwesomeIcon icon={faShieldAlt} style={{ color: '#4361ee' }} /></span>
                    <h3>Secure Booking</h3>
                    <p>Your data is always safe and encrypted</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon"><FontAwesomeIcon icon={faClock} style={{ color: '#4361ee' }} /></span>
                    <h3>Instant Confirmation</h3>
                    <p>Booking confirmed in seconds</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon"><FontAwesomeIcon icon={faHeadset} style={{ color: '#4361ee' }} /></span>
                    <h3>24/7 Support</h3>
                    <p>We're here whenever you need help</p>
                </div>
            </div>
        </div>
    );
};

export default FlightBooking;

