/* eslint-disable no-underscore-dangle */
const express = require('express');
const date = require('date-and-time');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const Test = require('../../models/test');
const StatusMessageError = require('../../others/StatusMessageError');
const Submission = require('../../models/submission');
const Application = require('../../models/application');

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'uploads/challans/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const router = express.Router();

router.get('/tests', async (req, res) => {
  try {
    const tests = await Test.find({ isDemo: false }).select('-questions');
    res.json({ tests });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/tests/:_id', async (req, res) => {
  try {
    const result = await Test.findOne({ _id: req.params._id });
    if (!result) throw new StatusMessageError('Test not found', 404);
    // Check whether student has already attempted or not
    const found = await Submission.findOne({ testId: result._id, submittedBy: req.student._id });
    if (found && found._doc) throw new StatusMessageError('Test is already attempted', 400);
    // Check whether test can be attempted or not
    const test = result._doc;
    const now = new Date();
    const startsAt = new Date(test.startsAt);
    const submittableBefore = new Date(test.submittableBefore);
    const isSubmittable = (date.subtract(submittableBefore, now).toSeconds() > 0)
                          || (date.subtract(now, startsAt).toSeconds() > 0);
    if (!isSubmittable) throw new StatusMessageError('Test is not active at the moment', 400);
    res.json({ test: result._doc });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

router.post('/submissions', async (req, res) => {
  try {
    const result = await Test.findOne({ _id: req.body.testId });
    if (!result) throw new StatusMessageError('Test not found', 404);
    const test = result._doc;
    // Check whether test is already submitted
    const found = await Submission.findOne({ testId: test._id, submittedBy: req.student._id });
    if (found && found._doc) throw new StatusMessageError('Test is already attempted', 400);
    // Check whether test can be submitted or not
    const now = new Date();
    const startsAt = new Date(test.startsAt);
    const submittableBefore = new Date(test.submittableBefore);
    const isSubmittable = (date.subtract(submittableBefore, now).toSeconds() > 0)
                          || (date.subtract(now, startsAt).toSeconds() > 0);
    if (!isSubmittable) throw new StatusMessageError('Test is not active at the moment', 400);
    const submission = await Submission.create({
      testId: req.body.testId,
      submittedBy: req.student._id,
      answers: req.body.answers,
    });
    res.json({ _id: submission._id });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

const upload = multer({ storage, limits: { fileSize: 30000 } });
router.post('/test-application', upload.single('image'), async (req, res) => {
  try {
    const foundApplication = await Application.findOne(
      { test: req.body.test, student: req.student._id },
    );
    if (foundApplication) {
      fs.unlinkSync(`uploads/challans/${req.file.originalname}`);
      throw new Error('Already applied');
    }
    const oldFileName = req.file.originalname;
    const ext = path.extname(oldFileName);
    const newName = `${oldFileName}${Math.random()}${ext}`;
    fs.renameSync(`uploads/challans/${oldFileName}`, `uploads/challans/${newName}`);
    const application = req.body;
    const updated = {
      ...application,
      image: newName,
    };
    const newApplication = await Application.create(updated);
    res.json({ newApplication });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
