package com.tu.classflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;        // CS232
    private String name;        
    private String section; 
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private User instructor;
    
    public Course() {}
    
 // ===== getters =====
    public Long getId() { return id; }
    public String getCode() { return code; }
    public String getName() { return name; }
    public String getSection() { return section; }
    public String getDescription() { return description; }
    public User getInstructor() { return instructor; }

    // ===== setters =====
    public void setId(Long id) { this.id = id; }
    public void setCode(String code) { this.code = code; }
    public void setName(String name) { this.name = name; }
    public void setSection(String section) { this.section = section; }
    public void setDescription(String description) { this.description = description; }
    public void setInstructor(User instructor) { this.instructor = instructor; }

}