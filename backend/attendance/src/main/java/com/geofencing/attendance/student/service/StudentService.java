package com.geofencing.attendance.student.service;

import java.util.List;
import java.util.Optional;

import com.geofencing.attendance.student.Student;

public interface StudentService {
    public List<Student> getAllStudents();
    public boolean saveStudent(Student student);
    public Student getStudentById(Long id);
    public boolean checkPassword(Student student);
    public String getPassHash(Student student);
    public List<Student> getPresentStudents();

    // NEW
    String createAndStoreSessionToken(Long id);
    boolean validateSession(Long id, String token);
    Optional<Student> findById(Long id);
}
