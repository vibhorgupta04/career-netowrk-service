const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require('../controllers/bootcamps');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/')
  .get(getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
