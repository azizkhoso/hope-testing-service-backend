const mongoose = require('mongoose');

const Test = require('./test');

const SubmissionSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  answers: {
    type: [
      new mongoose.Schema({
        questionId: {
          type: String,
          required: true,
          trim: true,
        },
        answer: {
          type: String,
          trim: true,
          default: '',
        },
      }),
    ],
    required: true,
  },
  totalCorrect: {
    type: Number,
    default: 0,
  }
});

SubmissionSchema.pre('save', async function(next) {
  const result = await Test.findById(this.test);
  if (!result) throw new Error('Test not found');
  const test = result._doc;
  let totalCorrect = 0;
  test.questions.forEach((q) => {
    const correctAnswer = q.answer;
    const givenAnswer = this.answers.find((a) => a.questionId == q.id)?.answer;
    if (correctAnswer === givenAnswer) totalCorrect++;
  })
  this.totalCorrect = totalCorrect;
  next();
});

const Submission = mongoose.model('Submission', SubmissionSchema);

module.exports = Submission;
