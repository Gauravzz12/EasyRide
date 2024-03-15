const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: String,
  connections: [
    {
      to: String,
      time: Number,
    },
  ],
});

const cabSchema = new mongoose.Schema({
  cabId: String,
  price: Number,
  currentPosition: String,
  isBooked:String,
});

const BookingSchema = new mongoose.Schema({
  cabId: String,
  details: [
    {
      name: String,
      email: String,
      source: String,
      destination: String,
      start: String,
      endTime: String,
      bookingTime: String,
    },
  ],
});
const LocationModel = mongoose.model("location", locationSchema);
const CabModel = mongoose.model("cabs", cabSchema);
const BookingModel = mongoose.model("bookings", BookingSchema);

module.exports = {
  LocationModel,
  CabModel,
  BookingModel,
};
