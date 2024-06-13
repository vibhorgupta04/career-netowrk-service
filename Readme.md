---
title: Job Search API
---

# Job Search API

This is a job search API built with Express.js and MongoDB, allowing users to search for jobs, bookmark them, and retrieve bookmarked jobs.

## Features

- **Job Search**: Search for jobs based on keywords, filters, and sorting.
- **Bookmark Jobs**: Users can bookmark jobs for later reference.
- **Pagination**: Supports pagination for job listings.
- **Sorting**: Sort jobs by various fields.

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

### Bookmark Jobs

- **POST /api/jobs/bookmark**
  - **Body**:
    - `jobId`: ID of the job to bookmark.

- **DELETE /api/jobs/bookmark**
  - **Body**:
    - `jobId`: ID of the job to remove from bookmarks.

### Get Bookmarked Jobs

- **GET /api/jobs/bookmarks**

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vibhorgupta04/career-netowrk-service.git
   ```

2. Install dependencies:

  ```bash
  cd career-netowrk-service
  npm install
  ```

3. Set up environment variables:

Create a .env file and add your MongoDB URI and any other necessary configurations.

4. Run the project
```bash
npm run dev
```

4. To deploy you can use service like render.

## Usage

- Use Postman or a similar tool to test the API endpoints.
- Ensure MongoDB is running and accessible.