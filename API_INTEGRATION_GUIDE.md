# Student Management System - API Integration Documentation

## Overview

This document provides comprehensive information about all API endpoints integrated into the React frontend application for the Student Management System.

## Base Configuration

- **Base URL**: `http://localhost:8080`
- **Content-Type**: `application/json`
- **Environment Variable**: `REACT_APP_API_URL`

## API Endpoints Summary

### 1. Student Management APIs

#### Create Student

```
POST /student
Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St",
  "semester": 4,
  "branchCode": "CSE"
}
Response: 201 Created
{
  "message": "Student created successfully",
  "data": { student object }
}
```

#### Update Student

```
PUT /student/{studentId}
Request Body: Same as create
Response: 200 OK
{
  "message": "Student updated successfully",
  "data": { updated student object }
}
```

#### Get All Students

```
GET /student
Response: 200 OK
{
  "total": 50,
  "data": [ array of students ]
}
```

#### Get Student by ID

```
GET /student/{studentId}
Response: 200 OK
{ student object with details }
```

#### Search Students

```
GET /student/search?name=John&email=john@example.com
Response: 200 OK
{
  "total": 1,
  "data": [ matching students ]
}
```

#### Get Students by Semester

```
GET /student/semester/{semester}
Response: 200 OK
{
  "total": 25,
  "semester": 4,
  "data": [ students in semester 4 ]
}
```

#### Get Students by Branch

```
GET /student/branch/{branchCode}
Response: 200 OK
{
  "total": 30,
  "branchCode": "CSE",
  "data": [ students in CSE branch ]
}
```

#### Get Active Students

```
GET /student/active
Response: 200 OK
{
  "total": 45,
  "data": [ active students ]
}
```

#### Get Student Performance

```
GET /student/performance?semester=4&branchCode=CSE
Response: 200 OK
{ performance metrics }
```

#### Deactivate Student

```
PUT /student/{studentId}/deactivate
Response: 200 OK
{
  "message": "Student deactivated successfully"
}
```

#### Delete Student

```
DELETE /student/{studentId}
Response: 200 OK
{
  "message": "Student deleted successfully"
}
```

---

### 2. Course Management APIs

#### Create Course

```
POST /course
Request Body:
{
  "name": "Data Structures",
  "code": "CS201",
  "department": "Computer Science",
  "credits": 4,
  "description": "Advanced data structures course"
}
Response: 201 Created
```

#### Update Course

```
PUT /course/{courseId}
Request Body: Same as create
Response: 200 OK
```

#### Get All Courses

```
GET /course
Response: 200 OK
{
  "total": 25,
  "data": [ array of courses ]
}
```

#### Get Course by ID

```
GET /course/{courseId}
Response: 200 OK
{ course object }
```

#### Get Active Courses

```
GET /course/active/list
Response: 200 OK
{
  "total": 20,
  "data": [ active courses ]
}
```

#### Get Courses by Department

```
GET /course/department/{department}
Response: 200 OK
{
  "total": 10,
  "department": "Computer Science",
  "data": [ courses in department ]
}
```

#### Search Courses

```
GET /course/search?name=Data
Response: 200 OK
{
  "total": 3,
  "searchQuery": "Data",
  "data": [ matching courses ]
}
```

#### Deactivate Course

```
PUT /course/{courseId}/deactivate
Response: 200 OK
```

#### Delete Course

```
DELETE /course/{courseId}
Response: 200 OK
```

---

### 3. Teacher Management APIs

#### Create Teacher

```
POST /teacher
Request Body:
{
  "name": "Dr. Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "department": "Computer Science",
  "qualifications": "PhD in Computer Science"
}
Response: 201 Created
```

#### Update Teacher

```
PUT /teacher/{teacherId}
Request Body: Same as create
Response: 200 OK
```

#### Get All Teachers

```
GET /teacher
Response: 200 OK
{
  "total": 15,
  "data": [ array of teachers ]
}
```

#### Get Teacher by ID

```
GET /teacher/{teacherId}
Response: 200 OK
{ teacher object }
```

#### Get Active Teachers

```
GET /teacher/active/list
Response: 200 OK
{
  "total": 12,
  "data": [ active teachers ]
}
```

#### Get Teachers by Department

```
GET /teacher/department/{department}
Response: 200 OK
{
  "total": 5,
  "department": "Computer Science",
  "data": [ teachers in department ]
}
```

#### Search Teachers

```
GET /teacher/search?name=Smith
Response: 200 OK
{
  "total": 1,
  "searchQuery": "Smith",
  "data": [ matching teachers ]
}
```

#### Deactivate Teacher

```
PUT /teacher/{teacherId}/deactivate
Response: 200 OK
```

#### Delete Teacher

```
DELETE /teacher/{teacherId}
Response: 200 OK
```

---

### 4. Grade Management APIs

#### Create Grade

```
POST /grade
Request Body:
{
  "studentId": 1,
  "courseId": 5,
  "marks": 85.5,
  "semester": 4,
  "gradePoint": 3.8
}
Response: 201 Created
```

#### Update Grade

```
PUT /grade/{gradeId}
Request Body: Same as create
Response: 200 OK
```

#### Get Grade by ID

```
GET /grade/{gradeId}
Response: 200 OK
{ grade object }
```

#### Get Grades by Student

```
GET /grade/student/{studentId}
Response: 200 OK
{
  "total": 8,
  "studentId": 1,
  "averageGrade": 82.5,
  "data": [ student's grades ]
}
```

#### Get Grades by Student and Semester

```
GET /grade/student/{studentId}/semester/{semester}
Response: 200 OK
{
  "total": 4,
  "studentId": 1,
  "semester": 4,
  "semesterGPA": "3.80",
  "data": [ semester grades ]
}
```

#### Get Grades by Course

```
GET /grade/course/{courseId}
Response: 200 OK
{
  "total": 50,
  "courseId": 5,
  "data": [ course grades ]
}
```

#### Get Grades by Course and Semester

```
GET /grade/course/{courseId}/semester/{semester}
Response: 200 OK
{
  "total": 25,
  "courseId": 5,
  "semester": 4,
  "data": [ semester course grades ]
}
```

#### Get Student Average Grade

```
GET /grade/student/{studentId}/average
Response: 200 OK
{
  "studentId": 1,
  "averageMarks": "82.50"
}
```

#### Get Student GPA

```
GET /grade/student/{studentId}/gpa?semester=4
Response: 200 OK
{
  "studentId": 1,
  "semester": 4,
  "gpa": "3.80"
}
```

#### Delete Grade

```
DELETE /grade/{gradeId}
Response: 200 OK
```

---

### 5. Attendance Management APIs

#### Record Attendance

```
POST /attendance
Request Body:
{
  "studentId": 1,
  "courseId": 5,
  "date": "2024-12-26",
  "status": "Present",
  "semester": 4
}
Response: 201 Created
{
  "message": "Attendance recorded successfully",
  "data": { attendance object }
}
```

#### Update Attendance

```
PUT /attendance/{attendanceId}
Request Body: Same as record
Response: 200 OK
```

#### Get Attendance by ID

```
GET /attendance/{attendanceId}
Response: 200 OK
{ attendance object }
```

#### Get Attendance by Student

```
GET /attendance/student/{studentId}
Response: 200 OK
{
  "total": 30,
  "studentId": 1,
  "data": [ student attendance records ]
}
```

#### Get Attendance by Student and Semester

```
GET /attendance/student/{studentId}/semester/{semester}
Response: 200 OK
{
  "total": 15,
  "studentId": 1,
  "semester": 4,
  "attendancePercentage": "93.33%",
  "data": [ semester attendance ]
}
```

#### Get Attendance by Course

```
GET /attendance/course/{courseId}
Response: 200 OK
{
  "total": 45,
  "courseId": 5,
  "data": [ course attendance records ]
}
```

#### Get Attendance by Semester

```
GET /attendance/semester/{semester}
Response: 200 OK
{
  "total": 120,
  "semester": 4,
  "data": [ semester attendance records ]
}
```

#### Get Attendance Percentage

```
GET /attendance/student/{studentId}/percentage?semester=4
Response: 200 OK
{
  "studentId": 1,
  "semester": 4,
  "attendancePercentage": "93.33%"
}
```

#### Get Attendance by Date Range

```
GET /attendance/date-range?startDate=2024-12-01&endDate=2024-12-31&semester=4
Response: 200 OK
{
  "total": 15,
  "startDate": "2024-12-01",
  "endDate": "2024-12-31",
  "semester": 4,
  "data": [ attendance in date range ]
}
```

#### Delete Attendance

```
DELETE /attendance/{attendanceId}
Response: 200 OK
{
  "message": "Attendance record deleted successfully"
}
```

---

## Implementation Examples

### Using Student Service

```typescript
import { studentService } from "./services/api";

// Create student
const response = await studentService.createStudent({
  name: "John Doe",
  email: "john@example.com",
  phone: "9876543210",
});

// Get all students
const allStudents = await studentService.getAllStudents();

// Search students
const results = await studentService.searchStudents({
  name: "John",
  email: "john@example.com",
});

// Deactivate student
await studentService.deactivateStudent(1);
```

### Error Handling

```typescript
try {
  const student = await studentService.getStudentById(1);
  console.log(student.data);
} catch (error) {
  console.error("Failed to fetch student:", error);
  // Display error to user
}
```

### In React Components

```typescript
const [students, setStudents] = useState<StudentDTO[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchStudents = async () => {
    try {
      const response = await studentService.getAllStudents();
      setStudents(response.data?.data || []);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  fetchStudents();
}, []);
```

## Response Codes

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | OK - Request successful                 |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input             |
| 404  | Not Found - Resource not found          |
| 500  | Internal Server Error - Server error    |

## Common Status Values

### Student Status

- `true` - Active
- `false` - Inactive

### Attendance Status

- `Present` - Student was present
- `Absent` - Student was absent
- `Leave` - Student took leave

### General Status

- `Active` - Entity is active
- `Inactive` - Entity is inactive

## Setting Base URL

To change the API base URL, update the `.env` file:

```
REACT_APP_API_URL=http://your-api-url:8080
```

Then restart the React development server.

## CORS Configuration

Ensure the backend is configured to allow requests from the React frontend:

- Origin: `http://localhost:3000` (development)
- Methods: GET, POST, PUT, DELETE
- Headers: Content-Type, Authorization

## Pagination (Future Enhancement)

Future versions may include pagination support for large datasets:

```
GET /student?page=1&size=20
```

## Rate Limiting

No rate limiting is currently implemented, but should be considered for production.

## Authentication (Future Enhancement)

Future versions should include JWT or OAuth2 authentication:

```
Authorization: Bearer <token>
```

## Tips for Development

1. **Testing APIs**: Use Postman or similar tool to test endpoints independently
2. **Console Logging**: Check browser console for detailed error messages
3. **Network Tab**: Inspect network requests in browser DevTools
4. **Validation**: Always validate user input before sending to API
5. **Error Messages**: Provide clear, user-friendly error messages

## Troubleshooting

### 404 Not Found

- Check if the resource ID is correct
- Verify the endpoint path

### 400 Bad Request

- Validate request body format
- Check required fields are provided
- Ensure data types match API expectations

### CORS Error

- Verify backend CORS configuration
- Check API URL in `.env` file
- Ensure backend is running

### Connection Timeout

- Check if backend is running
- Verify network connectivity
- Check firewall settings
