const express = require('express');
const Application = require('../../models/application');

const applicationsRouter = express.Router();

applicationsRouter.get('/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    const applications = await Application.find({ test: testId === 'undefined' ? undefined : testId }).populate('test', { questions: 0 }).populate('student').exec();
    res.json({ applications });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

applicationsRouter.put('/', async (req, res) => {
  try {
    const data = req.body;
    const application = await Application.updateOne(
      { _id: data._id },
      { approved: data.approved },
      { new: true },
    );
    res.json({ application });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = applicationsRouter;
