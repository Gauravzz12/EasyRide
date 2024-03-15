import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Book.css";
import Logo from "../assets/Logo.jpg";
import moment from "moment";

function Book() {
  const [cabs, setCabs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [shortestTime, setShortestTime] = useState(null);
  const [srcdest, setSrcDest] = useState([]);
  const [showBookings, setShowBookings] = useState(false);
  function findShortestTime(locations, src, dest) {
    const time = {};
    const visited = {};
    locations.forEach((location) => {
      time[location.name] = Infinity;
      visited[location.name] = false;
    });

    time[src] = 0;

    for (let i = 0; i < locations.length - 1; i++) {
      let minTime = Infinity;
      let minIndex = -1;
      Object.keys(time).forEach((location) => {
        if (!visited[location] && time[location] <= minTime) {
          minTime = time[location];
          minIndex = location;
        }
      });

      visited[minIndex] = true;

      const connections = locations.find(
        (loc) => loc.name === minIndex
      ).connections;
      connections.forEach((connection) => {
        const adjLocation = connection.to;
        const weight = connection.time;
        if (
          !visited[adjLocation] &&
          time[minIndex] !== Infinity &&
          time[minIndex] + weight < time[adjLocation]
        ) {
          time[adjLocation] = time[minIndex] + weight;
        }
      });
    }

    return time[dest];
  }

  const showcabs = (e) => {
    e.preventDefault();
    getlocation();
    setShowBookings(true);
  };

  function getCabs() {
    axios
      .get("http://localhost:5000/cabs")
      .then((res) => res.data)
      .then((data) => {
        setCabs(data);
      })
      .catch((error) => {
        console.error("Error fetching cabs:", error);
      });
  }

  function getlocation() {
    axios
      .get("http://localhost:5000/location")
      .then((res) => res.data)
      .then((data) => {
        setLocations(data[0].locations);
        const pickupLocation = document.getElementById("pickup").value;
        const dropoffLocation = document.getElementById("dropoff").value;
        if (pickupLocation === dropoffLocation) {
          alert("Pickup and Dropoff locations cannot be same");
          return;
        } else {
          setSrcDest([pickupLocation, dropoffLocation]);
          const time = findShortestTime(
            data[0].locations,
            pickupLocation,
            dropoffLocation
          );
          setShortestTime(time);
        }
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  }

  function BookCab(cabId) {
    setShowBookings(false);
    getCabs();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const pickupLocation = document.getElementById("pickup").value;
    const dropoffLocation = document.getElementById("dropoff").value;
    const bookingTime = document.getElementById("time").value;
    const currPos = cabs.find((cab) => cab.cabId === cabId).currentPosition;
    const arrivalTime = findShortestTime(locations, pickupLocation, currPos);
    const endTime = moment(bookingTime, "HH:mm")
      .add(shortestTime, "minutes")
      .add(arrivalTime, "minutes")
      .format("HH:mm");
      console.log(cabs);
    if (cabs.find((cab) => cab.cabId === cabId).isBooked=="Booked") {
      alert("This cab is already booked. Please choose another one.");
      return;
    }
  
    const newBooking = {
      cabId,
      name,
      email,
      source: pickupLocation,
      destination: dropoffLocation,
      bookingTime,
      endTime,
    };
  
    axios
      .post("http://localhost:5000/bookings", newBooking)
      .then((res) => {
        alert("Booking successful!");
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("pickup").value = "";
        document.getElementById("dropoff").value = "";
        document.getElementById("time").value = "";
  
        axios.put(`http://localhost:5000/cabs/update/${cabs.find((cab) => cab.cabId === cabId)._id}`, {
          isBooked: "Booked",
        });
  
        getCabs();
      })
      .catch((error) => {
        console.error("Error booking cab:", error);
      });
  }
  

  useEffect(() => {
    if (shortestTime !== null) {
      getCabs();
    }
  }, [shortestTime]);

  return (
    <div>
      <h1>Book a CAB</h1>
      <div className="container">
        <form onSubmit={showcabs}>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
          <label htmlFor="time">Time:</label>
          <input type="time" id="time" name="time" required />

          <label htmlFor="pickup">Pickup Location:</label>
          <select id="pickup" name="pickup" required defaultValue="">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </select>
          <label htmlFor="dropoff">Drop-off Location:</label>
          <select id="dropoff" name="dropoff" required defaultValue="">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </select>
          <button>Book Now</button>
        </form>
        <div className="image-container">
          <img src={Logo} alt="Logo" />
        </div>
      </div>
      {showBookings && (
        <div className="Bookings">
          <h2>Estimated Time : {shortestTime}</h2>
          <table>
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Cab</th>
                <th>Price/minute</th>
                <th>Total Fare</th>
                <th>Cab Arrives in(Minutes)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cabs.map((data, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <th>{data.cabId}</th>
                  <th>{data.price}</th>
                  <th>{data.price * shortestTime}</th>
                  <th>
                    {findShortestTime(
                      locations,
                      srcdest[0],
                      data.currentPosition
                    )}
                  </th>
                  <th>
                    <button onClick={() => BookCab(data.cabId)}>Book</button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Book;
