const express = require("express");
const router = express.Router();

const { userRegistration, verifyUserEmail, login, createParcel, trackParcel, updateParcelStatus, authenticateToken} = require("../controllers/user.controller");

router.post("/register", userRegistration);
router.get("/verify", verifyUserEmail);
router.post("/login", login);
router.post('/parcels', authenticateToken, createParcel); // Protect route
router.get('/parcels/:trackingNumber', authenticateToken, trackParcel); // Protect route
router.put('/parcels/:trackingNumber', authenticateToken, updateParcelStatus); // Protect route


module.exports = router;
