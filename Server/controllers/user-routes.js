const express = require("express");
const User = require("../models/userData");
const router = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { error } = require("console");


//create user endpoint
router.post("/register", async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    try{
        if(!firstName || !lastName || !email || !password || !confirmPassword ){
            return res.status(400).json({ err: "Please complete all fields"});
        }

        if(password !== confirmPassword) {
            return  res.status(400).json({message: "Password does not match.", type: "error"})
            
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ err: "This email is already in use" });
    }

    const saltRounds = parseInt(process.env.SALT);
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    })
    console.log("User to be saved:", newUser);
    await newUser.save();
    console.log("User saved successfully");

    // const payload = {
    //     id: newUser._id,
    //     firstName: newUser.firstName,
    //     lastName: newUser.lastName,
    //     email: newUser.email,
    //     password: newUser.password
    // };

    // const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1h" });

    res.status(201).json({ message: "User created successfully", userId: newUser.id})
}catch (err) {
    console.error("MongoDB Save Error:", err);
    res.status(500).json({ err: "internal server error", details: err.message });
}
})

//login endpoint
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ err: "Please provide email and password" });
        }


        // check for existing user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ err: "User not found" });
        }


        //verify credentials
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ err: "Invalid email or password" });
        }


        // Generate JWT 
        const payload = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        }
        const token = jwt.sign(payload, process.env.JWT_KEY);
        
        res.json({ message: 'Login successful', token, payload });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: "Internal server error" });
    }
});

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ error: "Email not found" })
        }

        const otp = crypto.randomInt(10000, 99999).toString();
        const otpExpiration = Date.now() + 120000;

        user.otp = otp
        user.otpExpiration = otpExpiration
        await user.save()
        
        const transporter = nodemailer.createTransport ({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        })

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP is: ${otp}. It will expire in 2 minutes.`
        }
        

        await transporter.sendMail(mailOptions)

        res.status(200).json({ message: "OTP sent to your email"})
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error" })
    }
});

router.post("/otp-validation", async (req, res) => {
    const { email, otp } = req.body;
    const currentTime = new Date().getTime();

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ error: "Email no found" })
        }

        if (user.otp !== otp || currentTime > user.otpExpiration ){
            return res.status(400).json({ error: "Invalid or expired OTP" })
        }

        user.otp = null
        user.otpExpiration = null
        await user.save()

        res.status(200).json({ message: "OTP validate successfully" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error" })
    }
});

router.get("/get-otp-expiration", async (req, res) => {
    const { email } = req.query;
    try {
        const user = await User.findOne({ email });
        if (!user || !user.otpExpiration) {
            return res.status(404).json({ err: "OTP not found or expired." });
        }
        res.json({ expiration: user.otpExpiration });
    } catch (err) {
        res.status(500).json({ err: "Internal server error." });
    }
});

router.post("/reset-password", async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body

    try {
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: "Password do not match"})
        }

        const user = await User.findOne({ email })
        if(!user) {
            return res.status(404).json({ error: "User not found"})
        }

        const saltRounds = parseInt(process.env.SALT);
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
        
        user.password = hashedPassword

        await user.save()

        res.status(200).json({ message: "Password updated successfully" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error" })
    }
})

module.exports = router