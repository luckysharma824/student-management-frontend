import React, { useState } from 'react'
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Stack,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Tabs,
  Tab,
} from '@mui/material'
import { Delete, Edit, Add, Search, Assessment, DateRange } from '@mui/icons-material'
import { attendanceService, AttendanceDTO, studentService, courseService } from '../services/api'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const AttendanceList: React.FC = () => {
  const [attendances, setAttendances] = useState<AttendanceDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [tabValue, setTabValue] = useState(0)

  // Search filters
  const [filterStudentCode, setFilterStudentCode] = useState<string>('')
  const [filterCourseCode, setFilterCourseCode] = useState<string>('')
  const [filterSemester, setFilterSemester] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  // Analytics
  const [attendancePercentage, setAttendancePercentage] = useState<string>('')
  const [analyticsStudentCode, setAnalyticsStudentCode] = useState<string>('')
  const [analyticsSemester, setAnalyticsSemester] = useState<string>('')

  // Form code states
  const [formStudentCode, setFormStudentCode] = useState<string>('')
  const [formCourseCode, setFormCourseCode] = useState<string>('')

  const [formData, setFormData] = useState<AttendanceDTO>({
    studentId: 0,
    courseId: 0,
    attendanceDate: new Date().toISOString().split('T')[0],
    status: 'PRESENT',
    semester: 1,
  })

  const clearMessages = () => {
    setTimeout(() => {
      setError(null)
      setSuccess(null)
    }, 3000)
  }

  const handleSearch = async () => {
    if (!filterStudentCode && !filterCourseCode && !filterSemester && !startDate) {
      setError('Please provide at least one search criteria')
      clearMessages()
      return
    }

    setLoading(true)
    setError(null)
    try {
      let response
      
      // Date range search has priority
      if (startDate && endDate && filterSemester) {
        response = await attendanceService.getAttendanceByDateRange(
          startDate,
          endDate,
          parseInt(filterSemester)
        )
      } else if (filterStudentCode && filterSemester) {
        response = await attendanceService.getAttendanceByStudentAndSemester(
          filterStudentCode,
          parseInt(filterSemester)
        )
      } else if (filterStudentCode) {
        response = await attendanceService.getAttendanceByStudent(
          filterStudentCode
        )
      } else if (filterCourseCode) {
        response = await attendanceService.getAttendanceByCourse(
          filterCourseCode
        )
      } else if (filterSemester) {
        response = await attendanceService.getAttendanceBySemester(
          parseInt(filterSemester)
        )
      }

      if (response?.data) {
        const attendanceData = Array.isArray(response.data.data)
          ? response.data.data
          : response.data.data
          ? [response.data.data]
          : []
        setAttendances(attendanceData)
        setSuccess(`Found ${attendanceData.length} attendance records`)
        clearMessages()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch attendance records')
      clearMessages()
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGetAnalytics = async () => {
    if (!analyticsStudentCode || !analyticsSemester) {
      setError('Please enter both Student Code and Semester')
      clearMessages()
      return
    }

    setLoading(true)
    try {
      const response = await attendanceService.getAttendancePercentage(
        analyticsStudentCode,
        parseInt(analyticsSemester)
      )
      setAttendancePercentage(response.data.attendancePercentage || '0%')
      setSuccess('Attendance percentage loaded')
      clearMessages()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch attendance percentage')
      clearMessages()
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (attendance?: AttendanceDTO) => {
    if (attendance) {
      setFormData({
        ...attendance,
        studentId: attendance.studentId || 0,
        courseId: attendance.courseId || 0,
        attendanceDate: attendance.attendanceDate || new Date().toISOString().split('T')[0],
        status: attendance.status || 'PRESENT',
        semester: attendance.semester || 1,
      })
      setFormStudentCode(attendance.studentCode || '')
      setFormCourseCode(attendance.courseCode || '')
      setEditingId(attendance.id || null)
    } else {
      setFormData({
        studentId: 0,
        courseId: 0,
        attendanceDate: new Date().toISOString().split('T')[0],
        status: 'PRESENT',
        semester: 1,
      })
      setFormStudentCode('')
      setFormCourseCode('')
      setEditingId(null)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleSave = async () => {
    try {
      // Look up student and course IDs from codes
      if (!editingId && formStudentCode && formCourseCode) {
        const studentResponse = await studentService.getStudentByCode(formStudentCode)
        const courseResponse = await courseService.getCourseByCode(formCourseCode)
        
        if (!studentResponse.data || !courseResponse.data) {
          setError('Invalid student code or course code')
          clearMessages()
          return
        }
        
        formData.studentId = studentResponse.data.id || 0
        formData.courseId = courseResponse.data.id || 0
      }
      
      if (editingId) {
        await attendanceService.updateAttendance(editingId, formData)
        setSuccess('Attendance updated successfully!')
      } else {
        await attendanceService.recordAttendance(formData)
        setSuccess('Attendance recorded successfully!')
      }
      handleCloseDialog()
      clearMessages()
      // Refresh if we have active filters
      if (filterStudentCode || filterCourseCode || filterSemester) {
        handleSearch()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save attendance')
      clearMessages()
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await attendanceService.deleteAttendance(id)
        setSuccess('Attendance deleted successfully!')
        clearMessages()
        setAttendances(attendances.filter((a) => a.id !== id))
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete attendance')
        clearMessages()
        console.error(err)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PRESENT':
        return 'success'
      case 'ABSENT':
        return 'error'
      case 'LEAVE':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h2">
          Attendance Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Record Attendance
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Search Attendance" icon={<Search />} iconPosition="start" />
          <Tab label="Date Range" icon={<DateRange />} iconPosition="start" />
          <Tab label="Analytics" icon={<Assessment />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Search Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Search Filters
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Student Code"
                  type="text"
                  value={filterStudentCode}
                  onChange={(e) => setFilterStudentCode(e.target.value)}
                  size="small"
                  placeholder="e.g., S001"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Course Code"
                  type="text"
                  value={filterCourseCode}
                  onChange={(e) => setFilterCourseCode(e.target.value)}
                  size="small"
                  placeholder="e.g., CS101"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Semester</InputLabel>
                  <Select
                    value={filterSemester}
                    onChange={(e) => setFilterSemester(e.target.value)}
                    label="Semester"
                  >
                    <MenuItem value="">All Semesters</MenuItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <MenuItem key={sem} value={sem}>
                        Semester {sem}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Search />}
                  onClick={handleSearch}
                  disabled={loading}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Course</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Semester</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      No attendance records found. Use search filters or record attendance.
                    </TableCell>
                  </TableRow>
                ) : (
                  attendances.map((attendance) => (
                    <TableRow key={attendance.id}>
                      <TableCell>{attendance.id}</TableCell>
                      <TableCell>
                        {attendance.studentName || `Student #${attendance.studentId}`}
                      </TableCell>
                      <TableCell>
                        {attendance.courseName || `Course #${attendance.courseId}`}
                      </TableCell>
                      <TableCell>{attendance.attendanceDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={attendance.status}
                          color={getStatusColor(attendance.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{attendance.semester}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => handleOpenDialog(attendance)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => handleDelete(attendance.id || 0)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      {/* Date Range Tab */}
      <TabPanel value={tabValue} index={1}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Search by Date Range
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small" required>
                  <InputLabel>Semester</InputLabel>
                  <Select
                    value={filterSemester}
                    onChange={(e) => setFilterSemester(e.target.value)}
                    label="Semester"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <MenuItem key={sem} value={sem}>
                        Semester {sem}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Search />}
                  onClick={handleSearch}
                  disabled={loading}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Course</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Semester</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      No attendance records found for the selected date range.
                    </TableCell>
                  </TableRow>
                ) : (
                  attendances.map((attendance) => (
                    <TableRow key={attendance.id}>
                      <TableCell>{attendance.id}</TableCell>
                      <TableCell>
                        {attendance.studentName || `Student #${attendance.studentId}`}
                      </TableCell>
                      <TableCell>
                        {attendance.courseName || `Course #${attendance.courseId}`}
                      </TableCell>
                      <TableCell>{attendance.attendanceDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={attendance.status}
                          color={getStatusColor(attendance.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{attendance.semester}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => handleOpenDialog(attendance)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => handleDelete(attendance.id || 0)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Attendance Percentage
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Student Code"
                      type="text"
                      value={analyticsStudentCode}
                      onChange={(e) => setAnalyticsStudentCode(e.target.value)}
                      placeholder="e.g., S001"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Semester</InputLabel>
                      <Select
                        value={analyticsSemester}
                        onChange={(e) => setAnalyticsSemester(e.target.value)}
                        label="Semester"
                      >
                        <MenuItem value="">Select Semester</MenuItem>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <MenuItem key={sem} value={sem}>
                            Semester {sem}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleGetAnalytics}
                      disabled={loading}
                    >
                      Get Percentage
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Result
                </Typography>
                {attendancePercentage && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Attendance Percentage
                    </Typography>
                    <Typography variant="h2" color="primary" sx={{ mt: 2 }}>
                      {attendancePercentage}
                    </Typography>
                  </Box>
                )}
                {!attendancePercentage && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Enter Student Code and Semester to view attendance percentage
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Attendance' : 'Record Attendance'}
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Code"
                type="text"
                value={formStudentCode}
                onChange={(e) => setFormStudentCode(e.target.value)}
                required
                placeholder="e.g., S001"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course Code"
                type="text"
                value={formCourseCode}
                onChange={(e) => setFormCourseCode(e.target.value)}
                required
                placeholder="e.g., CS101"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.attendanceDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    attendanceDate: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                  label="Status"
                >
                  <MenuItem value="PRESENT">Present</MenuItem>
                  <MenuItem value="ABSENT">Absent</MenuItem>
                  <MenuItem value="LEAVE">Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Semester</InputLabel>
                <Select
                  value={formData.semester}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      semester: e.target.value as number,
                    })
                  }
                  label="Semester"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <MenuItem key={sem} value={sem}>
                      Semester {sem}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks (Optional)"
                value={formData.remarks || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    remarks: e.target.value,
                  })
                }
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AttendanceList
