import React, { useEffect, useState } from 'react';
import '../BookingFlight.css';
import { useNavigate } from 'react-router-dom';

const MultiCitySeatSelection = () => {
    const [flights, setFlights] = useState([]);
    const [availableSeatsBySegment, setAvailableSeatsBySegment] = useState({});
    const [selectedSeats, setSelectedSeats] = useState({});
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const flightsData = localStorage.getItem("MultiCitySelectedFlights");
        if (flightsData) {
            const parsedFlights = JSON.parse(flightsData);
            setFlights(parsedFlights);
            
            // Fetch available seats for all flights
            parsedFlights.forEach((flight, index) => {
                fetch(`https://airline-management-tco0.onrender.com/api/flights/${flight.flightNumber}/seats`)
                    .then((response) => response.json())
                    .then((data) => {
                        setAvailableSeatsBySegment(prev => ({
                            ...prev,
                            [index]: data.economy || []
                        }));
                    })
                    .catch((error) => console.error('Error fetching seats', error));
            });
        }
    }, []);

    const onConfirm = (event) => {
        event.preventDefault();
        
        if (Object.keys(selectedSeats).length !== flights.length) {
            setMessage("Please select a seat for every flight in your itinerary!");
        } else {
            localStorage.setItem('MultiCitySelectedSeats', JSON.stringify(selectedSeats));
            navigate('/MultiCityConfirmation');
        }
    };

    const handleSeatSelect = (segmentIndex, seatNumber) => {
        const available = availableSeatsBySegment[segmentIndex] || [];
        if (available.includes(seatNumber)) {
            setSelectedSeats(prev => ({
                ...prev,
                [segmentIndex]: seatNumber
            }));
            setMessage(""); // clear error
        }
    };

    const generateSeatMap = () => {
        const rows = 30;
        const cols = 6;
        const seatMap = [];
        for (let row = 1; row <= rows; row++) {
            for (let col = 1; col <= cols; col++) {
                seatMap.push(`${row}${String.fromCharCode(64 + col)}`);
            }
        }
        return seatMap;
    };

    const seatMap = generateSeatMap();

    return (
        <section id="seatSelection" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
            <div className="seats" style={{ marginTop: '2rem' }}>
                <div className='heading_1'>
                    <h2>Select Seats for Your Itinerary</h2>
                </div>
                
                {flights.map((flight, segmentIndex) => (
                    <div key={segmentIndex} style={{ marginBottom: '4rem', marginTop: '2rem' }}>
                        <h3 style={{ textAlign: 'center', color: '#4361ee', marginBottom: '1rem' }}>
                            Segment {segmentIndex + 1}: Flight {flight.flightNumber} ({flight.departure.airportCity} to {flight.arrival.airportCity})
                        </h3>
                        
                        <div className="legend">
                            <div className="legend-item">
                                <div className="legend-box available"></div>
                                <span>Available</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-box unavailable"></div>
                                <span>Unavailable</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-box" style={{backgroundColor: '#4361ee'}}></div>
                                <span>Selected</span>
                            </div>
                        </div>

                        <div className="seat-map" style={{marginLeft: '10rem', marginRight: '10rem'}}>
                            {seatMap.map((seatNumber) => {
                                const available = availableSeatsBySegment[segmentIndex] || [];
                                const isAvailable = available.includes(seatNumber);
                                const isSelected = selectedSeats[segmentIndex] === seatNumber;
                                
                                return (
                                    <div
                                        key={seatNumber}
                                        className={`seat ${isSelected ? 'selected' : ''} ${isAvailable ? 'available' : 'unavailable'}`}
                                        onClick={() => handleSeatSelect(segmentIndex, seatNumber)}
                                    >
                                        {seatNumber}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <div className='outerMessage'><div className='message' style={{color: 'red'}}>{message}</div></div>
                <div className='bookingConfirm'>
                    <button onClick={onConfirm} className='button2'>Confirm Seats</button>
                </div>
            </div>
        </section>
    );
};

export default MultiCitySeatSelection;
