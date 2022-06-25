const express = require('express');
const Student = require('../../models/student');

const adminStudentsRouter = express.Router();

adminStudentsRouter.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json({ students });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = adminStudentsRouter;