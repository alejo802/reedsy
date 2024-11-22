
# API Blackbox Test Runbook

This runbook provides step-by-step instructions to test the API endpoints of your new project. It includes examples of valid and invalid requests to ensure your API handles different scenarios correctly.

---

## 1. Verify the API is Running

```bash
curl -X GET http://localhost:3000/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-11-22T12:34:56.789Z"
}
```

---

## 2. Create Export Job

### a. Valid Export Job Request
```bash
curl -X POST http://localhost:3000/api/export \
-H "Content-Type: application/json" \
-d '{
  "bookId": "book-123",
  "type": "pdf"
}'
```

**Expected Response (HTTP 201 Created):**
```json
{
  "jobId": "job-456",
  "bookId": "book-123",
  "type": "pdf",
  "status": "pending",
  "createdAt": "2024-11-22T12:34:56.789Z"
}
```

### b. Invalid Export Job Request (Missing bookId)
```bash
curl -X POST http://localhost:3000/api/export \
-H "Content-Type: application/json" \
-d '{
  "type": "pdf"
}'
```

**Expected Response (HTTP 400 Bad Request):**
```json
{
  "errors": [
    {
      "message": "bookId is required",
      "path": ["body", "bookId"]
    }
  ]
}
```

### c. Invalid Export Job Request (Invalid type)
```bash
curl -X POST http://localhost:3000/api/export \
-H "Content-Type: application/json" \
-d '{
  "bookId": "book-123",
  "type": "docx"
}'
```

**Expected Response (HTTP 400 Bad Request):**
```json
{
  "errors": [
    {
      "message": "Invalid enum value. Expected 'epub' | 'pdf', received 'docx'",
      "path": ["body", "type"]
    }
  ]
}
```

---

## 3. Create Import Job

### a. Valid Import Job Request
```bash
curl -X POST http://localhost:3000/api/import \
-H "Content-Type: application/json" \
-d '{
  "bookId": "book-456",
  "type": "word",
  "url": "https://example.com/document.docx"
}'
```

**Expected Response (HTTP 201 Created):**
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

### b. Invalid Import Job Request (Missing url)
```bash
curl -X POST http://localhost:3000/api/import \
-H "Content-Type: application/json" \
-d '{
  "bookId": "book-456",
  "type": "word"
}'
```

**Expected Response (HTTP 400 Bad Request):**
```json
{
  "errors": [
    {
      "message": "url is required",
      "path": ["body", "url"]
    }
  ]
}
```

### c. Invalid Import Job Request (Invalid type)
```bash
curl -X POST http://localhost:3000/api/import \
-H "Content-Type: application/json" \
-d '{
  "bookId": "book-456",
  "type": "txt",
  "url": "https://example.com/document.txt"
}'
```

**Expected Response (HTTP 400 Bad Request):**
```json
{
  "errors": [
    {
      "message": "Invalid enum value. Expected 'word' | 'pdf' | 'wattpad' | 'evernote', received 'txt'",
      "path": ["body", "type"]
    }
  ]
}
```

---

## 4. List Export Jobs

### a. Retrieve Export Jobs
```bash
curl -X GET http://localhost:3000/api/export
```

**Expected Response (HTTP 200 OK):**
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

---

## 5. List Import Jobs

### a. Retrieve Import Jobs
```bash
curl -X GET http://localhost:3000/api/import
```

**Expected Response (HTTP 200 OK):**
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

---

## 6. Additional Edge Cases

### a. Invalid Endpoint
```bash
curl -X GET http://localhost:3000/api/invalid-endpoint
```

**Expected Response (HTTP 404 Not Found):**
```json
{
  "error": "Not Found"
}
```

### b. Stress Test Export Jobs Listing
```bash
for i in {1..100}; do
  curl -X GET http://localhost:3000/api/export &
done
wait
```

**Expected Outcome:**
- All requests should receive a response without the server crashing.
- The responses should be consistent and accurate.

### c. Large Payload in Import Job
```bash
curl -X POST http://localhost:3000/api/import \
-H "Content-Type: application/json" \
-d '{
  "bookId": "book-large",
  "type": "pdf",
  "url": "https://example.com/large-document.pdf"
}'
```

**Expected Response (HTTP 201 Created):**
```json
{
  "jobId": "job-large",
  "bookId": "book-large",
  "type": "pdf",
  "url": "https://example.com/large-document.pdf",
  "status": "pending",
  "createdAt": "2024-11-22T12:34:56.789Z"
}
```

---

## 7. Test Invalid Data Types

### a. Non-String bookId
```bash
curl -X POST http://localhost:3000/api/export \
-H "Content-Type: application/json" \
-d '{
  "bookId": 12345,
  "type": "pdf"
}'
```

**Expected Response (HTTP 400 Bad Request):**
```json
{
  "errors": [
    {
      "message": "Expected string, received number",
      "path": ["body", "bookId"]
    }
  ]
}
```

### b. Invalid URL Format
```bash
curl -X POST http://localhost:3000/api/import \
-H "Content-Type: application/json" \
-d '{
  "bookId": "book-456",
  "type": "word",
  "url": "not-a-valid-url"
}'
```

**Expected Response (HTTP 400 Bad Request):**
```json
{
  "errors": [
    {
      "message": "Invalid url",
      "path": ["body", "url"]
    }
  ]
}
```

---

## 8. Health Check Endpoint

### a. Check API Health
```bash
curl -X GET http://localhost:3000/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-11-22T12:34:56.789Z"
}
```

---

## 9. Simulate Concurrent Job Creations

### a. Concurrent Export Job Requests
```bash
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/export \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "book-concurrent-'$i'",
    "type": "epub"
  }' &
done
wait
```

**Expected Outcome:**
- All jobs are created successfully.
- Server handles concurrent requests without errors.

---

## 10. Test Unsupported Methods

### a. DELETE Method on Export Endpoint
```bash
curl -X DELETE http://localhost:3000/api/export \
-H "Content-Type: application/json"
```

**Expected Response (HTTP 405 Method Not Allowed):**
```json
{
  "error": "Method Not Allowed"
}
```
