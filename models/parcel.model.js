const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// Define the Parcel Schema
const parcelSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true, unique: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, required: true },
  senderName: { type: String, required: true }, // Corrected from Date to String
  senderPhone: { type: String, required: true },
  receiverName: { type: String, required: true },
  receiverPhone: { type: String, required: true },
  receiverAddress: { type: String, required: true },
  currentLocation: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
  statusUpdates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ParcelStatusUpdate' }] // Add this line
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Define the ParcelStatusUpdate Schema
const parcelStatusUpdateSchema = new mongoose.Schema({
  status: { type: String, required: true }, // Corrected to String type
  location: { type: String, required: true },
  parcelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parcel' }, // Reference to the Parcel model
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Create Models
const Parcel = mongoose.model('Parcel', parcelSchema);
const ParcelStatusUpdate = mongoose.model('ParcelStatusUpdate', parcelStatusUpdateSchema);

// Export Models
module.exports = { Parcel, ParcelStatusUpdate };
