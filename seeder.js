const fs = require('fs');
const mongoose = require('mongoose');


// Load modals
const Job = require('./models/Job');
const User = require('./models/User');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {});

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await User.create(users);
    console.log('Data Imported...'.green.inverse);
  } catch (error) {
    console.log(error);
  }
};

// Delete data
const deleteData = async () => {
  try {
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
