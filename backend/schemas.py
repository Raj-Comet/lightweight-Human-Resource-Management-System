from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import Optional
from enum import Enum

class AttendanceStatusEnum(str, Enum):
    PRESENT = "Present"
    ABSENT = "Absent"

# Employee Schemas
class EmployeeCreate(BaseModel):
    employee_id: str = Field(..., min_length=1, max_length=50, description="Unique Employee ID")
    full_name: str = Field(..., min_length=2, max_length=100, description="Full name of employee")
    email: EmailStr = Field(..., description="Valid email address")
    department: str = Field(..., min_length=1, max_length=100, description="Department name")

class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    department: Optional[str] = Field(None, min_length=1, max_length=100)

class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: str

    class Config:
        from_attributes = True

# Attendance Schemas
class AttendanceCreate(BaseModel):
    employee_id: str = Field(..., min_length=1, max_length=50, description="Employee ID")
    date: date = Field(..., description="Attendance date")
    status: AttendanceStatusEnum = Field(..., description="Present or Absent")

class AttendanceResponse(BaseModel):
    id: int
    employee_id: str
    date: date
    status: str
    created_at: str

    class Config:
        from_attributes = True

# Error Response
class ErrorResponse(BaseModel):
    detail: str
    status_code: int
