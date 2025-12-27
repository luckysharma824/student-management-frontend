# Quick Start Guide

## 🚀 Get Running in 5 Minutes!

### Step 1: Start Backend (Terminal 1)

```bash
cd c:\Users\lokesh babu\Documents\projects\backend-apps\student-management
mvn spring-boot:run
```

✅ Wait for: "Started StudentManagementApplication in..."

### Step 2: Install Frontend (Terminal 2)

```bash
cd c:\Users\lokesh babu\Documents\projects\frontend-apps\student-management-react
npm install
```

✅ Wait for completion (first time only, ~2-3 minutes)

### Step 3: Start Frontend (Same Terminal 2)

```bash
npm start
```

✅ Browser opens automatically at http://localhost:3000

### Step 4: Start Using! 🎉

- Click on navigation menu (hamburger icon)
- Go to "Students", "Courses", "Teachers", "Grades", or "Attendance"
- Add, edit, delete records
- View dashboard statistics

---

## 📚 What's Running?

| Component    | URL                   | Purpose               |
| ------------ | --------------------- | --------------------- |
| Backend API  | http://localhost:8080 | Data & business logic |
| Frontend App | http://localhost:3000 | User interface        |

---

## ⚙️ One-Time Setup (If Fresh Install)

### Check Prerequisites

```bash
# Should output version numbers
node --version
npm --version
```

### (Optional) Update npm

```bash
npm install -g npm@latest
```

---

## 🎯 Common Tasks

### Change API URL

Edit `.env` file:

```
REACT_APP_API_URL=http://your-server:8080
```

Then restart: `npm start`

### Stop Everything

- Frontend: Press `Ctrl+C` in Terminal 2
- Backend: Press `Ctrl+C` in Terminal 1

### Clear Data (Reset)

1. Drop and recreate database in backend
2. Restart backend
3. Refresh browser at http://localhost:3000

### Production Build

```bash
npm run build
# Output in 'build' folder
```

---

## 🐛 Quick Troubleshooting

| Problem                 | Solution                               |
| ----------------------- | -------------------------------------- |
| "Cannot connect to API" | Verify backend is running on port 8080 |
| "Port 3000 in use"      | Change port: `PORT=3001 npm start`     |
| "npm not found"         | Install Node.js from nodejs.org        |
| "Module not found"      | Run `npm install`                      |
| "Black/blank screen"    | Check browser console (F12) for errors |

---

## 📝 Frontend Features

### Dashboard

- 📊 Total students, courses, teachers count
- Auto-refreshing statistics

### Students

- ➕ Add new students
- ✏️ Edit student details
- 🗑️ Delete students
- 🔍 Search & filter students

### Courses

- ➕ Create courses
- ✏️ Edit course info
- 🗑️ Delete courses
- 🔍 Search & filter by department

### Teachers

- ➕ Add teachers
- ✏️ Edit teacher profiles
- 🗑️ Delete teachers
- 🔍 Search & filter by department

### Grades

- ➕ Record grades
- ✏️ Update grades
- 🗑️ Delete grades
- 📈 View GPA & averages

### Attendance

- ✅ Mark attendance (Present/Absent/Leave)
- 📊 Track attendance percentage
- 📅 Filter by date range
- 🔍 View by student/course/semester

---

## 🌐 API Endpoints Available

All these endpoints are integrated and ready to use:

**Students**: Create, Read, Update, Delete, Search, Filter
**Courses**: Create, Read, Update, Delete, Search, Filter
**Teachers**: Create, Read, Update, Delete, Search, Filter
**Grades**: Create, Read, Update, Delete, Calculate GPA/Average
**Attendance**: Record, Update, Delete, Track %, Filter by dates

See [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for detailed examples.

---

## 💡 Tips & Tricks

1. **Use Material-UI Theme Colors**

   - Blue primary buttons for main actions
   - Red for delete operations
   - Green for success states

2. **Form Validation**

   - Required fields have an asterisk (\*)
   - Email and phone formats are validated
   - Date fields show a date picker

3. **Error Handling**

   - Error messages appear in red boxes
   - Success messages appear in green boxes
   - Check browser console (F12) for technical details

4. **Performance**
   - Data loads with spinners
   - Tables handle large datasets efficiently
   - Responsive design works on mobile & desktop

---

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🔐 Security Notes (Development)

- ⚠️ This is a development setup
- ⚠️ No authentication implemented yet
- ⚠️ For production, add:
  - User authentication
  - Role-based access control
  - HTTPS
  - API key validation
  - CORS restrictions

---

## 📞 Next Steps

1. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
2. Check [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for API details
3. View [README.md](./README.md) for feature overview

---

## ✨ You're All Set!

Happy coding! 🚀

Questions? Check:

- Browser console (F12)
- Backend logs
- API documentation
- Troubleshooting section above
