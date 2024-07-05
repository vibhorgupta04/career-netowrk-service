const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  searchJobs,
  // getJobsInRadius,
} = require('../controllers/jobs');
const { protect, authorize } = require('../middleware/auth');
const { getBookmarks, toggleBookmark } = require('../controllers/bookmark');

const router = express.Router();

// router.route('/radius/:zipcode/:distance').get(getJobsInRadius);

router.route('/').get(getJobs).post(protect, createJob);

router.route('/search').get(searchJobs);
router.route('/bookmark').get(protect, getBookmarks).post(protect, toggleBookmark);

router.route('/:id').get(getJob).put(updateJob).delete(deleteJob);

module.exports = router;
