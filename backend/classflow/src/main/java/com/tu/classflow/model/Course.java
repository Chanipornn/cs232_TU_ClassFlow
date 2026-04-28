package com.tu.classflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String instructorId; // cognito user_id ของอาจารย์

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getInstructorId() { return instructorId; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setInstructorId(String instructorId) { this.instructorId = instructorId; }
}