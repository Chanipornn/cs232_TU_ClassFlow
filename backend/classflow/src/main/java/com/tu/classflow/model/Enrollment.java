package com.tu.classflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "enrollments")
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //private String studentId; // cognito user_id
    //private Long courseId;
    
    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;
    
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
    

    public Enrollment() {}

    public Long getId() { return id; }
    public User getStudent() { return student; }
    public Course getCourse() { return course; }

    public void setStudent(User student) { this.student = student; }
    public void setCourse(Course course) { this.course = course; }
    
}