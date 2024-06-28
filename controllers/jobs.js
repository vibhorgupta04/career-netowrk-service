const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Job = require('../models/Job');

// @desc     Get all jobs
// @route    GET /api/v1/jobs
// @access   Public
exports.getJobs = asyncHandler(async (req, res, next) => {
  // Initialize variables
  let fetchedJobs;
  let query = {};

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from query parameters
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Remove excluded fields from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Parse query string to JSON
  query = JSON.parse(queryStr);

  // Find jobs based on query
  fetchedJobs = Job.find(query);

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    fetchedJobs = fetchedJobs.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    fetchedJobs = fetchedJobs.sort(sortBy);
  } else {
    fetchedJobs = fetchedJobs.sort({ job_posted_at_datetime_utc: -1 }); // Default sorting by descending job_posted_at_datetime_utc
  }

  // Pagination
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10; // Default limit to 10 items per page

  if (page < 1) {
    page = 1;
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Job.countDocuments(query);

  fetchedJobs = fetchedJobs.skip(startIndex).limit(limit);

  // Execute query
  const jobs = await fetchedJobs;

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

// @desc    Get job by id
// @route   GET /api/v1/jobs/:id
// @access   Public
exports.getJob = async (req, res, next) => {
  const parsedId = req.params.id?.toString();
  if (!parsedId) {
    return next(new ErrorResponse('Job id not passed.', 500));
  }
  try {
    const job = await Job.findById(parsedId);
    if (!job) {
      return next(
        new ErrorResponse(`Job not found with id of ${parsedId}`, 404)
      );
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job
// @route   POST /api/v1/jobs
// @access  Private
exports.createJob = async (req, res, next) => {
  // Add user to req.body
  req.body.user = req?.user?._id;
  // check for published job
  const publishJob = await Job.findOne({ user: req.user._id });
  // If user is not an admin, they can only add one job
  if (publishJob && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a Job`,
        400
      )
    );
  }

  try {
    const newJob = await Job.create(req.body);
    res.status(201).json({ success: true, data: newJob });
  } catch (error) {
    next(error);
  }
};

// @desc    Update new job
// @route    PUT /api/v1/jobs
// @access     Private
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404);
    }
    // if (job.user?.toString() !== req.user.id && req.user.role !== 'admin') {
    //   new ErrorResponse(
    //     `User ${req.params.id} is not authorized to update this job`,
    //     401
    //   );
    // }
    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route    DELETE /api/v1/jobs/:id
// @access     Private
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404);
    }
    // if (job.user?.toString() !== req.user.id && req.user.role !== 'admin') {
    //   new ErrorResponse(
    //     `User ${req.params.id} is not authorized to delete this job`,
    //     401
    //   );
    // }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Search jobs
// @route   GET /api/v1/jobs/:id
// @access  Public
exports.searchJobs = asyncHandler(async (req, res, next) => {
  let query = {};
  const { keyword, employmentType, remote, job_city, country } = req.query;

  // Keyword search
  if (keyword) {
    query.$or = [
      { job_title: new RegExp(keyword, 'i') },
      { job_description: new RegExp(keyword, 'i') },
    ];
  }

  // Filters
  if (employmentType) {
    query.job_employment_type = employmentType;
  }
  if (remote) {
    query.job_is_remote = remote === 'true';
  }
  if (job_city) {
    query.job_city = job_city;
  }
  if (country) {
    query.job_country = country;
  }

  // Find jobs based on query
  let fetchedJobs = Job.find(query);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    fetchedJobs = fetchedJobs.sort(sortBy);
  } else {
    fetchedJobs = fetchedJobs.sort({ job_posted_at_datetime_utc: -1 });
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  fetchedJobs = fetchedJobs.skip(startIndex).limit(limit);

  // Execute query
  const jobs = await fetchedJobs;
  const total = await Job.countDocuments(query);

  // Pagination result
  const pagination = {};
  if (startIndex + limit < total) {
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
