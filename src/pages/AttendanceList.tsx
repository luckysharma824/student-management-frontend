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
import { attendanceService, AttendanceDTO } from '../services/api'

const AttendanceList: React.FC = () => {
  const [attendances, setAttendances] = useState<AttendanceDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<AttendanceDTO>({
    studentId: 0,
    courseId: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  })

  const handleOpenDialog = (attendance?: AttendanceDTO) => {
    if (attendance) {
      setFormData(attendance)
      setEditingId(attendance.id || null)
    } else {
      setFormData({
        studentId: 0,
        courseId: 0,
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
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
        await attendanceService.updateAttendance(editingId, formData)
      } else {
        await attendanceService.recordAttendance(formData)
      }
      handleCloseDialog()
      setError('Attendance saved successfully!')
      setAttendances([...attendances, formData])
    } catch (err) {
      setError('Failed to save attendance')
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await attendanceService.deleteAttendance(id)
        setAttendances(attendances.filter((a) => a.id !== id))
        setError('Attendance deleted successfully!')
      } catch (err) {
        setError('Failed to delete attendance')
        console.error(err)
      }
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <h2>Attendance</h2>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Record Attendance
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
                Date
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
            {attendances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No attendance records found. Click "Record Attendance" to add
                  one.
                </TableCell>
              </TableRow>
            ) : (
              attendances.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell>{attendance.studentId}</TableCell>
                  <TableCell>{attendance.courseId}</TableCell>
                  <TableCell>{attendance.date}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        backgroundColor:
                          attendance.status === 'Present'
                            ? '#4caf50'
                            : attendance.status === 'Absent'
                              ? '#f44336'
                              : '#ff9800',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {attendance.status}
                    </span>
                  </TableCell>
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
                        onClick={() =>
                          handleDelete(attendance.id || 0)
                        }
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
          {editingId
            ? 'Edit Attendance'
            : 'Record New Attendance'}
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
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            margin="normal"
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="Status"
            select
            SelectProps={{
              native: true,
            }}
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            margin="normal"
            required
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </TextField>
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

export default AttendanceList
