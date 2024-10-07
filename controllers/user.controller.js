const dotenv = require("dotenv");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const { Parcel, ParcelStatusUpdate } = require('../models/parcel.model');

const secret = process.env.SECRET;


const generateVerificationToken = (email) => {
  const payload = { email };
  const expiryTime = { expiresIn: "5m" };

  return jwt.sign(payload, secret, expiryTime);
};


const userRegistration = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const verificationToken = generateVerificationToken(email);

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    console.log("Registration successful", user);

    const verificationLink = `http://localhost:4000/verify?token=${verificationToken}`;

    sendVerificationEmail(email, verificationLink);
    // res.json({
    //   message: "Registration successful, and Verification link send",
    //   user,
    // });
    // res.redirect("/login");
    res.status(200).json({
      message: "Registration successful, and Verification link sent",
      user,
    });

  } catch (error) {
    console.log(error);
  }
};

const sendVerificationEmail = (email, verificationLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Complete your registration",
    text: `To complete your registration, click this link ${verificationLink}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error sending verification link");
    } else {
      console.log("Verification Link successfully sent", info.response);
    }
  });
};

const verifyUserEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, secret);
    console.log("Token received", decoded);

    const users = await User.findOne({ email: decoded.email });
    if (!users) {
      console.log("User not found");
    //   return res.json({ message: "User not found" });
    }

    if (users.isVerified) {
      console.log("User already verified", users);
    //   return res.json({ message: "User already verified" });
    }

    (users.isVerified = true),
      (users.verificationToken = null),
      await users.save();

    console.log("User verification complete", users);
    res.json({ message: "User verification complete", users });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("Token expired", error);
    //   return res.status(401).json({ message: "Token expired" });
    }
    console.log("Error verifying token");
    // return res.status(401).json({ message: "Error verifying token" });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email});
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const verifyPassword = bcryptjs.compare(password, user.password);
    if (!verifyPassword) {
      console.log("Wrong password");
      return res.status(401).json({ message: "Wrong password" });
    }

    if (!user.isVerified) {
      console.log("User not verified");
      return res.status(401).json({ message: "User not verified" });
    }


    

    const token = jwt.sign({ id: user._id, email: user.email }, secret, {
      expiresIn: "1h", // Optional: Add an expiration time for the token
    });
    // res.json({ token });
    res.status(200).json({ message: "User signin success", token });

  } catch (error) {
    console.log(error);
  }
};

const generateTrackingNumber = () => {
  return 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase();
};


const createParcel = async (req, res) => {
  try {
    const {origin, destination, senderName, senderPhone, receiverName, receiverPhone, receiverAddress} = req.body;
    const trackingNumber = generateTrackingNumber();
    const userId = req.user.id; // Get user ID from the authenticated user

    const parcel = await Parcel.create({
      trackingNumber,
      origin,
      destination,
      userId,
      status: 'Pending',
      senderName,
      senderPhone,
      receiverName,
      receiverPhone,
      receiverAddress,
      currentLocation: 'Dispatch Center',
    });

    // Save the parcel to the database
    const savedParcel = await parcel.save();
    console.log(parcel);
    

    // Send a response with the saved parcel (clean the object)
    res.status(201).json({
      message: 'Parcel created successfully',
      trackingNumber,
      parcel: {
        id: savedParcel._id,
        origin: savedParcel.origin,
        destination: savedParcel.destination,
        status: savedParcel.status,
        senderName: savedParcel.senderName,
        senderPhone: savedParcel.senderPhone,
        receiverName: savedParcel.receiverName,
        receiverPhone: savedParcel.receiverPhone,
        receiverAddress: savedParcel.receiverAddress,
        currentLocation: savedParcel.currentLocation,
      },
    });
  } catch (error) {
    console.error('Error creating parcel:', error);
    res.status(500).json({ message: 'Error creating parcel', error: error.message });
  }
};



const trackParcel = async (req, res) => {
    try {
      const { trackingNumber } = req.params; // Use req.params to get trackingNumber
  
      // Find the parcel with the associated status updates
      const parcel = await Parcel.findOne({ trackingNumber }).populate('statusUpdates'); // Use .populate to get status updates
  
      if (!parcel) {
        console.log('Parcel not found'); // Logging the message
        return res.status(404).json({ message: 'Parcel not found' });
      }
  
      console.log(parcel);
      res.status(200).json({ parcel });
    } catch (error) {
      console.error('Error tracking parcel:', error); // Improved error logging
      res.status(500).json({ message: 'Error tracking parcel', error: error.message });
    }
  };


  const updateParcelStatus = async (req, res) => {
    try {
      const { trackingNumber } = req.params;
      const { status, location } = req.body;
  
      console.log('Updating parcel with tracking number:', trackingNumber); // Debugging log
  
      // Find the parcel by tracking number
      const parcel = await Parcel.findOne({ trackingNumber });
  
      if (!parcel) {
        console.log('Parcel not found:', trackingNumber); // Log if parcel is not found
        return res.status(404).json({ message: 'Parcel not found' });
      }
  
      // Add new status update
      const statusUpdate = await ParcelStatusUpdate.create({
        parcelId: parcel._id, // Use _id to reference the parcel
        status,
        location
      });
  
      console.log('Status update created:', statusUpdate); // Debugging log for status update
  
      // Update parcel status and current location
      parcel.status = status; // Update directly
      parcel.currentLocation = location;
  
      try {
        await parcel.save(); // Save the updated parcel
        console.log('Parcel saved successfully:', parcel); // Log success
      } catch (saveError) {
        console.error('Error saving parcel:', saveError);
        return res.status(500).json({ message: 'Error saving parcel', error: saveError.message });
      }
  
      // Find the updated parcel with status updates included
      const updatedParcel = await Parcel.findOne({ trackingNumber }).populate('statusUpdates');
  
      if (!updatedParcel) {
        console.log('Updated parcel not found:', trackingNumber); // Log if the updated parcel is not found
        return res.status(404).json({ message: 'Updated parcel not found' });
      }
  
      res.status(200).json({ message: 'Parcel status updated', parcel: updatedParcel });
    } catch (error) {
      console.error('Error updating parcel status:', error); // Improved error logging
      res.status(500).json({ message: 'Error updating parcel status', error: error.message });
    }
  };
  
  

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user; // Attach user to req object
    next();
  });
};


module.exports = {
  userRegistration,
  verifyUserEmail,
  login,
  createParcel,
  trackParcel,
  updateParcelStatus,
  authenticateToken
};
