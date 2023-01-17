/* eslint-disable no-underscore-dangle */
const express = require('express');
const Test = require('../models/test');
const Announcement = require('../models/announcement');
const StatusMessageError = require('../others/StatusMessageError');
const Student = require('../models/student');
const transport = require('../config/transport');
const thankyouEmail = require('../emailTemplates/thankyouEmail');

const router = express.Router();

router.get('/announcements', async (req, res) => {
  const { query } = req;
  try {
    let announcements;
    if (query.isImportant) {
      announcements = await Announcement.find({
        isImportant: true,
      });
    } else {
      announcements = await Announcement.find();
    }
    res.json({ announcements });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/demo-tests', async (req, res) => {
  const { query } = req;
  try {
    const demoTests = await Test.find({
      isDemo: true,
      ...query,
    });
    res.json({ demoTests });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/demo-tests/:_id', async (req, res) => {
  try {
    const result = await Test.findOne({ _id: req.params._id });
    if (!result) throw new StatusMessageError('Test not found', 404);
    res.json({ demoTest: result._doc });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

router.get('/verify-email', async (req, res) => {
  try {
    const { email, confirmationCode } = req.query;
    const student = await Student.findOne({ email });
    if (!student) throw new Error('Student not found with provided email');
    if (Number(student.confirmationCode) === Number(confirmationCode)) {
      // changing confirmation code after successfull verification
      const newCode = Number(Math.random() * 1000000).toFixed(0);
      await Student.updateOne(
        { email },
        { $set: { isEmailVerified: true, confirmationCode: newCode } },
      );
      await transport.sendMail({
        from: 'info.htspakistan@gmail.com',
        to: student.email,
        subject: 'Thank you for registering into Hope Testing Service',
        html: thankyouEmail(student.fullName),
      });
      res.send(thankyouEmail(student.fullName));
    } else {
      throw new Error('Invalid confirmation link');
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
