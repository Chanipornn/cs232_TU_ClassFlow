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
    //private String instructorId; // cognito user_id ของอาจารย์
    
    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private User instructor;
    
    public Course() {}
    
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public User getInstructor() { return instructor; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setInstructor(User instructor) { this.instructor = instructor; }

}