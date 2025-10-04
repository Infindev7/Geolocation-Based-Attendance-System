package com.geofencing.attendance.student;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ElementCollection
    private List<Integer> coords;

    // No-args constructor required by JPA
    public Student() {}

    // All-args constructor
    public Student(Long id, String name, List<Integer> coords) {
        this.id = id;
        this.name = name;
        this.coords = coords;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<Integer> getCoords() { return coords; }
    public void setCoords(List<Integer> coords) { this.coords = coords; }
}
