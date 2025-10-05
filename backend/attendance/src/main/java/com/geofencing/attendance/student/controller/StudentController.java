package com.geofencing.attendance.student.controller;

import com.geofencing.attendance.student.Student;
import com.geofencing.attendance.student.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/api/addLoc")
    public Student addLocation(@RequestBody Student student) {
        // Save the student object to the database
        return studentRepository.save(student);
    }

    // Optional: Get all students for testing
    @GetMapping("/api/students")
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
}
