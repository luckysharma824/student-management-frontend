# Student Management System - React Frontend

A comprehensive React-based frontend for the Student Management System that integrates with all backend APIs.

## Features

- **Dashboard**: Overview of total students, courses, and teachers
- **Student Management**: Create, read, update, delete, and search students
- **Course Management**: Manage courses with department filtering
- **Teacher Management**: Manage teacher information and qualifications
- **Grade Management**: Record and track student grades
- **Attendance Management**: Track student attendance with percentage calculations

## Technology Stack

- **React 18.2**: UI library
- **TypeScript**: Type-safe development
- **Material-UI (MUI)**: Modern UI components
- **Axios**: HTTP client for API requests
- **React Router v6**: Navigation
- **Emotion**: CSS-in-JS styling

## Project Structure

```
src/
├── services/
│   ├── api.ts           # API service methods for all entities
│   └── apiClient.ts     # Axios configuration
├── pages/
│   ├── Dashboard.tsx    # Dashboard page
│   ├── StudentList.tsx  # Student management page
│   ├── CourseList.tsx   # Course management page
│   ├── TeacherList.tsx  # Teacher management page
│   ├── GradeList.tsx    # Grade management page
│   └── AttendanceList.tsx # Attendance management page
├── App.tsx              # Main app component with routing
├── App.css              # Global styles
├── main.tsx             # Entry point
└── index.css            # Base styles
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Configure API URL in `.env`:

```
REACT_APP_API_URL=http://localhost:8080
```

3. Start the development server:

```bash
npm start
```

The application will open at `http://localhost:3000`

## API Integration

All API endpoints from the backend are integrated:

### Student APIs

- `POST /student` - Create student
- `PUT /student/{id}` - Update student
- `GET /student` - Get all students
- `GET /student/{id}` - Get student by ID
- `GET /student/code/{code}` - Get student by code
- `GET /student/search` - Search students
- `GET /student/semester/{semester}` - Get students by semester
- `GET /student/branch/{branchCode}` - Get students by branch
- `GET /student/active` - Get active students
- `GET /student/performance` - Get student performance
- `PUT /student/{id}/deactivate` - Deactivate student
- `DELETE /student/{id}` - Delete student

### Course APIs

- `POST /course` - Create course
- `PUT /course/{id}` - Update course
- `GET /course` - Get all courses
- `GET /course/{id}` - Get course by ID
- `GET /course/active/list` - Get active courses
- `GET /course/department/{department}` - Get courses by department
- `GET /course/search` - Search courses
- `PUT /course/{id}/deactivate` - Deactivate course
- `DELETE /course/{id}` - Delete course

### Teacher APIs

- `POST /teacher` - Create teacher
- `PUT /teacher/{id}` - Update teacher
- `GET /teacher` - Get all teachers
- `GET /teacher/{id}` - Get teacher by ID
- `GET /teacher/active/list` - Get active teachers
- `GET /teacher/department/{department}` - Get teachers by department
- `GET /teacher/search` - Search teachers
- `PUT /teacher/{id}/deactivate` - Deactivate teacher
- `DELETE /teacher/{id}` - Delete teacher

### Grade APIs

- `POST /grade` - Create grade
- `PUT /grade/{id}` - Update grade
- `GET /grade/{id}` - Get grade by ID
- `GET /grade/student/{studentId}` - Get grades by student
- `GET /grade/student/{studentId}/semester/{semester}` - Get grades by student and semester
- `GET /grade/course/{courseId}` - Get grades by course
- `GET /grade/course/{courseId}/semester/{semester}` - Get grades by course and semester
- `GET /grade/student/{studentId}/average` - Get student average grade
- `GET /grade/student/{studentId}/gpa` - Get student GPA
- `DELETE /grade/{id}` - Delete grade

### Attendance APIs

- `POST /attendance` - Record attendance
- `PUT /attendance/{id}` - Update attendance
- `GET /attendance/{id}` - Get attendance by ID
- `GET /attendance/student/{studentId}` - Get attendance by student
- `GET /attendance/student/{studentId}/semester/{semester}` - Get attendance by student and semester
- `GET /attendance/course/{courseId}` - Get attendance by course
- `GET /attendance/semester/{semester}` - Get attendance by semester
- `GET /attendance/student/{studentId}/percentage` - Get attendance percentage
- `GET /attendance/date-range` - Get attendance by date range
- `DELETE /attendance/{id}` - Delete attendance

## Usage

### Dashboard

- View summary statistics of students, courses, and teachers
- All data loads automatically on page load

### Managing Students

1. Click "Students" in navigation
2. View all students in the table
3. Click "Add Student" to create a new student
4. Use Edit button to modify student information
5. Use Deactivate to mark student as inactive
6. Use Delete to remove student record

### Managing Courses

- Similar CRUD operations as students
- Filter courses by department
- Search for courses by name

### Managing Teachers

- Add, edit, delete teachers
- Filter by department
- Store qualifications

### Managing Grades

- Record student grades
- Track by student, course, or semester
- Calculate GPA and average grades

### Managing Attendance

- Record daily attendance
- Track attendance percentage
- Get attendance by date range

## Features in Detail

### Dashboard Statistics

- Real-time count of active students, courses, and teachers
- Displayed in attractive card format

### Search and Filter

- Student search by name, email, phone
- Course filtering by department
- Teacher search by name and department

### Data Validation

- Required fields validation
- Type checking with TypeScript
- Input constraints (e.g., marks 0-100)

### Error Handling

- User-friendly error messages
- Loading indicators
- Success notifications

### Responsive Design

- Mobile-friendly layout
- Adaptive navigation drawer
- Responsive tables and grids

## Development

### Build for production:

```bash
npm run build
```

### Run tests:

```bash
npm test
```

### Key Technologies Used

1. **React Hooks**: State management with useState, useEffect
2. **TypeScript**: Strong typing for better code quality
3. **Material-UI**: Professional UI components
4. **Axios Interceptors**: Automatic error handling
5. **React Router**: Client-side routing

## Backend Configuration

Ensure the backend is running on `http://localhost:8080` or update the `.env` file with the correct API URL.

The backend should have CORS enabled to allow requests from the React frontend.

## Troubleshooting

### API Connection Issues

- Verify backend is running
- Check `.env` API_URL configuration
- Ensure CORS is enabled on backend

### Port Already in Use

```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :3000
kill -9 <PID>
```

## License

MIT License - feel free to use this project for any purpose.
