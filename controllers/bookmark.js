const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// Add or remove a bookmark
exports.toggleBookmark = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const { jobId } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const bookmarkIndex = user.bookmarks.indexOf(jobId);

  if (bookmarkIndex === -1) {
    user.bookmarks.push(jobId); // Add bookmark
  } else {
    user.bookmarks.splice(bookmarkIndex, 1); // Remove bookmark
  }

  await user.save();

  res.status(200).json({
    success: true,
    bookmarks: user.bookmarks,
  });
});

// Get all bookmarked jobs
exports.getBookmarks = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('bookmarks');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    bookmarks: user.bookmarks,
  });
});
