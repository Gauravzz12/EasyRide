import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Bookings.css";
import moment from "moment";

function Bookings() {
  const [cabs, setCabs] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  useEffect(() => {
    getCabs();
  }, []);

  function getCabs() {
    axios
      .get("https://easy-ride-server.vercel.app/cabs")
      .then((res) => res.data)
      .then((data) => {
        setCabs(data);
      })
      .catch((error) => {
        console.error("Error fetching cabs:", error);
      });
  }
  async function handleCabButtonClick(cabId) {
    try {
      const res = await axios.get(`https://easy-ride-server.vercel.app/bookings/${cabId}`);
      const updatedBookingHistory = res.data.map((booking) => ({
        ...booking,
        status: moment(booking.details[0].endTime, "HH:mm").isSameOrBefore(
          moment()
        )
          ? "Completed"
          : "Pending",
      }));
      const selectedCab = cabs.find((cab) => cab.cabId === cabId);
      if (updatedBookingHistory[0].status === "Completed") {
        await axios.put(`https://easy-ride-server.vercel.app/cabs/update/${selectedCab._id}`, {
          isBooked: "Available",
        });
      }
      setBookingHistory(updatedBookingHistory); 
    } catch (error) {
      console.error("Error fetching booking history:", error);
    }
  }
  async function cancelRide(id) {
    try {
      await axios.delete(`https://easy-ride-server.vercel.app/bookings/${id}`);
      
      setBookingHistory(updatedHistory);
    } catch (error) {
      console.error("Error cancelling ride:", error);
    }
  }

  

  return (
    <div className="booking-container">
      <h1>Booking History Of All Cabs</h1>
      <div className="Cabs">
        {cabs.map((cab) => (
          <button
            key={cab.cabId}
            onClick={() => handleCabButtonClick(cab.cabId)}
          >
            {cab.cabId.toUpperCase()}
          </button>
        ))}
      </div>
        <div className="Bookings">
          <h2>Booking History</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookingHistory.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.details[0].name}</td>
                  <td>{booking.details[0].email}</td>
                  <td>{booking.details[0].source}</td>
                  <td>{booking.details[0].destination}</td>
                  <td>{booking.details[0].bookingTime}</td>
                  <td>{booking.details[0].endTime}</td>
                  <td>{booking.status}</td>
                  <td>
                    <button onClick={() => cancelRide(booking.cabId)}>
                      Cancel Ride
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
     
    </div>
  );
}

export default Bookings;
