import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cabs.css";

function Cabs() {
  const [cabs, setCabs] = useState([]);
  const [selectedCab, setSelectedCab] = useState(null);
  const [updatedCabData, setUpdatedCabData] = useState({
    cabId: "",
    price: 0,
    currentPosition: "",
    isBooked: "Available",
  });

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

  const handleUpdate = (cab) => {
    setSelectedCab(cab);
    setUpdatedCabData(cab);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedCabData({ ...updatedCabData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected cab ID:", selectedCab._id);
    axios
      .put(
        `https://easy-ride-server.vercel.app/cabs/update/${selectedCab._id}`,
        updatedCabData
      )
      .then((res) => {
        console.log("Cab updated successfully");
        setSelectedCab(null);
        getCabs();
      })
      .catch((error) => {
        console.error("Error updating cab:", error);
      });
  };

  const handleCloseModal = () => {
    setSelectedCab(null);
  };
  useEffect(() => {
    getCabs();
  }, []);

  return (
    <div className="cab-container">
      {cabs.map((cab, index) => (
        <div key={index} className="card">
          <h2>{cab.cabId.toUpperCase()}</h2>
          <p>Price: {cab.price}</p>
          <p>Position: {cab.currentPosition}</p>
          <p>Status : {cab.isBooked}</p>
          <button onClick={() => handleUpdate(cab)}>Update</button>
        </div>
      ))}
      {selectedCab && (
        <div className="modal-container">
          <div className="modal">
            <h2>Update Cab</h2>
            <form>
              <button className="close-btn" onClick={handleCloseModal}>
                X
              </button>
              <label>Cab ID:</label>
              <input
                type="text"
                name="cabId"
                value={updatedCabData.cabId}
                onChange={handleInputChange}
                required
              />
              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={updatedCabData.price}
                onChange={handleInputChange}
                required
              />

              <label>Position</label>
              <select
                name="currentPosition"
                value={updatedCabData.currentPosition}
                onChange={handleInputChange}
                required
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>

              <button type="submit" onClick={handleSubmit}>
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cabs;
