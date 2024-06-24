const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
// const { param } = require('../routes/bootcamps');

// @desc    Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access     Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // Create req.query
  const reqQuery = { ...req.query };

  // Field to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

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
  query = Bootcamp.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
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
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const bootcamps = await query;

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
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});
// exports.getBootcamps = async (req, res, next) => {
//   try {
//     const bootcamps = await Bootcamp.find();
//     res
//       .status(200)
//       .json({ success: true, count: bootcamps.length, data: bootcamps });
//   } catch (error) {
//     next(error);
//   }
// };

// @desc    Get single bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access     Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new bootcamp
// @route    POST /api/v1/bootcamps
// @access     Private
exports.createBootcamp = async (req, res, next) => {
  // Add user to req.body
  req.body.user = req?.user?._id;
  console.log('req body', req.body);

  // check for published bootcamp
  const publishBootcamp = await Bootcamp.findOne({ user: req.user._id });

  // If user is not an admin, they can only add one bootcamp
  if (publishBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

  try {
    const newBootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: newBootcamp });
  } catch (error) {
    next(error);
  }
};

// @desc    Update new bootcamp
// @route    PUT /api/v1/bootcamps
// @access     Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    let bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404);
    }

    // Make sure user is bootcamp owner

    console.log('bootcamp====>', bootcamp.user.toString());
    console.log('req.use===>', req.user);
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this bootcamp`,
        401
      );
    }

    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access     Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404);
    }
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this bootcamp`,
        401
      );
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
