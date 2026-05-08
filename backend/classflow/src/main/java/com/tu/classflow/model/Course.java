package com.tu.classflow.model;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;        // เช่น CS232
    private String name;        // เช่น INTRODUCTION TO CLOUD
    private String section; 
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private User instructor;

    // เชื่อมความสัมพันธ์ไปยัง Assignment
    // mappedBy ต้องตรงกับชื่อตัวแปรใน Assignment.java
    @JsonIgnore // ป้องกัน JSON วนลูป
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("course") // ป้องกัน JSON วนลูป
    private List<Assignment> assignments;
    
    public Course() {}
    
    // ===== Getters & Setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public User getInstructor() { return instructor; }
    public void setInstructor(User instructor) { this.instructor = instructor; }

    public List<Assignment> getAssignments() { return assignments; }
    public void setAssignments(List<Assignment> assignments) { this.assignments = assignments; }

    // ===== Calculated Fields (สำหรับDashboard) =====

    // นับจำนวนงานทั้งหมดในวิชานี้
    @JsonProperty("assignmentCount")
    public int getAssignmentCount() {
        return (assignments != null) ? assignments.size() : 0;
    }

    // หา Deadline ที่ใกล้ที่สุด (ที่ยังไม่หมดเวลา)
    @JsonProperty("nextDeadline")
    public LocalDateTime getNextDeadline() {
        if (assignments == null || assignments.isEmpty()) return null;

        return assignments.stream()
                .map(Assignment::getDeadline)
                .filter(d -> d != null && d.isAfter(LocalDateTime.now()))
                .min(Comparator.naturalOrder())
                .orElse(null);
    }
}


