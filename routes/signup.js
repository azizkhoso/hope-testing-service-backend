/* eslint-disable no-underscore-dangle */
const express = require('express');
const yup = require('yup');
const Student = require('../models/student');
const transport = require('../config/transport');
const verifyEmail = require('../emailTemplates/verifyEmail');

const studentSchema = yup.object({
  fullName: yup
    .string()
    .required('Full Name is required')
    .min(2, 'Full Name should be at least 2 characters long'),
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password should be at least 8 characters long'),
  cnic: yup
    .number()
    .required('CNIC is required')
    .min(1000000000000, 'Enter a valid CNIC')
    .max(9999999999999, 'Enter a valid CNIC'),
});

const router = express.Router();

router.post('/student', async (req, res) => {
  try {
    await studentSchema.validate(req.body);
    try {
      const confirmationCode = Number(Math.random() * 1000000).toFixed(0);
      const student = await Student.create({ ...req.body, confirmationCode });
      await transport.sendMail({
        from: 'info.htspakistan@gmail.com',
        to: student.email,
        subject: 'Email Verification',
        html: verifyEmail(student.fullName, student.email, confirmationCode),
      });
      res.json({ _id: student._id, fullName: student.fullName });
    } catch (e) {
      if (e.code === 11000) {
        res.status(400).json({ error: 'User email or CNIC already exists' });
      } else throw e;
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
