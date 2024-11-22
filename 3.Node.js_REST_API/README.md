# Job Management Service

## Overview

This is a TypeScript-based job management service. It allows users to:

1. Create Export Jobs: Export books in specified formats (e.g., EPUB, PDF).
2. Create Import Jobs: Import books from external sources (e.g., Word documents, PDFs, Wattpad, Evernote).
3. List Jobs: Retrieve lists of import and export jobs grouped by their states.

## Architecture Decisions

### 1. Separation of Responsibilities

- **Controllers**: Handle request validation, logging, and response construction.
- **Services**: Contain business logic for job management.
- **Validators**: Use Zod schemas to validate incoming requests.
- **Middleware**:
  - Logging: Logs incoming requests, errors, and other significant events.
  - Validation: Validates requests against defined schemas.
  - Error Handling: Centralized error handling for consistent error responses.
- **Utilities**: Provide reusable functions for common tasks.

### 2. Consistent Architecture

- Structured using a clear MVC pattern.
- Centralized error handling with a custom AppError class.
- Logging implemented via a logger middleware, using unique requestIds for traceability.

### 3. Observability

- Requests are logged with their method, URL, timestamps, and requestId.
- Validation errors and internal errors are captured with detailed error messages.
- Processing time for each request is logged for performance monitoring.

### 4. Testing

- Comprehensive test suite covering controllers, services, middleware, and validators.
- Jest and Supertest are used for unit and integration tests.
- Tests are run against an in-memory database for fast and isolated tests.

In addition to the unit tests, a comprehensive black box runbook has been created. This runbook includes a series of curl commands designed to test the service from an external perspective, ensuring its functionality as a black box. The runbook can be found in the `api_blackbox_test_runbook.md` file.

## Installation

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Docker (optional for production)
- MongoDB installed locally

### Install MongoDB Locally

#### macOS

1. Install Homebrew (if not already installed):

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install MongoDB:

   ```bash
   brew tap mongodb/brew
   brew install mongodb-community@6.0
   ```

3. Start MongoDB:

   ```bash
   brew services start mongodb/brew/mongodb-community
   ```

#### Windows

1. Download MongoDB from the [MongoDB Community Download Center](https://www.mongodb.com/try/download/community).
2. Follow the installer steps and ensure MongoDB Server is selected.
3. Start the MongoDB service from Services or manually run:

   ```bash
   "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
   ```

#### Linux

Follow the installation guide on the [MongoDB website](https://www.mongodb.com/docs/manual/installation/).

### Clone the Repository

```bash
git clone <repository-url>
cd job-management-service
```

### Install Dependencies

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the root directory:

```plaintext
PORT=3000
DATABASE_URI=mongodb://localhost:27017/job_management
LOG_LEVEL=debug
ENABLE_OBSERVABILITY=true
```

### Running the Service

#### Development Mode

```bash
npm run dev
```

#### Production Mode

Build the project:

```bash
npm run build
```

Start the server:

```bash
npm start
```

### Running Tests

To run all tests:

```bash
npm test
```

For test coverage:

```bash
npm run test:coverage
```

## API Endpoints

### 1. Health Check

**GET /api/health**

Check the health status of the service.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-11-22T12:34:56.789Z"
}
```

**Example cURL Command:**

```bash
curl -X GET http://localhost:3000/api/health
```

### 2. Create Export Job

**POST /api/export**

Create a new export job for a book.

**Body:**

```json
{
  "bookId": "book-123",
  "type": "pdf"
}
```

- **Fields:**
  - `bookId` (string, required): The ID of the book to export.
  - `type` (string, required): The export format. Allowed values: "epub", "pdf".

**Response (HTTP 201 Created):**

```json
{
  "jobId": "job-456",
  "bookId": "book-123",
  "type": "pdf",
  "status": "pending",
  "createdAt": "2024-11-22T12:34:56.789Z"
}
```

**Example cURL Command:**

```bash
curl -X POST http://localhost:3000/api/export \
-H "Content-Type: application/json" \
-d '{
  "bookId": "book-123",
  "type": "pdf"
}'
```

### 3. Create Import Job

**POST /api/import**

Create a new import job for a book.

**Body:**

```json
{
  "bookId": "book-456",
  "type": "word",
  "url": "https://example.com/document.docx"
}
```

- **Fields:**
  - `bookId` (string, required): The ID of the book to import.
  - `type` (string, required): The import format. Allowed values: "word", "pdf", "wattpad", "evernote".
  - `url` (string, required): The URL of the source document.

**Response (HTTP 201 Created):**

```json
{
  "jobId": "job-789",
  "bookId": "book-456",
  "type": "word",
  "url": "https://example.com/document.docx",
  "status": "pending",
  "createdAt": "2024-11-22T12:34:56.789Z"
}
```

**Example cURL Command:**

```bash
curl -X POST http://localhost:3000/api/import \
-H "Content-Type: application/json" \
-d '{
  "bookId": "book-456",
  "type": "word",
  "url": "https://example.com/document.docx"
}'
```

### 4. List Export Jobs

**GET /api/export**

Retrieve a list of export jobs grouped by their states.

**Response (HTTP 200 OK):**

```json
{
  "pending": [
    {
      "jobId": "job-456",
      "bookId": "book-123",
      "type": "pdf",
      "status": "pending",
      "createdAt": "2024-11-22T12:34:56.789Z"
    }
  ],
  "completed": [],
  "failed": []
}
```

**Example cURL Command:**

```bash
curl -X GET http://localhost:3000/api/export
```

### 5. List Import Jobs

**GET /api/import**

Retrieve a list of import jobs grouped by their states.

**Response (HTTP 200 OK):**

```json
{
  "pending": [
    {
      "jobId": "job-789",
      "bookId": "book-456",
      "type": "word",
      "url": "https://example.com/document.docx",
      "status": "pending",
      "createdAt": "2024-11-22T12:34:56.789Z"
    }
  ],
  "completed": [],
  "failed": []
}
```

**Example cURL Command:**

```bash
curl -X GET http://localhost:3000/api/import
```

## Key Assumptions

1. Single-user Service: No authentication required; all users have access to the same data.
2. Job States: Jobs can be in states such as pending, completed, or failed.
3. Asynchronous Processing: Jobs are processed asynchronously; creating a job schedules it for processing.

## Future Improvements

- Authentication and Authorization: Implement user authentication for multi-user support.
- Pagination: Add pagination to the job listing endpoints to handle large datasets.
- Job Cancellation: Provide the ability to cancel pending jobs.
- WebSocket Support: Implement WebSocket notifications for job status updates.
- Rate Limiting: Implement rate limiting to prevent abuse of the API.
- Enhanced Error Handling: Provide more detailed error messages and error codes.
- Documentation: Generate API documentation using tools like Swagger or API Blueprint.
- Monitoring and Metrics: Integrate monitoring tools to track performance and uptime.
