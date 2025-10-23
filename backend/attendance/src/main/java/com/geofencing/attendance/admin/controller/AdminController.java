package com.geofencing.attendance.admin.controller;

import org.springframework.web.bind.annotation.RestController;

import com.geofencing.attendance.student.Student;
import com.geofencing.attendance.student.service.StudentService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
public class AdminController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/admin/getAllStudents")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }


    @PostMapping("/admin/addStudent")
    public ResponseEntity<?> addStudent(@RequestBody Student student) {
        if(studentService.saveStudent(student)){
            return ResponseEntity.status(HttpStatus.CREATED).body("Student Created Successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Invalid Credentials");
    }
    

    @GetMapping("/admin/getPresentStudents")
    public ResponseEntity<?> getPresentStudents() {
        if(studentService.getPresentStudents() != null){
            return ResponseEntity.ok(studentService.getPresentStudents());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Students Found");
    }
    
    

}
