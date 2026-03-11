from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_
from datetime import datetime, date, timedelta
from typing import List
import logging

from database import engine, get_db
from models import Base, Employee, Attendance, AttendanceStatus
from schemas import (
    EmployeeCreate, EmployeeResponse, EmployeeUpdate,
    AttendanceCreate, AttendanceResponse, ErrorResponse
)

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="HRMS Lite API",
    description="Lightweight Human Resource Management System",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============= HEALTH CHECK =============
@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

# ============= EMPLOYEE ENDPOINTS =============

@app.post("/api/employees", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED, tags=["Employees"])
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    """Create a new employee"""
    try:
        # Check if employee_id already exists
        existing_emp = db.query(Employee).filter(Employee.employee_id == employee.employee_id).first()
        if existing_emp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Employee with ID '{employee.employee_id}' already exists"
            )

        # Check if email already exists
        existing_email = db.query(Employee).filter(Employee.email == employee.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email '{employee.email}' is already registered"
            )

        # Create new employee
        db_employee = Employee(**employee.dict())
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)

        logger.info(f"Employee created: {employee.employee_id}")
        return db_employee

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating employee: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create employee"
        )

@app.get("/api/employees", response_model=List[EmployeeResponse], tags=["Employees"])
def get_all_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get all employees with pagination"""
    try:
        employees = db.query(Employee).offset(skip).limit(limit).all()
        return employees
    except Exception as e:
        logger.error(f"Error fetching employees: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch employees"
        )

@app.get("/api/employees/{employee_id}", response_model=EmployeeResponse, tags=["Employees"])
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    """Get employee by ID"""
    try:
        employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID '{employee_id}' not found"
            )
        return employee
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching employee: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch employee"
        )

@app.put("/api/employees/{employee_id}", response_model=EmployeeResponse, tags=["Employees"])
def update_employee(
    employee_id: str,
    employee_update: EmployeeUpdate,
    db: Session = Depends(get_db)
):
    """Update employee details"""
    try:
        employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID '{employee_id}' not found"
            )

        # Check for duplicate email if updating
        if employee_update.email and employee_update.email != employee.email:
            existing_email = db.query(Employee).filter(Employee.email == employee_update.email).first()
            if existing_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Email '{employee_update.email}' is already registered"
                )

        update_data = employee_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(employee, key, value)

        db.commit()
        db.refresh(employee)
        logger.info(f"Employee updated: {employee_id}")
        return employee

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating employee: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update employee"
        )

@app.delete("/api/employees/{employee_id}", status_code=status.HTTP_200_OK, tags=["Employees"])
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    """Delete employee and associated attendance records"""
    try:
        employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID '{employee_id}' not found"
            )

        # Delete associated attendance records
        db.query(Attendance).filter(Attendance.employee_id == employee_id).delete()

        # Delete employee
        db.delete(employee)
        db.commit()
        logger.info(f"Employee deleted: {employee_id}")

        return {
            "message": f"Employee '{employee_id}' and associated records deleted successfully",
            "status": "success"
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting employee: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete employee"
        )

# ============= ATTENDANCE ENDPOINTS =============

@app.post("/api/attendance", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED, tags=["Attendance"])
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    """Mark attendance for an employee"""
    try:
        # Verify employee exists
        employee = db.query(Employee).filter(Employee.employee_id == attendance.employee_id).first()
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID '{attendance.employee_id}' not found"
            )

        # Check if attendance already marked for this date
        existing = db.query(Attendance).filter(
            and_(
                Attendance.employee_id == attendance.employee_id,
                Attendance.date == attendance.date
            )
        ).first()

        if existing:
            # Update existing record
            existing.status = attendance.status
            db.commit()
            db.refresh(existing)
            logger.info(f"Attendance updated: {attendance.employee_id} on {attendance.date}")
            return existing

        # Create new attendance record
        db_attendance = Attendance(**attendance.dict())
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)

        logger.info(f"Attendance marked: {attendance.employee_id} on {attendance.date}")
        return db_attendance

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error marking attendance: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to mark attendance"
        )

@app.get("/api/attendance", response_model=List[AttendanceResponse], tags=["Attendance"])
def get_attendance_records(
    employee_id: str = Query(None, description="Filter by employee ID"),
    start_date: date = Query(None, description="Filter from date"),
    end_date: date = Query(None, description="Filter to date"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get attendance records with optional filters"""
    try:
        query = db.query(Attendance)

        if employee_id:
            # Verify employee exists
            employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
            if not employee:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Employee with ID '{employee_id}' not found"
                )
            query = query.filter(Attendance.employee_id == employee_id)

        if start_date:
            query = query.filter(Attendance.date >= start_date)

        if end_date:
            query = query.filter(Attendance.date <= end_date)

        records = query.order_by(desc(Attendance.date)).offset(skip).limit(limit).all()
        return records

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching attendance: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch attendance records"
        )

@app.get("/api/attendance/employee/{employee_id}", response_model=List[AttendanceResponse], tags=["Attendance"])
def get_employee_attendance(
    employee_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get attendance records for specific employee"""
    try:
        # Verify employee exists
        employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID '{employee_id}' not found"
            )

        records = db.query(Attendance).filter(
            Attendance.employee_id == employee_id
        ).order_by(desc(Attendance.date)).offset(skip).limit(limit).all()

        return records

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching employee attendance: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch employee attendance"
        )

# ============= DASHBOARD/STATS ENDPOINTS (BONUS) =============

@app.get("/api/stats/dashboard", tags=["Dashboard"])
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard summary statistics"""
    try:
        total_employees = db.query(Employee).count()
        total_attendance_records = db.query(Attendance).count()
        
        # Get attendance stats for last 7 days
        seven_days_ago = date.today() - timedelta(days=7)
        recent_attendance = db.query(Attendance).filter(
            Attendance.date >= seven_days_ago
        ).count()

        present_count = db.query(Attendance).filter(
            and_(
                Attendance.date >= seven_days_ago,
                Attendance.status == AttendanceStatus.PRESENT
            )
        ).count()

        return {
            "total_employees": total_employees,
            "total_attendance_records": total_attendance_records,
            "recent_attendance_7_days": recent_attendance,
            "present_last_7_days": present_count,
            "timestamp": datetime.utcnow().isoformat()
        }

    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch dashboard statistics"
        )

@app.get("/api/stats/employee-summary", tags=["Dashboard"])
def get_employee_summary(db: Session = Depends(get_db)):
    """Get attendance summary per employee"""
    try:
        employees = db.query(Employee).all()
        summary = []

        for emp in employees:
            total_attendance = db.query(Attendance).filter(
                Attendance.employee_id == emp.employee_id
            ).count()

            present_days = db.query(Attendance).filter(
                and_(
                    Attendance.employee_id == emp.employee_id,
                    Attendance.status == AttendanceStatus.PRESENT
                )
            ).count()

            absent_days = db.query(Attendance).filter(
                and_(
                    Attendance.employee_id == emp.employee_id,
                    Attendance.status == AttendanceStatus.ABSENT
                )
            ).count()

            summary.append({
                "employee_id": emp.employee_id,
                "full_name": emp.full_name,
                "total_records": total_attendance,
                "present_days": present_days,
                "absent_days": absent_days
            })

        return summary

    except Exception as e:
        logger.error(f"Error fetching employee summary: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch employee summary"
        )

# ============= ROOT ENDPOINT =============

@app.get("/", tags=["Root"])
def root():
    """Root endpoint"""
    return {
        "message": "HRMS Lite API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
