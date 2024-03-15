const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const controller = require("../controllers/controller.js");
router.get("/", (req, res) => {
    res.send("Welcome to the Cab Booking API");
});
router.get("/location",controller.getAllLocations);
router.get("/cabs",controller.getAllCabs);
router.put("/cabs/update/:id", controller.updateCab) ;
router.post("/bookings", controller.createBooking);
router.get("/bookings/:cabId", controller.getBookingHistoryByCabId);
// router.delete('/bookings/delete'.controller.cancelBooking);
module.exports = router; 
 