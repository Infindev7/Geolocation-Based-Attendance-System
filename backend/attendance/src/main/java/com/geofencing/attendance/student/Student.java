package com.geofencing.attendance.student;

import jakarta.persistence.*;

@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String password;

    private Double latitude;
    private Double longitude;
    private Double distance; // Optional: store distance if you want


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
    // No-args constructor required by JPA
    public Student() {}

    // All-args constructor
    public Student(Long id, String name, String password, Double latitude, Double longitude, Double distance) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distance = distance;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }
}
