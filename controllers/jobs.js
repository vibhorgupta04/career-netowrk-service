const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Job = require('../models/Job');

// @desc     Get all jobs
// @route    GET /api/v1/jobs
// @access   Public
exports.getJobs = asyncHandler(async (req, res, next) => {
  let fetchedJobs = null;

  // Create req.query
  const reqQuery = { ...req.query };

  // Field to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  if (reqQuery) {
    // Loop over removeFields  and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create  operators ($gt, $gte,  etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    fetchedJobs = await Job.find(JSON.parse(queryStr));
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    console.log('fetchedJobs', fetchedJobs);
    fetchedJobs = fetchedJobs.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    fetchedJobs = fetchedJobs.sort(sortBy);
  } else {
    // fetchedJobs = fetchedJobs.sort('job_posted_at_datetime_utc');
    fetchedJobs = fetchedJobs.sort((a, b) => a.job_posted_at_datetime_utc - b.job_posted_at_datetime_utc)
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Job.countDocuments();

  // fetchedJobs = fetchedJobs.skip(startIndex).limit(limit);

  // Executing query
  const jobs = fetchedJobs;

  // Pagination result
  // const pagination = {};

  // if (endIndex < total) {
  //   pagination.next = {
  //     page: page + 1,
  //     limit,
  //   };
  // }

  // if (startIndex > 0) {
  //   pagination.prev = {
  //     page: page - 1,
  //     limit,
  //   };
  // }


  // const jobs = await Job.find();


  res.status(200).json({
    success: true,
    count: jobs.length,
    // pagination,
    data: jobs,
  });
});

// exports.getJobs = async (req, res, next) => {
//   try {
//     const jobs = await Job.find();
//     res
//       .status(200)
//       .json({ success: true, count: jobs.length, data: jobs });
//   } catch (error) {
//     next(error);
//   }
// };
