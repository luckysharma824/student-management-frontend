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
  FormControlLabel,
  Switch,
} from '@mui/material'
import { Delete, Edit, Add, Search, Clear } from '@mui/icons-material'
import { teacherService, TeacherDTO } from '../services/api'

const TeacherList: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherDTO[]>([])
  const [filteredTeachers, setFilteredTeachers] = useState<TeacherDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<TeacherDTO>({
    name: '',
    email: '',
    phone: '',
    department: '',
  })

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [departments, setDepartments] = useState<string[]>([])

  useEffect(() => {
    fetchTeachers()
  }, [])

  // Filter teachers based on search and filter criteria
  useEffect(() => {
    let filtered = [...teachers]

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.name?.toLowerCase().includes(term) ||
          t.email?.toLowerCase().includes(term) ||
          t.phone?.includes(searchTerm)
      )
    }

    // Department filter
    if (filterDepartment.trim()) {
      filtered = filtered.filter(
        (t) =>
          t.department?.toLowerCase() === filterDepartment.toLowerCase()
      )
    }

    // Status filter
    if (filterStatus === 'active') {
      filtered = filtered.filter((t) => t.isActive === true)
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter((t) => t.isActive === false)
    }

    setFilteredTeachers(filtered)

    // Extract unique departments for filter dropdown
    const uniqueDepartments = Array.from(
      new Set(teachers.map((t) => t.department).filter(Boolean))
    ) as string[]
    setDepartments(uniqueDepartments)
  }, [teachers, searchTerm, filterDepartment, filterStatus])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const response = await teacherService.getAllTeachers()
      setTeachers(response.data?.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to load teachers')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format'
    }

    if (!formData.phone?.trim()) {
      errors.phone = 'Phone is required'
    }

    if (!formData.department?.trim()) {
      errors.department = 'Department is required'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleOpenDialog = (teacher?: TeacherDTO) => {
    if (teacher) {
      setFormData(teacher)
      setEditingId(teacher.id || null)
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        qualifications: '',
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

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    try {
      if (editingId) {
        await teacherService.updateTeacher(editingId, formData)
      } else {
        await teacherService.createTeacher(formData)
      }
      await fetchTeachers()
      handleCloseDialog()
      setError(null)
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save teacher'
      setError(errorMsg)
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await teacherService.deleteTeacher(id)
        await fetchTeachers()
      } catch (err) {
        setError('Failed to delete teacher')
        console.error(err)
      }
    }
  }

  const handleDeactivate = async (id: number) => {
    try {
      await teacherService.deactivateTeacher(id)
      await fetchTeachers()
    } catch (err) {
      setError('Failed to deactivate teacher')
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
        <h2>Teachers</h2>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Teacher
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
              placeholder="Search by name, email, or phone"
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
          Showing {filteredTeachers.length} of {teachers.length} teachers
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Name
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Email
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Phone
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Department
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
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.phone}</TableCell>
                  <TableCell>{teacher.department}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        teacher.isActive ? 'Active' : 'Inactive'
                      }
                      color={
                        teacher.isActive ? 'success' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleOpenDialog(teacher)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color={teacher.isActive ? "warning" : "primary"}
                        onClick={() =>
                          handleDeactivate(teacher.id || 0)
                        }
                      >
                        {teacher.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(teacher.id || 0)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Box sx={{ color: 'text.secondary' }}>
                    {teachers.length === 0
                      ? 'No teachers found'
                      : 'No teachers match your filters'}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Teacher' : 'Add New Teacher'}
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                margin="normal"
                error={!!validationErrors.name}
                helperText={validationErrors.name}
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
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                margin="normal"
                error={!!validationErrors.phone}
                helperText={validationErrors.phone}
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Qualifications"
                value={formData.qualifications || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    qualifications: e.target.value,
                  })
                }
                margin="normal"
                multiline
                rows={2}
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

export default TeacherList
