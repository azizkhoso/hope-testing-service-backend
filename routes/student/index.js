/* eslint-disable no-underscore-dangle */
const express = require('express');
const date = require('date-and-time');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

const Test = require('../../models/test');
const StatusMessageError = require('../../others/StatusMessageError');
const Submission = require('../../models/submission');
const Application = require('../../models/application');

// assuming this file is in routes/students and root is where package.json is
const rootDir = path.join(__dirname, '..', '..');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Correct path to uploads/challans under root
    const directory = path.join(rootDir, 'uploads', 'challans', req.student._id);

    // create directory if it doesn't exist
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    cb(null, directory);
  },
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(8).toString('base64').replace(/[\/\\]/g, 'e');
    const name = `${hash}---${file.originalname}`;
    cb(null, name);
  },
});

const router = express.Router();

// email verification check
router.use((req, res, next) => {
  try {
    if (!req.student?.isEmailVerified) {
      throw new Error('Email not verified');
    } else next();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/tests', async (req, res) => {
  try {
    const tests = await Test.find({ isDemo: false }).select('-questions');
    const attemptedTests = await Submission.find({ submittedBy: req.student._id }).select('test totalCorrect').lean();
    res.json({ tests, attemptedTests });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/tests/:_id', async (req, res) => {
  try {
    const application = await Application.findOne({
      test: req.params._id,
      student: req.student._id,
    });
    if (!application || !application._doc)
      throw new Error('Not applied, please submit your challan first');
    if (!application._doc.approved)
      throw new Error('Not eligible, your challan is not approved yet');
    const result = await Test.findOne({ _id: req.params._id });
    if (!result) throw new StatusMessageError('Test not found', 404);
    // Check whether student has already attempted or not
    const found = await Submission.findOne({ test: result._id, submittedBy: req.student._id });
    if (found && found._doc) throw new StatusMessageError('Test is already attempted', 400);
    // Check whether test can be attempted or not
    const test = result._doc;
    const now = new Date();
    const startsAt = new Date(test.startsAt);
    const submittableBefore = new Date(test.submittableBefore);
    const isSubmittable =
      date.subtract(submittableBefore, now).toSeconds() > 0 ||
      date.subtract(now, startsAt).toSeconds() > 0;
    if (!isSubmittable) throw new StatusMessageError('Test is not active at the moment', 400);
    res.json({ test: result._doc });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

router.post('/submissions', async (req, res) => {
  try {
    const result = await Test.findOne({ _id: req.body.test });
    if (!result) throw new StatusMessageError('Test not found', 404);
    const test = result._doc;
    // Check whether test is already submitted
    const found = await Submission.findOne({ test: test._id, submittedBy: req.student._id });
    if (found && found._doc) throw new StatusMessageError('Test is already attempted', 400);
    // Check whether test can be submitted or not
    const now = new Date();
    const startsAt = new Date(test.startsAt);
    const submittableBefore = new Date(test.submittableBefore);
    const isSubmittable =
      date.subtract(submittableBefore, now).toSeconds() > 0 ||
      date.subtract(now, startsAt).toSeconds() > 0;
    if (!isSubmittable) throw new StatusMessageError('Test is not active at the moment', 400);
    const submission = await Submission.create({
      test: req.body.test,
      submittedBy: req.student._id,
      answers: req.body.answers,
    });
    res.json({ _id: submission._id });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

const upload = multer({ storage, limits: { fileSize: 300000 } });
router.post('/test-application', upload.single('image'), async (req, res) => {
  try {
    // Ensure file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required.' });
    }

    // Check if application already exists
    const foundApplication = await Application.findOne({
      test: req.body.test,
      student: req.student._id,
    });

    if (foundApplication) {
      // Construct full file path safely
      // const filePath = path.join(__dirname, '..', '..', 'uploads', 'challans', req.student._id, req.file.filename);
      const filePath = path.join(req.file.destination, req.file.filename);
      console.log('Deleting uploaded file:', filePath);

      // Delete uploaded file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(400).json({ error: 'Already applied' });
    }

    // Prepare application data
    const application = {
      ...req.body,
      image: req.file.filename,
      student: req.student._id,
    };

    // Create application
    const newApplication = await Application.create(application);
    res.json({ newApplication });

  } catch (e) {
    console.error('Upload error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
