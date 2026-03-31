import React, { useEffect, useState } from "react";
import Header from './Header';
import '../BookingFlight.css';
import { useNavigate } from 'react-router-dom';

const MultiCityFlightDetails = () => {
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedFlights = localStorage.getItem("MultiCitySelectedFlights");
    if (selectedFlights) {
      setFlights(JSON.parse(selectedFlights));
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/MultiCitySeatSelection');
  };

  const totalPrice = flights.reduce((total, flight) => {
    return total + (flight.price ? flight.price.economy : 0);
  }, 0);

  return (
    <section id="flightdetails">
      <Header heading='Review Your Itinerary' />
      <div className="flightdetailsWithid" style={{ marginTop: '5rem' }}>
        <h2 className="down_3">Multi-city Itinerary Complete Review</h2>
        
        {flights.map((flight, index) => {
          const dateDate = new Date(flight.departure?.scheduledTime || "");
          const formattedDate = `${dateDate.getUTCDate() < 10 ? '0' : ''}${dateDate.getUTCDate()}-${dateDate.getUTCMonth() + 1 < 10 ? '0' : ''}${dateDate.getUTCMonth() + 1}-${dateDate.getUTCFullYear()}`;

          return (
            <div key={index} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e8e8ee' }}>
              <h3 style={{ marginBottom: '1rem', color: '#4361ee' }}>Segment {index + 1}</h3>
              <p className='flightNumber'>Flight Number : {flight.flightNumber}</p>
              <p className='Date'>Date : {formattedDate}</p>
              <p className='Date'>Price : ₹{flight.price?.economy || 0}</p>
              
              <div className="flight_details">
                <div className="flight_details_left">
                  <div className="from_details">
                      <div className="time">
                          {flight.departure ? <span> {new Date(flight.departure.scheduledTime).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                          })} </span> : ''}
                      </div>
                      <div className="airport-name">{flight.departure ? flight.departure.airportCity : ''}</div>
                  </div>
                  <div className="flight_duration_symbol">
                    <div className="dot"></div>
                    <div className="line"></div>
                    <div className="plane">&#9992;</div>
                    <div className="flight_duration">{flight.duration} hours</div>
                  </div>
                  <div className="to_details">
                    <div className="time">
                      {flight.arrival ? <span> {new Date(flight.arrival.scheduledTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                      })} </span> : ''}
                    </div>
                  <div className="airport-name">{flight.arrival ? flight.arrival.airportCity : ''}</div>
                  </div>
                </div>
                <div className="flight_details_right">
                  <div className="Baggage">
                    <div className="gap-1">Baggage</div>
                    <div>Per Traveller</div>
                  </div>
                  <div className="Baggage">
                    <div className="gap-2">Cabin</div>
                    <div>7kgs</div>
                  </div>
                  <div className="Baggage">
                    <div>Check-in</div>
                    <div>15kgs</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          <h3 style={{ color: '#1a1a2e' }}>Total Itinerary Price: ₹{totalPrice}</h3>
        </div>

        <button type="submit" className='button2' id="details" onClick={handleSubmit}>Proceed to Seat Selection</button>
      </div>
    </section>
  );
};

export default MultiCityFlightDetails;
