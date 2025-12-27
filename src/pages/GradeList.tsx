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
} from '@mui/material'
import { Delete, Edit, Add } from '@mui/icons-material'
import { gradeService, GradeDTO } from '../services/api'

const GradeList: React.FC = () => {
  const [grades, setGrades] = useState<GradeDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<GradeDTO>({
    studentId: 0,
    courseId: 0,
    marks: 0,
  })

  useEffect(() => {
    // Note: We don't have a getAllGrades API, so we'll show a placeholder
    setLoading(false)
  }, [])

  const handleOpenDialog = (grade?: GradeDTO) => {
    if (grade) {
      setFormData(grade)
      setEditingId(grade.id || null)
    } else {
      setFormData({
        studentId: 0,
        courseId: 0,
        marks: 0,
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
      } else {
        await gradeService.createGrade(formData)
      }
      handleCloseDialog()
      setError('Grade saved successfully!')
    } catch (err) {
      setError('Failed to save grade')
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await gradeService.deleteGrade(id)
        setError('Grade deleted successfully!')
      } catch (err) {
        setError('Failed to delete grade')
        console.error(err)
      }
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
        <h2>Grades</h2>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Grade
        </Button>
      </Box>

      {error && (
        <Box
          sx={{
            bgcolor: error.includes('successfully')
              ? 'success.light'
              : 'error.light',
            color: error.includes('successfully')
              ? 'success.dark'
              : 'error.dark',
            p: 2,
            mb: 2,
            borderRadius: 1,
          }}
        >
          {error}
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Student ID
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Course ID
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Marks
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Semester
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No grades found. Click "Add Grade" to create one.
                </TableCell>
              </TableRow>
            ) : (
              grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>{grade.studentId}</TableCell>
                  <TableCell>{grade.courseId}</TableCell>
                  <TableCell>{grade.marks}</TableCell>
                  <TableCell>{grade.semester || 'N/A'}</TableCell>
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingId ? 'Edit Grade' : 'Add New Grade'}
        </DialogTitle>
        <DialogContent sx={{ minWidth: 400, py: 2 }}>
          <TextField
            fullWidth
            label="Student ID"
            type="number"
            value={formData.studentId}
            onChange={(e) =>
              setFormData({
                ...formData,
                studentId: parseInt(e.target.value),
              })
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Course ID"
            type="number"
            value={formData.courseId}
            onChange={(e) =>
              setFormData({
                ...formData,
                courseId: parseInt(e.target.value),
              })
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Marks"
            type="number"
            value={formData.marks}
            onChange={(e) =>
              setFormData({
                ...formData,
                marks: parseFloat(e.target.value),
              })
            }
            margin="normal"
            required
            inputProps={{ step: '0.1', min: '0', max: '100' }}
          />
          <TextField
            fullWidth
            label="Semester"
            type="number"
            value={formData.semester || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                semester: e.target.value
                  ? parseInt(e.target.value)
                  : undefined,
              })
            }
            margin="normal"
          />
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

export default GradeList
