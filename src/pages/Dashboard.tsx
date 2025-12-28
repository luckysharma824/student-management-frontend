import React, { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Chip,
} from '@mui/material'
import {
  People,
  School,
  Person,
  CheckCircle,
  Cancel,
} from '@mui/icons-material'
import {
  studentService,
  courseService,
  teacherService,
} from '../services/api'

interface DashboardStats {
  totalStudents: number
  activeStudents: number
  inactiveStudents: number
  totalCourses: number
  activeCourses: number
  inactiveCourses: number
  totalTeachers: number
  activeTeachers: number
  inactiveTeachers: number
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    totalCourses: 0,
    activeCourses: 0,
    inactiveCourses: 0,
    totalTeachers: 0,
    activeTeachers: 0,
    inactiveTeachers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Fetch all data in parallel
        const [
          allStudentsRes,
          activeStudentsRes,
          allCoursesRes,
          activeCoursesRes,
          allTeachersRes,
          activeTeachersRes,
        ] = await Promise.all([
          studentService.getAllStudents(),
          studentService.getActiveStudents(),
          courseService.getAllCourses(),
          courseService.getActiveCourses(),
          teacherService.getAllTeachers(),
          teacherService.getActiveTeachers(),
        ])

        const totalStudents = allStudentsRes.data?.total || 0
        const activeStudents = activeStudentsRes.data?.total || 0
        const totalCourses = allCoursesRes.data?.total || 0
        const activeCourses = activeCoursesRes.data?.total || 0
        const totalTeachers = allTeachersRes.data?.total || 0
        const activeTeachers = activeTeachersRes.data?.total || 0

        setStats({
          totalStudents,
          activeStudents,
          inactiveStudents: totalStudents - activeStudents,
          totalCourses,
          activeCourses,
          inactiveCourses: totalCourses - activeCourses,
          totalTeachers,
          activeTeachers,
          inactiveTeachers: totalTeachers - activeTeachers,
        })
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard statistics')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  const mainStatCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      active: stats.activeStudents,
      inactive: stats.inactiveStudents,
      color: '#1976d2',
      icon: <People sx={{ fontSize: 48, color: '#1976d2' }} />,
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      active: stats.activeCourses,
      inactive: stats.inactiveCourses,
      color: '#388e3c',
      icon: <School sx={{ fontSize: 48, color: '#388e3c' }} />,
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      active: stats.activeTeachers,
      inactive: stats.inactiveTeachers,
      color: '#d32f2f',
      icon: <Person sx={{ fontSize: 48, color: '#d32f2f' }} />,
    },
  ]

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of Student Management System
        </Typography>
      </Box>

      {/* Main Statistics Cards */}
      <Grid container spacing={3}>
        {mainStatCards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${card.color}10 0%, ${card.color}05 100%)`,
                borderLeft: `6px solid ${card.color}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{ color: card.color, fontWeight: 'bold', mb: 2 }}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                  <Box>{card.icon}</Box>
                </Box>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<CheckCircle sx={{ fontSize: 16 }} />}
                    label={`Active: ${card.active}`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                  <Chip
                    icon={<Cancel sx={{ fontSize: 16 }} />}
                    label={`Inactive: ${card.inactive}`}
                    size="small"
                    color="default"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Summary Section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
              Quick Summary
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    {((stats.activeStudents / stats.totalStudents) * 100 || 0).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Student Enrollment Rate
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {((stats.activeCourses / stats.totalCourses) * 100 || 0).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Courses
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
                    {stats.totalStudents && stats.totalTeachers
                      ? (stats.totalStudents / stats.totalTeachers).toFixed(1)
                      : '0'}
                    :1
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Student-Teacher Ratio
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Additional Info Cards */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Student Statistics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Total Enrolled</Typography>
                  <Chip label={stats.totalStudents} color="primary" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Active Students</Typography>
                  <Chip label={stats.activeStudents} color="success" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Inactive Students</Typography>
                  <Chip label={stats.inactiveStudents} color="default" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Faculty & Courses
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Total Faculty</Typography>
                  <Chip label={stats.totalTeachers} color="error" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Active Teachers</Typography>
                  <Chip label={stats.activeTeachers} color="success" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Available Courses</Typography>
                  <Chip label={stats.activeCourses} color="success" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
