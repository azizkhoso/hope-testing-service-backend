const express = require('express');
const yup = require('yup');

const Teacher = require('../../models/teacher');
const router = express.Router();


const teacherSchema = yup.object({
  fullName: yup
    .string()
    .required('Full Name is required')
    .min(2, 'Full Name should be at least 2 characters long'),
  email: yup
    .string()
    .email('Email should be valid')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password should be at least 8 characters long'),
  subjects: yup
    .array()
    .of(yup.string().required('Subject is required'))
    .required('At least one subject is required'),
  cnic: yup
    .number()
    .required('CNIC is required')
    .min(1000000000000, 'CNIC should be a valid number')
    .max(9999999999999, 'CNIC should be a valid number'),
  phoneNumber: yup
    .string()
    .min(10, 'Phone Number should be at least 10 digits long')
    .default(''),
  address: yup.string().default(''),
});

router.get('/', async (req, res) => {
  try {
    const lim = 10;
    const page = Number(req.query.page || 0);
    const totalTeachers = await Teacher.count();
    const teachers = await Teacher.find()
      .skip((page - 1) * lim)
      .limit(lim)
      .sort('fullName');
    res.json({ teachers, totalTeachers });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    await teacherSchema.validate(req.body);
    const teacher = await Teacher.create(req.body);
    res.json({ teacher });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/:_id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params._id);
    res.json({ teacher });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:_id', async (req, res) => {
  try {
    await teacherSchema.validate(req.body);
    const teacher = await Teacher.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true },
    );
    res.json({ teacher });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:_id', async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndDelete({ _id: req.params._id });
    res.json({ teacher });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;