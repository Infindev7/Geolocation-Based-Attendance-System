package com.geofencing.attendance.student.service.implementation;

import com.geofencing.attendance.student.Student;
import com.geofencing.attendance.student.repository.StudentRepository;
import com.geofencing.attendance.student.service.StudentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentServiceImplementation implements StudentService{

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Student saveStudent(Student student) {
        // Hash the password before saving
        if (student.getPassword() != null) {
            student.setPassword(passwordEncoder.encode(student.getPassword()));
        }
        return studentRepository.save(student);
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    @Override
    public boolean checkPassword(Student student) {
        if(student.getPassword() != null){
            Student check = studentRepository.findById(student.getId()).orElse(null);
            if(check != null){
                return passwordEncoder.matches(student.getPassword(), check.getPassword());
                
            }
        }
        return false;
    }

    
}
