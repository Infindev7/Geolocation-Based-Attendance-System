package com.geofencing.attendance.student.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.geofencing.attendance.student.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

    // return students with non-null distance and distance < provided value
    List<Student> findByDistanceIsNotNullAndDistanceLessThan(Double distance);

}
