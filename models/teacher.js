const mongoose = require('mongoose');

const TeacherSchema = mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: true,
    minLength: 2,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: true,
    minLength: 3,
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minLength: 8,
  },
  subjects: {
    type: [String],
    required: true,
    minLength: 1,
  },
  cnic: {
    type: Number,
    required: true,
    unique: true,
    min: 1000000000000,
    max: 9999999999999,
  },
  phoneNumber: {
    type: String,
    unique: true,
    default: '',
  },
  address: {
    type: String,
    trim: true,
    default: '',
  },
});

const Teacher = mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;
