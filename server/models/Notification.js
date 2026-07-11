const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: String, // receiver
    message: String,
    type: String, // "application" | "job"
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Notification", notificationSchema);