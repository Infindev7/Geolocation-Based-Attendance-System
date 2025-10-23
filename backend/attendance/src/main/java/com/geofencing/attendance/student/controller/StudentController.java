package com.geofencing.attendance.student.controller;

import com.geofencing.attendance.admin.Admin;
import com.geofencing.attendance.student.Student;
import com.geofencing.attendance.student.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;



@RestController
public class StudentController {


    @Autowired
    private StudentService studentService;

    // LOGIN: id + password -> returns session token (passHash)
    @PostMapping("/api/login")
    public ResponseEntity<?> loginRequest(@RequestBody Map<String, String> body) {
        try {
            Long id = body.get("id") == null ? null : Long.valueOf(body.get("id"));
            String password = body.get("password");
            if (id == null || password == null || password.isBlank()) {
                return ResponseEntity.badRequest().body("Missing id or password");
            }

            Student temp = new Student();
            temp.setId(id);
            temp.setPassword(password);

            if (!studentService.checkPassword(temp)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
            }

            // Generate and persist session token (passHash)
            String token = studentService.createAndStoreSessionToken(id);

            Student full = studentService.getStudentById(id);
            return ResponseEntity.ok(
                    Map.of(
                            "id", full.getId(),
                            "name", full.getName(),
                            "passHash", token
                    )
            );
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid id");
        }
    }


    // VERIFY: client sends stored token -> server confirms
    @PostMapping("/api/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> body) {
        Long id = body.get("id") == null ? null : Long.valueOf(body.get("id"));
        String token = body.get("passHash");
        if (id == null || token == null) {
            return ResponseEntity.badRequest().body("Missing id or passHash");
        }
        boolean ok = studentService.validateSession(id, token);
        if (ok) {
            Student s = studentService.getStudentById(id);
            return ResponseEntity.ok(Map.of("valid", true, "name", s.getName()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false));
    }

    // SECURED addLoc: require id + passHash with location payload
    @PutMapping("/api/addLoc")
    public ResponseEntity<?> addLocation(@RequestBody Map<String, Object> body) {
        try {
            Long id = body.get("id") == null ? null : Long.valueOf(body.get("id").toString());
            String token = (String) body.get("passHash");
            Double latitude = body.get("latitude") == null ? null : Double.valueOf(body.get("latitude").toString());
            Double longitude = body.get("longitude") == null ? null : Double.valueOf(body.get("longitude").toString());
            Double distance = body.get("distance") == null ? null : Double.valueOf(body.get("distance").toString());

            if (id == null || token == null || latitude == null || longitude == null) {
                return ResponseEntity.badRequest().body("Missing fields");
            }

            if (!studentService.validateSession(id, token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid session");
            }

            Student s = studentService.getStudentById(id);
            s.setLatitude(latitude);
            s.setLongitude(longitude);
            s.setDistance(distance);
            boolean saved = studentService.saveStudent(s); // save returns boolean
            if (saved) {
                return ResponseEntity.ok(Map.of("saved", true));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("saved", false));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Bad payload");
        }
    }

    // (Optional) list students (avoid exposing passHash)
    @GetMapping("/api/students")
    public ResponseEntity<?> getAllStudents() {
        return ResponseEntity.ok(
                studentService.getAllStudents()
                        .stream()
                        .map(s -> {
                            Map<String, Object> studentMap = new java.util.HashMap<>();
                            studentMap.put("id", s.getId());
                            studentMap.put("name", s.getName());
                            studentMap.put("latitude", s.getLatitude());
                            studentMap.put("longitude", s.getLongitude());
                            studentMap.put("distance", s.getDistance());
                            return studentMap;
                        })
                        .toList()
        );
    }


    @PostMapping("/api/checkAdmin")
    public ResponseEntity<?> checkAdmin(@RequestBody Admin admin) {
        if (admin == null || admin.getPassword() == null) {
            return ResponseEntity.badRequest().body("Missing password");
        }
        if("admin123".equals(admin.getPassword())){
            return ResponseEntity.ok(Map.of(
                "admin",true
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Wrong Credentials");
    }
    
}
