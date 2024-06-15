const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Job = require('../models/Job');

// @desc    Get all jobs
// @route    GET /api/v1/jobs
// @access     Public
exports.getJobs = asyncHandler(async (req, res, next) => {
  let query;

  // Create req.query
  const reqQuery = { ...req.query };

  // Field to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields  and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  console.log('reqQuery---->', reqQuery);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create  operators ($gt, $gte,  etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = Job.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
    console.log('fields---->', fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('CreatedAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Job.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const jobs = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: jobs.length,
    pagination,
    data: jobs,
  });
});
