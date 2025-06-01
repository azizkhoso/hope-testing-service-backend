const express = require('express');
const yup = require('yup');
const Announcement = require('../../models/announcement');

const router = express.Router();

const announcementSchema = yup.object({
  title: yup.string().min(2, 'Title should be at least 2 characters long').required('Title is required'),
  details: yup.string().min(3, 'Details should be at least 3 characters long').required('Details are required'),
  link: yup.string().matches(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Link should be valid').test('emptyLink', 'Link can be empty', (value) => value !== ''),
  isImportant: yup.bool('isImportant should be boolean'),
});

router.get('/announcements', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const totalAnnouncements = await Announcement.countDocuments({ createdBy: req.teacher._id });
    const announcements = await Announcement.find({ createdBy: req.teacher._id })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ announcements, totalAnnouncements, page, limit });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/announcements', async (req, res) => {
  try {
    console.log(req.teacher);
    await announcementSchema.validate(req.body);
    const announcement = Announcement.create({
      ...req.body,
      createdBy: req.teacher._id,
    });
    res.json({ announcement });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/announcements/:_id', async (req, res) => {
  try {
    const announcement = await Announcement.findOneAndDelete(
      { _id: req.params._id, createdBy: req.teacher._id },
      { new: true },
    );
    res.json({ announcement });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;