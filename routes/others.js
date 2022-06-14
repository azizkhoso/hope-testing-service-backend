/* eslint-disable no-underscore-dangle */
const express = require('express');
const Test = require('../models/test');
const Announcement = require('../models/announcement');
const StatusMessageError = require('../others/StatusMessageError');

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

module.exports = router;
