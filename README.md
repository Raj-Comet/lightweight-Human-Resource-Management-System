# HRMS Lite - Lightweight Human Resource Management System

A professional, full-stack Human Resource Management System built with modern technologies. The application allows administrators to manage employee records and track daily attendance efficiently.

![HRMS Lite](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Bonus Features](#bonus-features)
- [Assumptions & Limitations](#assumptions--limitations)
- [Contributing](#contributing)

## ✨ Features

### Core Functionality

#### Employee Management
- ✅ **Add Employee**: Create new employees with ID, name, email, and department
- ✅ **View Employees**: Display all employees in a professional table format
- ✅ **Update Employee**: Edit employee details (except ID)
- ✅ **Delete Employee**: Remove employees and associated attendance records
- ✅ **Duplicate Handling**: Prevent duplicate employee IDs and emails
- ✅ **Validation**: Server-side and client-side validation for all inputs

#### Attendance Management
- ✅ **Mark Attendance**: Record attendance with date and status (Present/Absent)
- ✅ **View Records**: Display attendance history for each employee
- ✅ **Update Records**: Modify attendance records if marked incorrectly
- ✅ **Date Filtering**: Filter attendance by date range
- ✅ **Employee Filtering**: Filter records by employee

### Bonus Features

- ✅ **Dashboard**: Summary statistics and overview
- ✅ **Employee Attendance Summary**: Per-employee attendance statistics with percentage
- ✅ **Attendance Charts**: Visual representation of attendance data
- ✅ **Filter by Date**: Advanced date filtering for attendance records
- ✅ **Present Days Counter**: Display total present days per employee
- ✅ **Error Handling**: Comprehensive error messages and meaningful HTTP status codes

### UI/UX Features

- ✅ **Professional Design**: Clean, modern, and intuitive interface
- ✅ **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- ✅ **Loading States**: Visual feedback for async operations
- ✅ **Empty States**: Helpful messages when no data is available
- ✅ **Error States**: Clear error messages and recovery options
- ✅ **Modal Dialogs**: Smooth modal interactions for forms
- ✅ **Data Validation**: Real-time client-side and server-side validation
- ✅ **Accessibility**: Semantic HTML and proper color contrast

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Styling**: CSS3 (Responsive, Modern)
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **deployment**: Vercel

### Backend
- **Framework**: FastAPI (Python)
- **Web Server**: Uvicorn
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Database**: SQLite (Development), PostgreSQL (Production)
- **Deployment**: Render / Railway

### Database
- **Development**: SQLite
- **Production**: PostgreSQL
- **ORM**: SQLAlchemy

### DevOps & Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Version Control**: Git & GitHub
- **Environment Management**: dotenv

## 📁 Project Structure

```
hrms-lite/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js                 # API client with axios
│   │   ├── components/
│   │   │   ├── Dashboard.js           # Dashboard component (bonus)
│   │   │   ├── EmployeeManagement.js  # Employee CRUD component
│   │   │   ├── AttendanceManagement.js # Attendance component
│   │   │   └── UI.js                  # Reusable UI components
│   │   ├── hooks/
│   │   │   └── useAsync.js            # Custom hooks for data fetching
│   │   ├── App.js                     # Main App component
│   │   ├── App.css                    # App styling
│   │   ├── index.js                   # React entry point
│   │   └── index.css                  # Global styles
│   ├── package.json
│   ├── .env                           # Environment variables
│   └── .gitignore
│
├── backend/
│   ├── main.py                        # FastAPI application
│   ├── models.py                      # SQLAlchemy models
│   ├── schemas.py                     # Pydantic schemas
│   ├── database.py                    # Database configuration
│   ├── requirements.txt               # Python dependencies
│   ├── .env                           # Environment variables
│   ├── Procfile                       # Deployment configuration
│   └── .gitignore
│
├── .gitignore                         # Git ignore file
└── README.md                          # This file
```

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

### For Backend
- Python 3.8 or higher
- pip (Python package manager)

### For Frontend
- Node.js 14+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### For Deployment
- Git account
- GitHub account
- Vercel account (for frontend)
- Render account (for backend)

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/hrms-lite.git
cd hrms-lite
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (already included)
# DATABASE_URL can be changed for production PostgreSQL
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file (already included)
# Update REACT_APP_API_URL to your backend URL
```

## 🚀 Running Locally

### Start Backend Server

```bash
# From backend directory with venv activated
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Backend will be available at: http://localhost:8000
# API Docs available at: http://localhost:8000/docs
```

### Start Frontend Server

```bash
# From frontend directory
npm start

# Frontend will open at: http://localhost:3000
```

### Access the Application

1. Open your browser and go to `http://localhost:3000`
2. The frontend will automatically connect to the local backend
3. Start managing employees and attendance!

## 🌐 Deployment

### Deploy Backend to Render

1. **Create Render Account**: Go to [render.com](https://render.com)
2. **Create New Web Service**:
   - Connect your GitHub repository
   - Choose backend folder
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. **Set Environment Variables**:
   - `DATABASE_URL`: PostgreSQL connection string (optional)
4. **Deploy**: Render will auto-deploy on push

### Deploy Frontend to Vercel

1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com)
2. **Import Project**:
   - Connect your GitHub repository
   - Select frontend folder
3. **Set Environment Variables**:
   - `REACT_APP_API_URL`: Your Render backend URL
4. **Deploy**: Vercel will auto-deploy on push

### Update Frontend API URL

After deploying the backend, update the frontend `.env`:

```bash
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

Then redeploy the frontend.

## 📚 API Documentation

### Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://your-render-url.onrender.com`

### Interactive API Docs
Visit `{BASE_URL}/docs` for Swagger UI documentation

### Key Endpoints

#### Employee Management

- `POST /api/employees` - Create new employee
- `GET /api/employees` - Get all employees
- `GET /api/employees/{employee_id}` - Get specific employee
- `PUT /api/employees/{employee_id}` - Update employee
- `DELETE /api/employees/{employee_id}` - Delete employee

#### Attendance Management

- `POST /api/attendance` - Mark attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/employee/{employee_id}` - Get employee attendance
- `GET /api/stats/dashboard` - Get dashboard statistics
- `GET /api/stats/employee-summary` - Get employee summary

### Example Request/Response

**Create Employee**
```bash
POST /api/employees
Content-Type: application/json

{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "department": "Engineering"
}

Response: 201 Created
{
  "id": 1,
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "department": "Engineering",
  "created_at": "2024-03-11T10:30:00"
}
```

## 🎁 Bonus Features

### 1. Dashboard
- Overview statistics (total employees, attendance records)
- Last 7 days attendance summary
- Present days counter

### 2. Employee Attendance Summary
- Per-employee attendance statistics
- Attendance percentage calculation
- Present vs. Absent days breakdown
- Visual progress bars

### 3. Advanced Filtering
- Filter attendance by date range
- Filter by employee
- Pagination support

### 4. Professional UI
- Responsive design
- Loading states
- Error boundaries
- Empty states
- Toast notifications
- Modal dialogs

## 📝 Assumptions & Limitations

### Assumptions

1. **Single Admin User**: No authentication/authorization implemented
2. **SQLite for Development**: Easy local setup, PostgreSQL for production
3. **UTC Timezone**: All timestamps stored and displayed in UTC
4. **Date Format**: ISO 8601 format (YYYY-MM-DD)
5. **No Shift Management**: Simple Present/Absent tracking only
6. **No Leave Management**: Out of scope for this version
7. **No Notifications**: No email/SMS notifications
8. **No Audit Trail**: Actions are not logged for compliance

### Limitations

1. **Authentication**: Not implemented (assumes trusted environment)
2. **Data Backup**: Manual backup needed (not automated)
3. **File Uploads**: No bulk import/export functionality (can be added)
4. **Reporting**: Basic statistics only (advanced reports not available)
5. **Multi-tenancy**: Single organization support only
6. **Real-time Updates**: No WebSocket or real-time sync
7. **Mobile App**: Web-only, no native mobile app
8. **Localization**: English language only

### Future Enhancements

- User authentication and role-based access
- Bulk employee import (CSV)
- Export reports (PDF, Excel)
- Email notifications
- Advanced analytics and dashboards
- Mobile application (React Native)
- GraphQL API
- Microservices architecture
- Audit logging and compliance

## 🐛 Error Handling

The application includes comprehensive error handling:

### Backend
- Input validation (Pydantic)
- Duplicate checking
- Resource not found (404)
- Bad request (400)
- Internal server errors (500)
- Meaningful error messages

### Frontend
- API error handling
- Network error detection
- User-friendly error messages
- Loading states
- Retry functionality
- Backend connection status indicator

## 🔒 Security Considerations

### Implemented
- Input validation
- SQL injection prevention (ORM)
- CORS configuration
- Error message safety

### Recommended for Production
- JWT authentication
- Role-based access control
- Rate limiting
- HTTPS/SSL
- Data encryption
- API key management
- Regular security audits

## 🧪 Testing

### Manual Testing Checklist

**Employee Management**
- [ ] Add employee with valid data
- [ ] Try adding duplicate email - should fail
- [ ] Try adding duplicate employee ID - should fail
- [ ] Try adding invalid email - should fail
- [ ] Update employee details
- [ ] Delete employee - should also delete attendance records
- [ ] View all employees

**Attendance Management**
- [ ] Select employee and mark attendance
- [ ] Try marking same date twice - should update
- [ ] View attendance for employee
- [ ] Filter by date range
- [ ] Check attendance percentage calculation

**Dashboard**
- [ ] View total employees count
- [ ] View total attendance records
- [ ] Check 7-day attendance stats
- [ ] Verify employee summary accuracy

## 📞 Support

For issues or questions:
1. Check the README thoroughly
2. Review API documentation at `/docs`
3. Check browser console for errors
4. Check backend logs

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

HRMS Lite - Built as a full-stack development assignment

## 🙏 Acknowledgments

- FastAPI documentation and community
- React documentation and ecosystem
- SQLAlchemy for ORM excellence
- Vercel and Render for seamless deployment

---

**Last Updated**: March 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
