// Database collection for storing applications of students applying for tests
const mongoose = require('mongoose');

const ApplicationSchema = mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  image: {
    type: String,
    required: true,
    default: '',
  },
  approved: {
    type: Boolean,
    default: false,
  },
});

const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;
