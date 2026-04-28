package com.tu.classflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "enrollments")
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentId; // cognito user_id
    private Long courseId;

    public Long getId() { return id; }
    public String getStudentId() { return studentId; }
    public Long getCourseId() { return courseId; }

    public void setId(Long id) { this.id = id; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
}