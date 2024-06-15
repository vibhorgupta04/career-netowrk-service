const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobsInRadius,
} = require('../controllers/jobs');

const router = express.Router();

router.route('/radius/:zipcode/:distance').get(getJobsInRadius);

router.route('/').get(getJobs).post(createJob);

router.route('/:id').get(getJob).put(updateJob).delete(deleteJob);

module.exports = router;
