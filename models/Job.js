const mongoose = require('mongoose');
const slugify = require('slugify');

const ApplyOptionSchema = new mongoose.Schema({
  publisher: {
    type: String,
    required: true,
  },
  apply_link: {
    type: String,
    required: true,
  },
  is_direct: {
    type: Boolean,
    required: true,
  },
});

const JobRequiredExperienceSchema = new mongoose.Schema({
  no_experience_required: {
    type: Boolean,
    required: true,
  },
});

const JobSchema = new mongoose.Schema({
  employer_name: {
    type: String,
    required: true,
  },
  slug: String,
  employer_logo: {
    type: String,
  },
  job_employment_type: {
    type: String,
    required: true,
  },
  job_title: {
    type: String,
    required: true,
  },
  apply_options: [ApplyOptionSchema],
  job_description: {
    type: String,
    required: true,
  },
  job_is_remote: {
    type: Boolean,
    required: true,
  },
  job_posted_at_datetime_utc: {
    type: Date,
    required: true,
  },
  job_city: {
    type: String,
    required: true,
  },
  job_state: {
    type: String,
    required: false,
  },
  job_country: {
    type: String,
    required: true,
  },
  job_latitude: {
    type: Number,
    required: false,
  },
  job_longitude: {
    type: Number,
    required: false,
  },
  job_google_link: {
    type: String,
    required: true,
  },
  job_required_experience: JobRequiredExperienceSchema,
  job_required_skills: {
    type: [String],
  },
  job_min_salary: {
    type: Number,
    required: true,
  },
  job_max_salary: {
    type: Number,
    required: true,
  },
  job_salary_currency: {
    type: String,
    required: true,
  },
  job_salary_period: {
    type: String,
    required: true,
  },
  job_highlights: {
    Qualifications: [String],
    Responsibilities: [String],
  },
});

JobSchema.pre('save', function (next) {
  this.slug = slugify(this.employer_name, { lower: true });
  next();
});

module.exports = mongoose.model('Job', JobSchema);
