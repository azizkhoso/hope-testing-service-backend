require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const othersRouter = require('./routes/others');
const adminRouter = require('./routes/admin');
const studentRouter = require('./routes/student');
const teacherRouter = require('./routes/teacher');

const verifyToken = require('./middlewares/verifyToken');

try {
  if (!fs.existsSync('uploads')) {
    console.log('creating uploads direcotry');
    fs.mkdirSync('uploads');
  } else if (!fs.existsSync('uploads/challans')) {
    console.log('creating uploads/challans directory');
    fs.mkdirSync('uploads/challans');
  }
} catch (e) {
  console.error(e.message);
}

const app = express();
const db = require('./config/db');

app.use(cors()); // For accessing from any where
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads/challans', express.static(path.join(__dirname, 'uploads', 'challans')));

app.use('/', othersRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/admin', verifyToken, adminRouter);
app.use('/student', verifyToken, studentRouter);
app.use('/teacher', verifyToken, teacherRouter);

db.once('open', () => console.log('Connected to database successfully...'));
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
