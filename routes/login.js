/* eslint-disable no-underscore-dangle */
const express = require('express');
const jwt = require('jsonwebtoken');
const yup = require('yup');

const StatusMessageError = require('../others/StatusMessageError');

const Student = require('../models/student');
const Teacher = require('../models/teacher');

const router = express.Router();

const schema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password should be at least 8 characters long'),
});

router.post('/student', async (req, res) => {
  try {
    await schema.validate(req.body);
    const result = await Student.findOne({ email: req.body.email }).select(
      '_id fullName email password qualification isEmailVerified',
    );
    if (!result) throw new Error('Student not found');
    // The record lies in _doc field for Mongoose findeOne
    if (!result._doc) throw new Error('Student not found');
    const student = result._doc;
    if (student.password !== req.body.password)
      throw new Error('Incorrect password, please try again');
    if (!student.isEmailVerified) throw new Error('Email not verified, please verify your email');
    const token = jwt.sign(
      {
        student: { ...student, password: undefined, confirmationCode: undefined },
        role: 'student',
      }, // Password should not be shared
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );
    return res.json({
      student: {
        ...student,
        password: undefined, // Password should not be shared
        confirmationCode: undefined, // Code should not be shared
      },
      token,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.post('/teacher', async (req, res) => {
  try {
    await schema.validate(req.body);
    const result = await Teacher.findOne({ email: req.body.email }).select();
    if (!result) throw new Error('Teacher not found');
    // The record lies in _doc field for Mongoose findeOne
    if (!result._doc) throw new Error('Teacher not found');
    const teacher = result._doc;
    if (teacher.password !== req.body.password)
      throw new Error('Incorrect password, please try again');
    // if (!teacher.isEmailVerified) throw new Error('Email not verified, please verify your email');
    const token = jwt.sign(
      {
        teacher: { ...teacher, password: undefined },
        role: 'teacher',
      }, // Password should not be shared
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );
    return res.json({
      teacher: {
        ...teacher,
        password: undefined, // Password should not be shared
      },
      token,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.post('/admin', async (req, res) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (e) {
    return res.status(500).json({ error: e.errors[0] });
  }
  if (req.body.email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Admin email is incorrect' });
  }
  if (req.body.password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Admin password is incorrect' });
  }
  const token = jwt.sign({ admin: 'admin', role: 'admin' }, process.env.JWT_SECRET);
  return res.json({ admin: 'admin', token });
});

router.get('/verify', async (req, res) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new StatusMessageError('Unauthorized request', 401);
    // Authorization format: Bearer <token>
    const token = authorization.split(' ')[1];
    if (!token) throw new StatusMessageError('Unauthorized request', 401);
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ ...user });
  } catch (e) {
    if (e.status) {
      res.status(e.status || 401).json({ error: e.message });
    } else if (e instanceof jwt.TokenExpiredError) {
      res.status(403).json({ error: 'Session expired, please login again' });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
});

module.exports = router;
