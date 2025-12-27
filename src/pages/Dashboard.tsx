import React, { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material'
import {
  studentService,
  courseService,
  teacherService,
} from '../services/api'

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalTeachers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const [studentsRes, coursesRes, teachersRes] = await Promise.all([
          studentService.getAllStudents(),
          courseService.getAllCourses(),
          teacherService.getAllTeachers(),
        ])

        setStats({
          totalStudents: studentsRes.data?.data?.length || 0,
          totalCourses: coursesRes.data?.data?.length || 0,
          totalTeachers: teachersRes.data?.data?.length || 0,
        })
      } catch (err) {
        setError('Failed to load dashboard statistics')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ color: 'error.main', py: 2 }}>
        {error}
      </Box>
    )
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      color: '#1976d2',
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      color: '#388e3c',
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      color: '#d32f2f',
    },
  ]

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${card.color}15 0%, ${card.color}05 100%)`,
                border: `2px solid ${card.color}`,
              }}
            >
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {card.title}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ color: card.color, fontWeight: 'bold' }}
                >
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Dashboard
