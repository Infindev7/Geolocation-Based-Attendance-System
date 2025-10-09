package com.geofencing.attendance.student.service.implementation;

import com.geofencing.attendance.student.Student;
import com.geofencing.attendance.student.repository.StudentRepository;
import com.geofencing.attendance.student.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class StudentServiceImplementation implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final SecureRandom secureRandom = new SecureRandom();

    private String generateSessionToken() {
        byte[] buf = new byte[32];
        secureRandom.nextBytes(buf);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buf);
    }

    private boolean isBcrypt(String v) {
        return v != null && v.matches("^\\$2[aby]?\\$\\d{2}\\$.*");
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student saveStudent(Student student) {
        // Preserve existing hash on updates
        if (student.getId() != null) {
            studentRepository.findById(student.getId()).ifPresent(existing -> {
                if (student.getPassword() == null || student.getPassword().isBlank()) {
                    student.setPassword(existing.getPassword());
                }
            });
        }
        // Only encode raw passwords
        if (student.getPassword() != null && !student.getPassword().isBlank() && !isBcrypt(student.getPassword())) {
            student.setPassword(passwordEncoder.encode(student.getPassword()));
        }
        return studentRepository.save(student);
    }

    @Override
    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    @Override
    public boolean checkPassword(Student incoming) {
        if (incoming == null || incoming.getId() == null || incoming.getPassword() == null) return false;
        return studentRepository.findById(incoming.getId())
                .map(stored -> {
                    String storedHash = stored.getPassword();
                    return storedHash != null && passwordEncoder.matches(incoming.getPassword(), storedHash);
                })
                .orElse(false);
    }

    @Override
    public String getPassHash(Student student) {
        if (student == null || student.getId() == null) return null;
        return studentRepository.findById(student.getId()).map(Student::getPassHash).orElse(null);
    }

    @Override
    public String createAndStoreSessionToken(Long id) {
        var sOpt = studentRepository.findById(id);
        if (sOpt.isEmpty()) return null;
        var s = sOpt.get();
        String token = generateSessionToken();
        s.setPassHash(token);
        studentRepository.save(s);
        return token;
    }

    @Override
    public boolean validateSession(Long id, String token) {
        if (id == null || token == null) return false;
        return studentRepository.findById(id)
                .map(s -> token.equals(s.getPassHash()))
                .orElse(false);
    }

    @Override
    public Optional<Student> findById(Long id) {
        return studentRepository.findById(id);
    }
}
