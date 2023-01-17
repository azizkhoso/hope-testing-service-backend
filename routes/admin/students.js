const express = require('express');
const Student = require('../../models/student');

const adminStudentsRouter = express.Router();

adminStudentsRouter.get('/', async (req, res) => {
  try {
    const lim = 10;
    const page = Number(req.query.page || 0);
    const totalStudents = await Student.count();
    const students = await Student.find().skip((page - 1) * lim).limit(lim).sort('fullName');
    res.json({ students, totalStudents });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = adminStudentsRouter;