const { LocationModel, CabModel, BookingModel } = require("../models/model.js");

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await LocationModel.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCabs = async (req, res) => {
  try {
    const cabs = await CabModel.find();
    res.json(cabs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCab = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  console.log(req.body);

  try {
    const updatedCab = await CabModel.findByIdAndUpdate(
      id,
      {
        cabId: req.body.cabId,
        price: req.body.price,
        currentPosition: req.body.currentPosition,
        isBooked: req.body.isBooked,
      },
      { new: true }
    );
    console.log(updatedCab);
    res.status(200).json(updatedCab);
  } catch (error) {
    console.error("Error updating cab:", error);
    res.status(500).json({ error: "Could not update cab" });
  }
};
exports.createBooking = async (req, res) => {
  try {
    const { cabId, name, email, source, destination, bookingTime,endTime } = req.body;
    
    const booking = new BookingModel({
      cabId,
      details: [
        {
          name,
          email,
          source,
          destination,
          bookingTime,
          endTime
        },
      ],
    });
    const savedBooking = await booking.save();

    if (savedBooking) {
      await CabModel.findOneAndUpdate(
        { cabId: cabId },
        { currentPosition: destination, isBooked: "'Available" },

        { new: true }
      );
    }

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Error creating booking" });
  }
};
exports.getBookingHistoryByCabId = async (req, res) => {
  const cabId = req.params.cabId;
  try {
    const bookingHistory = await BookingModel.find({ cabId: cabId });
  
    res.json(bookingHistory);
  } catch (error) {
    console.error("Error fetching booking history:", error);
    res.status(500).json([{ message: "Error fetching booking history" }]);
  }
};


exports.cancelRide = async (req, res) => {
  const { id } = req.params; 
  try {
    const booking = await BookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await BookingModel.findByIdAndDelete(id);

    await CabModel.findOneAndUpdate(
      { cabId: booking.cabId },
      { isBooked: 'Available' }
    );
    res.status(200).json({ message: 'Ride cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling ride:', error);
    res.status(500).json({ error: 'Failed to cancel ride' });
  }
};



 
  
