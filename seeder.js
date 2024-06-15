const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load modals
const Bootcamp = require('./models/Bootcamp');
const Job = require('./models/Job');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  // useUnifiedTopology: true
});

// Read JSON files
// const bootcamps = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
// );
const jobs = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/jobs.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    // await Bootcamp.create(bootcamps);
    await Job.create(jobs);
    console.log('Data Imported...'.green.inverse);
  } catch (error) {
    console.log(error);
  }
};

// Delete data
const deleteData = async () => {
  try {
    // await Bootcamp.deleteMany();
    await Job.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
