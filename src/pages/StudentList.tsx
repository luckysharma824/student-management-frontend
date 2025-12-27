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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material'
import { Delete, Edit, Add, Search, Clear } from '@mui/icons-material'
import { studentService, StudentDTO } from '../services/api'

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<StudentDTO[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<StudentDTO>({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    admissionYear: new Date().getFullYear(),
    branchCode: '',
    course: '',
    currentSemester: 1,
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSemester, setFilterSemester] = useState<number | ''>('')
  const [filterBranch, setFilterBranch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    fetchStudents()
  }, [])

  // Filter students based on search and filter criteria
  useEffect(() => {
    let filtered = [...students]

  // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.firstName?.toLowerCase().includes(term) ||
          s.lastName?.toLowerCase().includes(term) ||
          s.email?.toLowerCase().includes(term) ||
          s.mobile?.includes(searchTerm) ||
          s.code?.toLowerCase().includes(term)
      )
    }

    // Semester filter
    if (filterSemester !== '') {
      filtered = filtered.filter((s) => s.currentSemester === filterSemester)
    }

    // Branch filter
    if (filterBranch.trim()) {
      filtered = filtered.filter(
        (s) =>
          s.branchCode?.toLowerCase().includes(filterBranch.toLowerCase())
      )
    }

    // Status filter
    if (filterStatus === 'active') {
      filtered = filtered.filter((s) => s.isActive === true)
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter((s) => s.isActive === false)
    }

    setFilteredStudents(filtered)
  }, [students, searchTerm, filterSemester, filterBranch, filterStatus])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await studentService.getAllStudents()
      setStudents(response.data?.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to load students')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (student?: StudentDTO) => {
    if (student) {
      setFormData(student)
      setEditingId(student.id || null)
    } else {
      setFormData({
        code: '',
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        admissionYear: new Date().getFullYear(),
        branchCode: '',
        course: '',
        currentSemester: 1,
        address: '',
        city: '',
        state: '',
        zipCode: '',
      })
      setEditingId(null)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      admissionYear: new Date().getFullYear(),
      branchCode: '',
      course: '',
      currentSemester: 1,
      address: '',
      city: '',
      state: '',
      zipCode: '',
    })
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setFilterSemester('')
    setFilterBranch('')
    setFilterStatus('all')
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        await studentService.updateStudent(editingId, formData)
      } else {
        await studentService.createStudent(formData)
      }
      await fetchStudents()
      handleCloseDialog()
    } catch (err) {
      setError('Failed to save student')
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await studentService.deleteStudent(id)
        await fetchStudents()
      } catch (err) {
        setError('Failed to delete student')
        console.error(err)
      }
    }
  }

  const handleDeactivate = async (id: number) => {
    try {
      await studentService.deactivateStudent(id)
      await fetchStudents()
    } catch (err) {
      setError('Failed to deactivate student')
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
        <h2>Students</h2>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Student
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
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, email, code, or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Semester</InputLabel>
              <Select
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value as number | '')}
                label="Semester"
              >
                <MenuItem value="">All</MenuItem>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    Semester {sem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Branch Code"
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
            />
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
          Showing {filteredStudents.length} of {students.length} students
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
                First Name
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Last Name
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Email
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Mobile
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Course
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Semester
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Branch
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                City
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
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.code || 'N/A'}</TableCell>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.mobile}</TableCell>
                  <TableCell>{student.course || 'N/A'}</TableCell>
                  <TableCell>{student.currentSemester || 'N/A'}</TableCell>
                  <TableCell>{student.branchCode || 'N/A'}</TableCell>
                  <TableCell>{student.city || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={student.isActive ? 'Active' : 'Inactive'}
                      color={student.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleOpenDialog(student)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color={student.isActive ? "warning" : "primary"}
                        onClick={() =>
                          handleDeactivate(student.id || 0)
                        }
                      >
                        {student.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(student.id || 0)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 3 }}>
                  <Box sx={{ color: 'text.secondary' }}>
                    {students.length === 0 ? 'No students found' : 'No students match your filters'}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Student' : 'Add New Student'}
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Student Code"
                value={formData.code || ''}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                margin="normal"
                placeholder="e.g., STU001"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                margin="normal"
                placeholder="10 or 12 digits"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course"
                value={formData.course}
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
                margin="normal"
                placeholder="e.g., B.Tech, BCA"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Branch Code"
                value={formData.branchCode}
                onChange={(e) =>
                  setFormData({ ...formData, branchCode: e.target.value })
                }
                margin="normal"
                placeholder="e.g., CSE, ECE, ME"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Admission Year"
                type="number"
                value={formData.admissionYear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    admissionYear: parseInt(e.target.value),
                  })
                }
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Semester"
                type="number"
                value={formData.currentSemester}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentSemester: parseInt(e.target.value),
                  })
                }
                margin="normal"
                inputProps={{ min: 1, max: 8 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address || ''}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.city || ''}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                value={formData.state || ''}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Zip Code"
                value={formData.zipCode || ''}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                margin="normal"
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

export default StudentList
