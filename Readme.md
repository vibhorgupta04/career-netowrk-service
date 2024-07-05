# Job Search API

This is a job search API built with Express.js and MongoDB, allowing users to search for jobs, bookmark them, and retrieve bookmarked jobs.

## Features

- **Job Search**: Search for jobs based on keywords, filters, and sorting.
- **Bookmark Jobs**: Users can bookmark jobs for later reference.
- **Pagination**: Supports pagination for job listings.
- **Sorting**: Sort jobs by various fields.

## Table of Contents

- [Endpoints](#endpoints)
  - [Job Search](#job-search)
  - [Bookmark Jobs](#bookmark-jobs)
  - [Get Bookmarked Jobs](#get-bookmarked-jobs)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)

## Endpoints

### Job Search

- **GET /api/jobs/search**
  - **Query Parameters**:
    - `keyword`: Search keyword.
    - `employmentType`: Filter by job employment type.
    - `remote`: Filter for remote jobs (`true` or `false`).
    - `job_city`: Filter by city.
    - `country`: Filter by country.
    - `sort`: Sort by fields (e.g., `job_title`).
    - `page`: Page number for pagination.
    - `limit`: Number of jobs per page.
  - **Example Request**:
    ```
    GET /api/jobs/search?keyword=developer&remote=true&sort=job_title&page=1&limit=10
    ```
  - **Example Response**:
    ```json
    {
      "jobs": [
        {
          "id": "1",
          "title": "Frontend Developer",
          "company": "Tech Company",
          "location": "Remote",
          "employmentType": "Full-time"
        }
      ],
      "total": 50,
      "page": 1,
      "limit": 10
    }
    ```

### Bookmark Jobs

- **POST /api/jobs/bookmark**
  - **Body**:
    ```json
    {
      "jobId": "12345"
    }
    ```
  - **Example Response**:
    ```json
    {
      "message": "Job bookmarked successfully"
    }
    ```

- **DELETE /api/jobs/bookmark**
  - **Body**:
    ```json
    {
      "jobId": "12345"
    }
    ```
  - **Example Response**:
    ```json
    {
      "message": "Job removed from bookmarks"
    }
    ```

### Get Bookmarked Jobs

- **GET /api/jobs/bookmarks**
  - **Example Response**:
    ```json
    {
      "bookmarkedJobs": [
        {
          "id": "1",
          "title": "Frontend Developer",
          "company": "Tech Company",
          "location": "Remote"
        }
      ]
    }
    ```

## Installation

### Prerequisites

- Node.js
- MongoDB

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/vibhorgupta04/career-netowrk-service.git

2. Install dependencies:
   ```bash
   cd career-netowrk-service
   npm install

3. Set up environment variables:
   
    Create a .env file in the root directory and add your MongoDB URI and any other necessary            configurations:
    ```bash
    MONGO_URI=mongodb://localhost:27017/jobsearch

## Usage

- Use Postman or a similar tool to test the API endpoints.
- Ensure MongoDB is running and accessible.

## Screenshots

### Get Job
<img width="1208" alt="Screenshot 2024-07-05 at 1 28 18 PM" src="https://github.com/vibhorgupta04/career-netowrk-service/assets/84231156/aa7acd26-52e0-4fe9-b00d-3d87717b774d">

### Create new User
<img width="1222" alt="Screenshot 2024-07-05 at 1 29 29 PM" src="https://github.com/vibhorgupta04/career-netowrk-service/assets/84231156/8097413b-08e2-4154-ac4b-466dd8b2f4df">
