package com.geofencing.attendance.student.repository;

import com.geofencing.attendance.student.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
    // Add custom query methods 
}
