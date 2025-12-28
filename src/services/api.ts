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
  studentCode?: string
  studentName?: string
  courseId: number
  courseCode?: string
  courseName?: string
  attendanceDate: string
  status: string
  remarks?: string
  semester: number
}

export interface AttendanceResponse {
  message?: string
  data?: AttendanceDTO | AttendanceDTO[]
  total?: number
  studentCode?: string
  courseCode?: string
  semester?: number
  attendancePercentage?: string
  startDate?: string
  endDate?: string
}

export const attendanceService = {
  // CRUD Operations
  recordAttendance: (data: AttendanceDTO) =>
    apiClient.post<AttendanceResponse>('/attendance', data),
  
  updateAttendance: (id: number, data: AttendanceDTO) =>
    apiClient.put<AttendanceResponse>(`/attendance/${id}`, data),
  
  deleteAttendance: (id: number) =>
    apiClient.delete<{ message: string }>(`/attendance/${id}`),
  
  // Retrieve Operations
  getAttendanceById: (id: number) =>
    apiClient.get<AttendanceDTO>(`/attendance/${id}`),
  
  getAttendanceByStudent: (studentCode: string) =>
    apiClient.get<AttendanceResponse>(`/attendance/student/${studentCode}`),
  
  getAttendanceByStudentAndSemester: (
    studentCode: string,
    semester: number
  ) =>
    apiClient.get<AttendanceResponse>(
      `/attendance/student/${studentCode}/semester/${semester}`
    ),
  
  getAttendanceByCourse: (courseCode: string) =>
    apiClient.get<AttendanceResponse>(`/attendance/course/${courseCode}`),
  
  getAttendanceBySemester: (semester: number) =>
    apiClient.get<AttendanceResponse>(`/attendance/semester/${semester}`),
  
  // Analytics
  getAttendancePercentage: (
    studentCode: string,
    semester: number
  ) =>
    apiClient.get<AttendanceResponse>(`/attendance/student/${studentCode}/percentage`, {
      params: { semester },
    }),
  
  getAttendanceByDateRange: (
    startDate: string,
    endDate: string,
    semester: number
  ) =>
    apiClient.get<AttendanceResponse>('/attendance/date-range', {
      params: { startDate, endDate, semester },
    }),
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
  getCourseByCode: (code: string) =>
    apiClient.get(`/course/code/${code}`),
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
  studentCode?: string
  studentName?: string
  courseId: number
  courseCode?: string
  courseName?: string
  teacherId?: number
  teacherName?: string
  semester: number
  internalMarks: number
  externalMarks: number
  totalMarks?: number
  gradePoint?: string
  remarks?: string
  createdAt?: string
  updatedAt?: string
}

export interface GradeResponse {
  message?: string
  data?: GradeDTO | GradeDTO[]
  total?: number
  studentCode?: string
  courseCode?: string
  semester?: number
  averageGrade?: number
  semesterGPA?: string
}

export interface StudentAverageResponse {
  studentCode: string
  averageMarks: string
}

export interface StudentGPAResponse {
  studentCode: string
  semester: number
  gpa: string
}

export const gradeService = {
  // CRUD Operations
  createGrade: (data: GradeDTO) =>
    apiClient.post<GradeResponse>('/grade', data),
  
  updateGrade: (id: number, data: GradeDTO) =>
    apiClient.put<GradeResponse>(`/grade/${id}`, data),
  
  deleteGrade: (id: number) =>
    apiClient.delete<{ message: string }>(`/grade/${id}`),
  
  // Retrieve Single Grade
  getGradeById: (id: number) =>
    apiClient.get<GradeDTO>(`/grade/${id}`),
  
  // Get Grades by Student Code
  getGradesByStudent: (studentCode: string) =>
    apiClient.get<GradeResponse>(`/grade/student/${studentCode}`),
  
  getGradesByStudentAndSemester: (
    studentCode: string,
    semester: number
  ) =>
    apiClient.get<GradeResponse>(
      `/grade/student/${studentCode}/semester/${semester}`
    ),
  
  // Get Grades by Course Code
  getGradesByCourse: (courseCode: string) =>
    apiClient.get<GradeResponse>(`/grade/course/${courseCode}`),
  
  getGradesByCourseAndSemester: (
    courseCode: string,
    semester: number
  ) =>
    apiClient.get<GradeResponse>(
      `/grade/course/${courseCode}/semester/${semester}`
    ),
  
  // Analytics Operations
  getStudentAverageGrade: (studentCode: string) =>
    apiClient.get<StudentAverageResponse>(
      `/grade/student/${studentCode}/average`
    ),
  
  getStudentGPA: (studentCode: string, semester: number) =>
    apiClient.get<StudentGPAResponse>(
      `/grade/student/${studentCode}/gpa`,
      { params: { semester } }
    ),
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
