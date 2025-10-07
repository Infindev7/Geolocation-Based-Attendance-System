package com.geofencing.attendance.student.controller;

import com.geofencing.attendance.student.Student;
import com.geofencing.attendance.student.service.StudentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/api/addLoc")
    public Student addLocation(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }

    @GetMapping("/api/students")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> loginRequest(@RequestBody Student student) {
        //TODO: process POST request
        if(studentService.checkPassword(student)){
            return ResponseEntity.ok("Successfully Authenticated");
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
    }
    
}
