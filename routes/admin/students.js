const express = require('express');
const Student = require('../../models/student');
const Submission = require('../../models/submission');

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

// DELETE /admin/students/:id
adminStudentsRouter.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) throw new Error('Student not found');
    res.json(student);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminStudentsRouter.get('/:id/tests', async (req, res) => {
  try {
    const submission = await Submission.findOne({ submittedBy: req.params.id }).populate('test');
    if (!submission) throw new Error('Test Submission not found');
    res.json({ submission });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
})

module.exports = adminStudentsRouter;