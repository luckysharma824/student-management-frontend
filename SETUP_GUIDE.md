# Student Management System - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) - v6.0 or higher
- **Git** (optional) - [Download](https://git-scm.com/)

### Verify Installation

```bash
node --version
npm --version
```

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd c:\Users\lokesh babu\Documents\projects\backend-apps\student-management
```

### 2. Build Backend

```bash
mvn clean install
```

### 3. Run Backend Server

```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

**Note**: The backend must be running before starting the frontend!

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd c:\Users\lokesh babu\Documents\projects\frontend-apps\student-management-react
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`:

- React 18.2
- TypeScript
- Material-UI
- Axios
- React Router
- And other dependencies

### 3. Configure API URL (Optional)

The frontend is configured to use `http://localhost:8080` by default.

If your backend runs on a different URL, update the `.env` file:

```
REACT_APP_API_URL=http://your-backend-url:port
```

### 4. Start Development Server

```bash
npm start
```

The application will automatically open in your default browser at `http://localhost:3000`

## Project Structure

```
student-management-react/
├── public/
│   ├── index.html              # HTML template
│   └── favicon.ico
├── src/
│   ├── services/
│   │   ├── api.ts              # All API methods and DTOs
│   │   └── apiClient.ts        # Axios configuration
│   ├── pages/
│   │   ├── Dashboard.tsx       # Dashboard overview
│   │   ├── StudentList.tsx     # Student CRUD
│   │   ├── CourseList.tsx      # Course CRUD
│   │   ├── TeacherList.tsx     # Teacher CRUD
│   │   ├── GradeList.tsx       # Grade management
│   │   └── AttendanceList.tsx  # Attendance tracking
│   ├── App.tsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── index.tsx               # React entry point
│   ├── index.css               # Global styles
│   └── main.tsx                # Application bootstrap
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── README.md                   # Project documentation
├── API_INTEGRATION_GUIDE.md    # Detailed API documentation
└── SETUP_GUIDE.md             # This file
```

## Available Scripts

### `npm start`

- Runs the app in development mode
- Opens [http://localhost:3000](http://localhost:3000)
- The page will reload when you make changes
- Console shows lint errors and warnings

### `npm test`

- Launches the test runner in interactive watch mode

### `npm run build`

- Builds the app for production
- Output is in the `build` folder
- The build is minified and optimized

### `npm run eject`

⚠️ **Warning**: This is a one-way operation. Once you eject, you can't go back!

## Features Overview

### Dashboard

- View total count of students, courses, and teachers
- Real-time data loading

### Student Management

- ✅ Create new students
- ✅ View all students
- ✅ Edit student information
- ✅ Delete student records
- ✅ Deactivate students
- ✅ Search students
- ✅ Filter by semester and branch

### Course Management

- ✅ Create courses
- ✅ View all courses
- ✅ Edit course details
- ✅ Delete courses
- ✅ Deactivate courses
- ✅ Filter by department
- ✅ Search courses

### Teacher Management

- ✅ Create teacher records
- ✅ View all teachers
- ✅ Edit teacher information
- ✅ Delete teachers
- ✅ Deactivate teachers
- ✅ Search teachers
- ✅ Filter by department

### Grade Management

- ✅ Record student grades
- ✅ Edit grades
- ✅ Delete grades
- ✅ View grades by student
- ✅ Calculate GPA and averages

### Attendance Management

- ✅ Record daily attendance
- ✅ Mark as Present/Absent/Leave
- ✅ Edit attendance records
- ✅ Delete attendance
- ✅ Track attendance percentage
- ✅ Filter by date range

## Technology Stack

| Technology   | Version | Purpose               |
| ------------ | ------- | --------------------- |
| React        | 18.2    | UI framework          |
| TypeScript   | 5.1     | Type-safe development |
| Material-UI  | 5.14    | UI components         |
| Axios        | 1.4     | HTTP client           |
| React Router | 6.14    | Navigation            |
| Emotion      | 11.11   | CSS-in-JS             |

## Troubleshooting

### Issue: "npm: command not found"

**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

### Issue: Port 3000 already in use

**Solution** (Windows PowerShell):

```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solution** (macOS/Linux):

```bash
lsof -i :3000
kill -9 <PID>
```

### Issue: API calls fail with CORS error

**Solution**:

1. Verify backend is running on the correct port
2. Check `.env` file has correct `REACT_APP_API_URL`
3. Ensure backend has CORS enabled

### Issue: Build fails with TypeScript errors

**Solution**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Cannot find module" error

**Solution**:

```bash
# Reinstall dependencies
npm install

# Clear cache
npm cache clean --force
npm install
```

## Performance Optimization

### Production Build

```bash
npm run build
```

The production build is optimized and minified:

- Code splitting enabled
- Tree shaking applied
- CSS minified
- JS minified

### Deployment

The `build` folder is ready for deployment to any static hosting:

**Netlify**:

```bash
npm run build
# Deploy the 'build' folder
```

**Vercel**:

```bash
npm run build
# Deploy the 'build' folder
```

**Traditional Web Server**:
Copy the contents of the `build` folder to your web server's public directory.

## Development Tips

### 1. VSCode Extensions (Recommended)

- **ES7+ React/Redux/React-Native snippets** by dsznajder.es7-react-js-snippets
- **TypeScript Vue Plugin (Volar)** by Vue
- **Prettier** by esbenp.prettier-vscode
- **ESLint** by dbaeumer.vscode-eslint

### 2. Browser DevTools

- React Developer Tools (browser extension)
- Redux DevTools (if using Redux)
- Network tab for API debugging

### 3. Code Quality

- Use TypeScript for type safety
- Follow React best practices
- Keep components small and reusable
- Use meaningful variable names

### 4. Testing

```bash
npm test
```

Press `a` to run all tests, `f` to run failed tests, `q` to quit.

## API Response Examples

### Success Response

```json
{
  "total": 50,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "isActive": true
    }
  ]
}
```

### Error Response

```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid email format"
}
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8080

# Add more variables as needed
REACT_APP_DEBUG=false
REACT_APP_VERSION=1.0.0
```

## Common Commands

| Command                   | Description              |
| ------------------------- | ------------------------ |
| `npm start`               | Start development server |
| `npm test`                | Run tests                |
| `npm run build`           | Build for production     |
| `npm install <package>`   | Install new package      |
| `npm uninstall <package>` | Remove package           |
| `npm update`              | Update all packages      |

## Next Steps

1. ✅ Start the backend server
2. ✅ Install frontend dependencies
3. ✅ Start the development server
4. ✅ Open http://localhost:3000 in your browser
5. ✅ Start using the application!

## Useful Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Axios Documentation](https://axios-http.com/)
- [React Router Documentation](https://reactrouter.com/)

## Support & Issues

If you encounter any issues:

1. Check the [API Integration Guide](./API_INTEGRATION_GUIDE.md)
2. Review the [README.md](./README.md)
3. Check browser console for errors (F12)
4. Check backend logs
5. Verify all prerequisites are installed

## Version History

### v1.0.0 (2024-12-26)

- Initial release
- All CRUD operations implemented
- Dashboard with statistics
- Responsive Material-UI design
- Full TypeScript support
- Comprehensive API integration

## License

MIT License - You're free to use this project for any purpose.
