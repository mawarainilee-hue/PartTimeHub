const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
        type: String,
        default: "student"
    },
    skills: {
        type: [String],
        default: []
      },
      availability: {
        type: String,
        default: ""
      },
      location: {
        type: String,
        default: ""
      },

      company: {
        type: String,
        default: ""
        },
      contact: {
        type: String,
        default: ""
      },

      avatar: {
        type: String,
        default: ""
      },

      preferences: {
        type: String,
        default: ""
      },
      availableDay: {
        type: String,
        default: ""
      },
      availableDate: {
        type: String,
        default: ""
      },
      startTime: {
        type: String,
        default: ""
      },
      endTime: {
        type: String,
        default: ""
      }
    });

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
