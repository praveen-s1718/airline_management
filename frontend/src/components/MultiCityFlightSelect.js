import React, { useEffect, useState } from "react";
import "../App.css";
import "../Flightselect.css";
import { useNavigate } from 'react-router-dom';

export default function MultiCityFlightSelect({ isLoggedIn }) {
  const [segmentsData, setSegmentsData] = useState([]);
  const [selectedFlights, setSelectedFlights] = useState({});
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const flightSearchResults = localStorage.getItem("multiCitySearchResults");
    if (flightSearchResults) {
      const parsedData = JSON.parse(flightSearchResults);
      setSegmentsData(parsedData);
    }
  }, []);

  const handleFlightSelect = (segmentIndex, flight) => {
    setSelectedFlights(prev => ({
      ...prev,
      [segmentIndex]: flight
    }));
  };

  const handleBookItinerary = () => {
    if (isLoggedIn) {
      // Ensure all segments have a selected flight
      if (Object.keys(selectedFlights).length === segmentsData.length) {
        // Convert to array of flights in order
        const flightsArray = segmentsData.map((_, index) => selectedFlights[index]);
        localStorage.setItem('MultiCitySelectedFlights', JSON.stringify(flightsArray));
        navigate('/MultiCityFlightDetails');
      }
    } else {
      setShowLoginMessage(true);
    }
  };

  const allSelected = segmentsData.length > 0 && Object.keys(selectedFlights).length === segmentsData.length;

  return (
    <div className="flightselect" style={{ paddingTop: '100px', display:'flex', flexDirection:'column', alignItems:'center' }}>
      <h2 style={{ marginBottom: '20px', color: '#1a1a2e' }}>Select Flights for Your Itinerary</h2>
      
      {segmentsData.length > 0 ? (
        segmentsData.map((segmentObj, segIndex) => (
          <div key={segIndex} style={{ width: '100%', maxWidth: '800px', marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px', color: '#4361ee' }}>
              Segment {segIndex + 1}: {segmentObj.segment.from} to {segmentObj.segment.to}
            </h3>
            
            {segmentObj.flights.length > 0 ? (
              segmentObj.flights.map((flight, flightIndex) => {
                const departureDateObject = new Date(flight.departure.scheduledTime);
                const arrivalDateObject = new Date(flight.arrival.scheduledTime);

                const isSelected = selectedFlights[segIndex] && selectedFlights[segIndex].flightNumber === flight.flightNumber;

                return (
                  <div
                    className="flightdeatils_review"
                    key={flightIndex}
                    style={{ 
                      border: isSelected ? '2px solid #4361ee' : '1px solid #e8e8ee',
                      marginBottom: '10px'
                    }}
                    onClick={() => handleFlightSelect(segIndex, flight)}
                  >
                    <div className="flight_details_1">
                      <div className="flight_details_left_1">
                        <div className="from_details_1">
                          <div className="time_1">
                            <span>
                              {new Date(flight.departure.scheduledTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="airport-name">{flight.departure.airportCity}</div>
                        </div>
                        <div className="flight_duration_symbol_1">
                          <div className="dot_1" />
                          <div className="line_1" />
                          <div className="plane_1">✈</div>
                          <div className="flight_duration_1">{flight.duration} minutes</div>
                        </div>
                        <div className="to_details_1">
                          <div className="time_1">
                            <span>
                              {new Date(flight.arrival.scheduledTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="airport-name">{flight.arrival.airportCity}</div>
                        </div>
                      </div>
                      <div className="flight_number">{flight.flightNumber}</div>
                      <div className="flight_details_right_1">₹{flight.price.economy}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-flights">No flights available for this segment.</p>
            )}
          </div>
        ))
      ) : (
        <p className="no-flights">No itinerary records found.</p>
      )}

      {segmentsData.length > 0 && (
        <div style={{ marginTop: '20px', marginBottom: '50px', textAlign: 'center' }}>
          {showLoginMessage && (
            <p className="login-message" style={{ color: 'red', marginBottom: '10px' }}>Please Login to book an itinerary !</p>
          )}
          <button 
            className="search-button" 
            style={{ 
              width: '300px', 
              opacity: allSelected ? 1 : 0.5,
              cursor: allSelected ? 'pointer' : 'not-allowed' 
            }}
            onClick={handleBookItinerary}
            disabled={!allSelected}
          >
            Review Itinerary
          </button>
        </div>
      )}
    </div>
  );
}
