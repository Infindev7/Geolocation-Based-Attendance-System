package com.geofencing.attendance.student.service;

import java.util.List;

import com.geofencing.attendance.student.Student;

public interface StudentService {
    public List<Student> getAllStudents();
    public Student saveStudent(Student student);
    public Student getStudentById(Long id);
    public boolean checkPassword(Student student);
}
