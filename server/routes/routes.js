const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer=require('nodemailer');
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
router.delete('/bookings/delete/:id', controller.cancelRide);
router.post('/send', async (req, res) => {
    const { email, name, source, destination, bookingTime } = req.body;

    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gaurav1234thakurgt@gmail.com', 
                pass: 'pwhe bage juko mwyq'
            }
        });

        let info = await transporter.sendMail({
            from: 'gauravzz937@gmail.com',
            to: email,
            subject: 'Confirmation: Booking Details for Your Cab Ride',
            html: `
                <p>Dear ${name},</p>
                <p>We are pleased to confirm your booking for a cab ride.</p>
                <p><strong>Booking Details:</strong></p>
                <ul>
                    <li><strong>Cab ID:</strong> ${cabId}</li>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Pickup Location:</strong> ${source}</li>
                    <li><strong>Dropoff Location:</strong> ${destination}</li>
                    <li><strong>Booking Time:</strong> ${bookingTime}</li>
                </ul>
                <p>We look forward to providing you with a comfortable and enjoyable ride.</p>
                <p>Best regards,</p>
                <p>EasyRide</p>
            `
        });

        console.log('Message sent: %s', info.messageId);
        res.send('Email sent successfully!');
    } catch (error) {
        console.error('Error occurred while sending email:', error);
        res.status(500).send('Failed to send email.');
    }
});

module.exports = router; 
 