const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
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
  cnic: {
    type: Number,
    required: true,
    unique: true,
    min: 1000000000000,
    max: 9999999999999,
  },
  qualification: {
    type: String,
    required: true,
    trim: true,
    default: '',
  },
  age: {
    type: Number,
    default: 10,
    min: 10,
    max: 60,
  },
  gender: {
    type: String,
    enum: ['male', 'female', ''],
    default: '',
  },
  fatherName: {
    type: String,
    trim: true,
    default: '',
  },
  phoneNumber: {
    type: Number,
    default: 0,
  },
  address: {
    type: String,
    trim: true,
    default: '',
  },
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
