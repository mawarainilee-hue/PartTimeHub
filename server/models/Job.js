const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  location: String,
  skillsRequired: {
    type: [String],
    default: []
  },
  startTime: {
    type: String,
    default: ""
  },

  endTime: {
    type: String,
    default: ""
  },

  workingDays: {
    type: [String],
    default: []
  },

  workingDate: {
    type: String,
    default: ""
  },
    status: {
    type: String,
    default: "Pending"
  },
  employerId: {
    type: String,
    default: ""
  },
  poster: {
    type: String,
    default: ""
  },
  maxParticipants: {
    type: Number,
    default: 1
  },
  category: {
    type: String,
    default: ""
  },
  latitude: {
  type: Number,
  default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  phoneNumber: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Job", jobSchema);