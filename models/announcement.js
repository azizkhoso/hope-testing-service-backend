/* eslint-disable no-useless-escape */
const mongoose = require('mongoose');

const AnnouncementSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    minLength: 2,
  },
  details: {
    type: String,
    trim: true,
    required: true,
    minLength: 3,
  },
  link: {
    type: String,
    trim: true,
    default: '',
  },
  isImportant: {
    type: Boolean,
    default: false,
  },
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

module.exports = Announcement;
