import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People,
  Book,
  School,
  CheckCircle,
  Menu as MenuIcon,
} from '@mui/icons-material'
import Dashboard from './pages/Dashboard'
import StudentList from './pages/StudentList'
import CourseList from './pages/CourseList'
import TeacherList from './pages/TeacherList'
import GradeList from './pages/GradeList'
import AttendanceList from './pages/AttendanceList'
import './App.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { label: 'Students', icon: <People />, path: '/students' },
    { label: 'Courses', icon: <Book />, path: '/courses' },
    { label: 'Teachers', icon: <School />, path: '/teachers' },
    { label: 'Grades', icon: <School />, path: '/grades' },
    { label: 'Attendance', icon: <CheckCircle />, path: '/attendance' },
  ]

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ padding: 2 }}>
        <h2>Student Management</h2>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            href={item.path}
            sx={{
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
                marginRight: 16,
              }}
            >
              <MenuIcon />
            </button>
            <h1 style={{ margin: 0, fontSize: '24px' }}>
              Student Management System
            </h1>
          </Toolbar>
        </AppBar>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          {drawer}
        </Drawer>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/teachers" element={<TeacherList />} />
            <Route path="/grades" element={<GradeList />} />
            <Route path="/attendance" element={<AttendanceList />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  )
}

export default App
