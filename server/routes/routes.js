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
// router.delete('/bookings/delete/:id'.controller.cancelBooking);

router.post('/send', async (req, res) => {
    const { email } = req.body;

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
            subject: 'Test Email',
            text: 'This is a test email.'
        });
        console.log('Message sent: %s', info.messageId);
        res.send('Email sent successfully!');
    } catch (error) {
        console.error('Error occurred while sending email:', error);
        res.status(500).send('Failed to send email.');
    }
});
module.exports = router; 
 