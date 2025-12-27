import apiClient from './apiClient'

export interface StudentDTO {
  id?: number
  code?: string
  firstName: string
  lastName: string
  email: string
  mobile: string
  admissionYear: number
  branchCode: string
  course: string
  currentSemester: number
  dateOfBirth?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface StudentPerformanceDTO {
  studentId?: number
  name?: string
  gpa?: number
  attendancePercentage?: number
  averageGrade?: number
}

export const studentService = {
  // CRUD Operations
  createStudent: (data: StudentDTO) =>
    apiClient.post('/student', data),
  updateStudent: (id: number, data: StudentDTO) =>
    apiClient.put(`/student/${id}`, data),
  deleteStudent: (id: number) =>
    apiClient.delete(`/student/${id}`),
  
  // Retrieve Operations
  getAllStudents: () =>
    apiClient.get('/student'),
  getStudentById: (id: number) =>
    apiClient.get(`/student/${id}`),
  getStudentByCode: (code: string) =>
    apiClient.get(`/student/code/${code}`),
  
  // Filter & Search Operations
  searchStudents: (params: Record<string, string>) =>
    apiClient.get('/student/search', { params }),
  getStudentsBySemester: (semester: number) =>
    apiClient.get(`/student/semester/${semester}`),
  getStudentsByBranch: (branchCode: string) =>
    apiClient.get(`/student/branch/${branchCode}`),
  getActiveStudents: () =>
    apiClient.get('/student/active'),
  
  // Analytics & Performance
  getStudentPerformance: (semester: number, branchCode: string) =>
    apiClient.get('/student/performance', {
      params: { semester, branchCode },
    }),
  
  // Status Operations
  deactivateStudent: (id: number) =>
    apiClient.put(`/student/${id}/deactivate`),
}

export interface AttendanceDTO {
  id?: number
  studentId: number
  courseId: number
  date: string
  status: string
  semester?: number
}

export const attendanceService = {
  recordAttendance: (data: AttendanceDTO) =>
    apiClient.post('/attendance', data),
  updateAttendance: (id: number, data: AttendanceDTO) =>
    apiClient.put(`/attendance/${id}`, data),
  getAttendanceById: (id: number) =>
    apiClient.get(`/attendance/${id}`),
  getAttendanceByStudent: (studentId: number) =>
    apiClient.get(`/attendance/student/${studentId}`),
  getAttendanceByStudentAndSemester: (
    studentId: number,
    semester: number
  ) =>
    apiClient.get(
      `/attendance/student/${studentId}/semester/${semester}`
    ),
  getAttendanceByCourse: (courseId: number) =>
    apiClient.get(`/attendance/course/${courseId}`),
  getAttendanceBySemester: (semester: number) =>
    apiClient.get(`/attendance/semester/${semester}`),
  getAttendancePercentage: (
    studentId: number,
    semester: number
  ) =>
    apiClient.get(`/attendance/student/${studentId}/percentage`, {
      params: { semester },
    }),
  getAttendanceByDateRange: (
    startDate: string,
    endDate: string,
    semester: number
  ) =>
    apiClient.get('/attendance/date-range', {
      params: { startDate, endDate, semester },
    }),
  deleteAttendance: (id: number) =>
    apiClient.delete(`/attendance/${id}`),
}

export interface CourseDTO {
  id?: number
  name: string
  code: string
  department: string
  credits?: number
  description?: string
  isActive?: boolean
  totalSemesters?: number
}

export const courseService = {
  createCourse: (data: CourseDTO) =>
    apiClient.post('/course', data),
  updateCourse: (id: number, data: CourseDTO) =>
    apiClient.put(`/course/${id}`, data),
  getCourseById: (id: number) =>
    apiClient.get(`/course/${id}`),
  getAllCourses: () =>
    apiClient.get('/course'),
  getActiveCourses: () =>
    apiClient.get('/course/active/list'),
  getCoursesByDepartment: (department: string) =>
    apiClient.get(`/course/department/${department}`),
  searchCourses: (name: string) =>
    apiClient.get('/course/search', { params: { name } }),
  deleteCourse: (id: number) =>
    apiClient.delete(`/course/${id}`),
  deactivateCourse: (id: number) =>
    apiClient.put(`/course/${id}/deactivate`),
}

export interface GradeDTO {
  id?: number
  studentId: number
  courseId: number
  marks: number
  semester?: number
  gradePoint?: number
}

export const gradeService = {
  createGrade: (data: GradeDTO) =>
    apiClient.post('/grade', data),
  updateGrade: (id: number, data: GradeDTO) =>
    apiClient.put(`/grade/${id}`, data),
  getGradeById: (id: number) =>
    apiClient.get(`/grade/${id}`),
  getGradesByStudent: (studentId: number) =>
    apiClient.get(`/grade/student/${studentId}`),
  getGradesByStudentAndSemester: (
    studentId: number,
    semester: number
  ) =>
    apiClient.get(`/grade/student/${studentId}/semester/${semester}`),
  getGradesByCourse: (courseId: number) =>
    apiClient.get(`/grade/course/${courseId}`),
  getGradesByCourseAndSemester: (
    courseId: number,
    semester: number
  ) =>
    apiClient.get(
      `/grade/course/${courseId}/semester/${semester}`
    ),
  getStudentAverageGrade: (studentId: number) =>
    apiClient.get(`/grade/student/${studentId}/average`),
  getStudentGPA: (studentId: number, semester: number) =>
    apiClient.get(`/grade/student/${studentId}/gpa`, {
      params: { semester },
    }),
  deleteGrade: (id: number) =>
    apiClient.delete(`/grade/${id}`),
}

export interface TeacherDTO {
  id?: number
  code: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  qualification?: string
  specialization?: string
  isActive?: boolean
}

export const teacherService = {
  createTeacher: (data: TeacherDTO) =>
    apiClient.post('/teacher', data),
  updateTeacher: (id: number, data: TeacherDTO) =>
    apiClient.put(`/teacher/${id}`, data),
  getTeacherById: (id: number) =>
    apiClient.get(`/teacher/${id}`),
  getAllTeachers: () =>
    apiClient.get('/teacher'),
  getActiveTeachers: () =>
    apiClient.get('/teacher/active/list'),
  getTeachersByDepartment: (department: string) =>
    apiClient.get(`/teacher/department/${department}`),
  searchTeachers: (name: string) =>
    apiClient.get('/teacher/search', { params: { name } }),
  deleteTeacher: (id: number) =>
    apiClient.delete(`/teacher/${id}`),
  deactivateTeacher: (id: number) =>
    apiClient.put(`/teacher/${id}/deactivate`),
}
