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
  Chip,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { Delete, Edit, Add, Search, Clear } from '@mui/icons-material'
import { courseService, CourseDTO } from '../services/api'

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<CourseDTO[]>([])
  const [filteredCourses, setFilteredCourses] = useState<CourseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<CourseDTO>({
    name: '',
    code: '',
    department: '',
    credits: 3,
    description: '',
    isActive: false,
    totalSemesters: 1,
  })
  
  // Form validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [departments, setDepartments] = useState<string[]>([])

  useEffect(() => {
    fetchCourses()
  }, [])

  // Filter courses based on search and filter criteria
  useEffect(() => {
    let filtered = [...courses]

    // Search filter by name, code, or department
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.name?.toLowerCase().includes(term) ||
          c.code?.toLowerCase().includes(term) ||
          c.department?.toLowerCase().includes(term)
      )
    }

    // Department filter
    if (filterDepartment.trim()) {
      filtered = filtered.filter(
        (c) => c.department?.toLowerCase() === filterDepartment.toLowerCase()
      )
    }

    // Status filter
    if (filterStatus === 'active') {
      filtered = filtered.filter((c) => c.isActive === true)
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter((c) => c.isActive === false)
    }

    setFilteredCourses(filtered)

    // Extract unique departments for filter dropdown
    const uniqueDepartments = Array.from(
      new Set(courses.map((c) => c.department).filter(Boolean))
    ) as string[]
    setDepartments(uniqueDepartments)
  }, [courses, searchTerm, filterDepartment, filterStatus])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await courseService.getAllCourses()
      setCourses(response.data?.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to load courses')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (course?: CourseDTO) => {
    if (course) {
      setFormData(course)
      setEditingId(course.id || null)
    } else {
      setFormData({
        name: '',
        code: '',
        department: '',
        credits: 3,
        description: '',
        totalSemesters: 1,
      })
      setEditingId(null)
    }
    setValidationErrors({})
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setValidationErrors({})
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setFilterDepartment('')
    setFilterStatus('all')
  }

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.code?.trim()) {
      errors.code = 'Course code is required'
    }

    if (!formData.name?.trim()) {
      errors.name = 'Course name is required'
    } else if (formData.name.length > 100) {
      errors.name = 'Course name cannot exceed 100 characters'
    }

    if (!formData.department?.trim()) {
      errors.department = 'Department is required'
    }

    if (!formData.credits || formData.credits < 1 || formData.credits > 6) {
      errors.credits = 'Credits must be between 1 and 6'
    }

    if (!formData.totalSemesters || formData.totalSemesters < 1) {
      errors.totalSemesters = 'Total semesters must be at least 1'
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    try {
      if (editingId) {
        await courseService.updateCourse(editingId, formData)
      } else {
        await courseService.createCourse(formData)
      }
      await fetchCourses()
      handleCloseDialog()
      setError(null)
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save course'
      setError(errorMsg)
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await courseService.deleteCourse(id)
        await fetchCourses()
      } catch (err) {
        setError('Failed to delete course')
        console.error(err)
      }
    }
  }

  const handleDeactivate = async (id: number) => {
    try {
      await courseService.deactivateCourse(id)
      await fetchCourses()
    } catch (err) {
      setError('Failed to deactivate course')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <h2>Courses</h2>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Course
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, code, or department"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                label="Department"
              >
                <MenuItem value="">All Departments</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')
                }
                label="Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleResetFilters}
              size="small"
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          Showing {filteredCourses.length} of {courses.length} courses
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Code
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Name
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Department
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Credits
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Semesters
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Status
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>{course.totalSemesters || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        course.isActive ? 'Active' : 'Inactive'
                      }
                      color={
                        course.isActive ? 'success' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleOpenDialog(course)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color={course.isActive ? "warning" : "primary"}
                        onClick={() =>
                          handleDeactivate(course.id || 0)
                        }
                      >
                        {course.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(course.id || 0)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Box sx={{ color: 'text.secondary' }}>
                    {courses.length === 0
                      ? 'No courses found'
                      : 'No courses match your filters'}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Course' : 'Add New Course'}
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                margin="normal"
                error={!!validationErrors.code}
                helperText={validationErrors.code}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                margin="normal"
                error={!!validationErrors.name}
                helperText={validationErrors.name || `${formData.name?.length || 0}/100 characters`}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    department: e.target.value,
                  })
                }
                margin="normal"
                error={!!validationErrors.department}
                helperText={validationErrors.department}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credits"
                type="number"
                value={formData.credits || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    credits: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                margin="normal"
                error={!!validationErrors.credits}
                helperText={validationErrors.credits || 'Must be between 1-6'}
                inputProps={{ min: 1, max: 6 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Semesters"
                type="number"
                value={formData.totalSemesters || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalSemesters: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                margin="normal"
                error={!!validationErrors.totalSemesters}
                helperText={validationErrors.totalSemesters}
                inputProps={{ min: 1 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                margin="normal"
                multiline
                rows={3}
                error={!!validationErrors.description}
                helperText={validationErrors.description || `${formData.description?.length || 0}/500 characters`}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.checked,
                      })
                    }
                  />
                }
                label={formData.isActive ? 'Active' : 'Inactive'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CourseList
