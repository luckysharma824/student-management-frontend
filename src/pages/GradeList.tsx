import React, { useEffect, useState } from 'react'
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
import { Delete, Edit, Add, Search, Assessment, TrendingUp } from '@mui/icons-material'
import { 
  gradeService, 
  GradeDTO
} from '../services/api'

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

const GradeList: React.FC = () => {
  const [grades, setGrades] = useState<GradeDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [tabValue, setTabValue] = useState(0)
  
  // Filter states
  const [filterStudentCode, setFilterStudentCode] = useState<string>('')
  const [filterCourseCode, setFilterCourseCode] = useState<string>('')
  const [filterSemester, setFilterSemester] = useState<string>('')
  
  // Analytics states
  const [studentAverage, setStudentAverage] = useState<string>('')
  const [studentGPA, setStudentGPA] = useState<string>('')
  const [analyticsStudentCode, setAnalyticsStudentCode] = useState<string>('')
  const [analyticsSemester, setAnalyticsSemester] = useState<string>('')
  
  const [formData, setFormData] = useState<GradeDTO>({
    studentId: 0,
    studentCode: '',
    courseId: 0,
    courseCode: '',
    semester: 1,
    internalMarks: 0,
    externalMarks: 0,
  })

  useEffect(() => {
    // Initially show empty list - user can search by student or course
  }, [])

  const clearMessages = () => {
    setTimeout(() => {
      setError(null)
      setSuccess(null)
    }, 3000)
  }

  const handleSearch = async () => {
    if (!filterStudentCode && !filterCourseCode) {
      setError('Please enter Student Code or Course Code to search')
      clearMessages()
      return
    }

    setLoading(true)
    setError(null)
    try {
      let response
      if (filterStudentCode && filterSemester) {
        response = await gradeService.getGradesByStudentAndSemester(
          filterStudentCode,
          parseInt(filterSemester)
        )
      } else if (filterStudentCode) {
        response = await gradeService.getGradesByStudent(filterStudentCode)
      } else if (filterCourseCode && filterSemester) {
        response = await gradeService.getGradesByCourseAndSemester(
          filterCourseCode,
          parseInt(filterSemester)
        )
      } else if (filterCourseCode) {
        response = await gradeService.getGradesByCourse(filterCourseCode)
      }

      if (response?.data) {
        const gradesData = Array.isArray(response.data.data) 
          ? response.data.data 
          : response.data.data 
          ? [response.data.data]
          : []
        setGrades(gradesData)
        setSuccess(`Found ${gradesData.length} grades`)
        clearMessages()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch grades')
      clearMessages()
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGetAnalytics = async () => {
    if (!analyticsStudentCode) {
      setError('Please enter Student Code for analytics')
      clearMessages()
      return
    }

    setLoading(true)
    try {
      // Get average
      const avgResponse = await gradeService.getStudentAverageGrade(
        analyticsStudentCode
      )
      setStudentAverage(avgResponse.data.averageMarks)

      // Get GPA if semester provided
      if (analyticsSemester) {
        const gpaResponse = await gradeService.getStudentGPA(
          analyticsStudentCode,
          parseInt(analyticsSemester)
        )
        setStudentGPA(gpaResponse.data.gpa)
      }
      setSuccess('Analytics loaded successfully')
      clearMessages()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch analytics')
      clearMessages()
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (grade?: GradeDTO) => {
    if (grade) {
      setFormData({
        ...grade,
        studentCode: grade.studentCode || '',
        courseCode: grade.courseCode || '',
        semester: grade.semester || 1,
        internalMarks: grade.internalMarks || 0,
        externalMarks: grade.externalMarks || 0,
      })
      setEditingId(grade.id || null)
    } else {
      setFormData({
        studentId: 0,
        courseId: 0,
        studentCode: '',
        courseCode: '',
        semester: 1,
        internalMarks: 0,
        externalMarks: 0,
      })
      setEditingId(null)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        await gradeService.updateGrade(editingId, formData)
        setSuccess('Grade updated successfully!')
      } else {
        await gradeService.createGrade(formData)
        setSuccess('Grade created successfully!')
      }
      handleCloseDialog()
      clearMessages()
      // Refresh the list if we have active filters
      if (filterStudentCode || filterCourseCode) {
        handleSearch()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save grade')
      clearMessages()
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await gradeService.deleteGrade(id)
        setSuccess('Grade deleted successfully!')
        clearMessages()
        // Refresh the list
        if (filterStudentCode || filterCourseCode) {
          handleSearch()
        } else {
          setGrades(grades.filter(g => g.id !== id))
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete grade')
        clearMessages()
        console.error(err)
      }
    }
  }

  const getGradeColor = (totalMarks?: number) => {
    if (!totalMarks) return 'default'
    if (totalMarks >= 90) return 'success'
    if (totalMarks >= 75) return 'primary'
    if (totalMarks >= 60) return 'info'
    if (totalMarks >= 40) return 'warning'
    return 'error'
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h2">
          Grade Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Grade
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
          <Tab label="Search Grades" icon={<Search />} iconPosition="start" />
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
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Semester</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Internal</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>External</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Grade Point</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                      No grades found. Use search filters to find grades.
                    </TableCell>
                  </TableRow>
                ) : (
                  grades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell>{grade.id}</TableCell>
                      <TableCell>
                        {grade.studentName || `Student #${grade.studentId}`}
                      </TableCell>
                      <TableCell>
                        {grade.courseName || `Course #${grade.courseId}`}
                      </TableCell>
                      <TableCell>{grade.semester}</TableCell>
                      <TableCell>{grade.internalMarks}</TableCell>
                      <TableCell>{grade.externalMarks}</TableCell>
                      <TableCell>
                        <Chip
                          label={grade.totalMarks || (grade.internalMarks + grade.externalMarks)}
                          color={getGradeColor(grade.totalMarks)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={grade.gradePoint || 'N/A'} size="small" />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => handleOpenDialog(grade)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => handleDelete(grade.id || 0)}
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
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Student Performance Analytics
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
                      <InputLabel>Semester (for GPA)</InputLabel>
                      <Select
                        value={analyticsSemester}
                        onChange={(e) => setAnalyticsSemester(e.target.value)}
                        label="Semester (for GPA)"
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
                      Get Analytics
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
                  Results
                </Typography>
                {studentAverage && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Overall Average Marks
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {studentAverage}
                    </Typography>
                  </Box>
                )}
                {studentGPA && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Semester GPA
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {studentGPA}
                    </Typography>
                  </Box>
                )}
                {!studentAverage && !studentGPA && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Enter Student Code and click "Get Analytics" to see results
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
          {editingId ? 'Edit Grade' : 'Add New Grade'}
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Code"
                type="text"
                value={formData.studentCode}
                onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                required
                placeholder="e.g., S001"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course Code"
                type="text"
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                required
                placeholder="e.g., CS101"
              />
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Internal Marks"
                type="number"
                value={formData.internalMarks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    internalMarks: parseFloat(e.target.value) || 0,
                  })
                }
                required
                inputProps={{ step: '0.1', min: '0', max: '40' }}
                helperText="Max: 40"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="External Marks"
                type="number"
                value={formData.externalMarks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    externalMarks: parseFloat(e.target.value) || 0,
                  })
                }
                required
                inputProps={{ step: '0.1', min: '0', max: '60' }}
                helperText="Max: 60"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Marks"
                value={(formData.internalMarks || 0) + (formData.externalMarks || 0)}
                disabled
                helperText="Auto-calculated"
              />
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

export default GradeList
