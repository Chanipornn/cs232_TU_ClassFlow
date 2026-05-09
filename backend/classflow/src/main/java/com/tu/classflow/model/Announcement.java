package com.tu.classflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String date;
    private String message;
    private String courseCode;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private User instructor;

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDate() { return date; }
    public String getMessage() { return message; }
    public String getCourseCode() { return courseCode; }
    public User getInstructor() { return instructor; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDate(String date) { this.date = date; }
    public void setMessage(String message) { this.message = message; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }
    public void setInstructor(User instructor) { this.instructor = instructor; }
}