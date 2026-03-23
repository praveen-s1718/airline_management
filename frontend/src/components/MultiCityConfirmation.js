import React, { useEffect, useState } from "react";
import "../BookingFlight.css";
import { useNavigate } from 'react-router-dom';

const MultiCityConfirmation = () => {
  const [flights, setFlights] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [booked, setBooked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    const flightsData = localStorage.getItem("MultiCitySelectedFlights");
    const seatsData = localStorage.getItem("MultiCitySelectedSeats");

    if (flightsData && seatsData) {
      setFlights(JSON.parse(flightsData));
      setSelectedSeats(JSON.parse(seatsData));
    }
  }, []);

  const handleBack = (event) => {
    event.preventDefault();
    navigate("/");
  };

  const handleClick = async (event) => {
    event.preventDefault();

    if (!username) {
        setErrorMessage("User not logged in.");
        return;
    }

    if (flights.length > 0) {
      try {
        const flightsToBook = flights.map((flight, index) => ({
          flightId: flight.flightNumber,
          seat: selectedSeats[index],
          seatClass: "economy",
          price: flight.price.economy
        }));

        const response = await fetch(`https://airline-management-tco0.onrender.com/api/itineraries`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            flightsToBook: flightsToBook
          }),
        });
  
        if (response.ok) {
          setBooked(true);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error || "Booking failed");
          console.error("Booking failed:", response.statusText);
        }
      } catch (error) {
        setErrorMessage("Network error occurred.");
        console.error("Error booking itinerary:", error);
      }
    }
  };

  const totalPrice = flights.reduce((total, flight) => total + (flight.price ? flight.price.economy : 0), 0);

  return (
    <section id="confirmation" style={{paddingTop: '6rem'}}>
      <div className="confirm">
      {booked ? (
        <div>
            <p className="top">Itinerary Booking Confirmed!</p>
            <p className="confirmationMessage">
            Your seats have been successfully reserved.
            </p>
            <p className="confirmationMessage">
            You will receive an Email to your registered Email address regarding your booking details.
            </p>
            <p className="confirmationMessage">
            Thank you for choosing our service.
            </p>
            <button className="button2" id="details" onClick={handleBack}>Search Flights</button>
        </div>
      ) : (
        <div>
          <h2>Itinerary Booking Confirmation</h2>
          
          {flights.map((flight, index) => {
            const date = new Date(flight.departure?.scheduledTime || "");
            const formattedDate = `${date.getUTCDate() < 10 ? "0" + date.getUTCDate() : date.getUTCDate()}-${
                (date.getUTCMonth() + 1) < 10 ? "0" + (date.getUTCMonth() + 1) : (date.getUTCMonth() + 1)
            }-${date.getUTCFullYear()}`;

            return (
              <div key={index} style={{marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e8e8ee'}}>
                  <h3 style={{color:'#4361ee', marginBottom: '0.5rem'}}>Segment {index + 1}</h3>
                  <p className="flightNumber">Flight Number : {flight.flightNumber}</p>
                  <p className="Date">Date : {formattedDate}</p>
                  <div className="flight_details">
                    <div className="flight_details_left">
                      <div className="from_details">
                        <div className="time">
                          {flight.departure ? (
                            <span>{new Date(flight.departure.scheduledTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          ) : ("")}
                        </div>
                        <div className="airport-name">
                          {flight.departure ? flight.departure.airportCity : ""}
                        </div>
                      </div>
                      <div className="flight_duration_symbol">
                        <div className="dot"></div>
                        <div className="line"></div>
                        <div className="plane">&#9992;</div>
                        <div className="flight_duration">{flight.duration} minutes</div>
                      </div>
                      <div className="to_details">
                        <div className="time">
                          {flight.arrival ? (
                            <span>{new Date(flight.arrival.scheduledTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          ) : ("")}
                        </div>
                        <div className="airport-name">
                          {flight.arrival ? flight.arrival.airportCity : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className='Date Date_3'>Price : ₹{flight.price ? flight.price.economy : 0}</p>
                  <p className="passengerDetails">Seat Selected : <span style={{fontWeight: 'bold', color: '#4361ee'}}>{selectedSeats[index]}</span></p>
              </div>
            );
          })}
          
          <h3 style={{ marginTop: '1rem', color: '#1a1a2e' }}>Total Price: ₹{totalPrice}</h3>

          {errorMessage && <p className="errorMessage">{errorMessage}</p>}

          <div id="confirmationDetails">
            <div className="confirmButtonWrapper" style={{marginTop: '2rem'}}>
              <p className="passengerDetails" id="details" style={{marginTop: '1rem'}}>
                Click here to Confirm Your Booking :{" "}
              </p>
              <button
                onClick={handleClick}
                className="button2"
                id="confirmBooking"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
};

export default MultiCityConfirmation;
