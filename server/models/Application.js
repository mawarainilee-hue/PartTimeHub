const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    studentId: String,
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    },
    status: {
        type: String,
        default: "Pending"
    }
});

module.exports = mongoose.model("Application", applicationSchema);