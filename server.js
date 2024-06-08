const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

const logger = require('./middleware/logger');

// Loads env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Routes files
const bootcamps = require('./routes/bootcamps');

const app = express();

// Body parser
app.use(express.json());

// app.use(logger);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mounts routers
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handled unhandled promise rejections
process.on('uncaughtRejection', (err, promise) => {
  console.log(`Error: ${err.message}.red`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
