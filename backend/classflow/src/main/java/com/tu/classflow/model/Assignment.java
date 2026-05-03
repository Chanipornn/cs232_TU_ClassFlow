package com.tu.classflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "assignments")
public class Assignment {
	
	 	@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String title;
	    
	    @Column(columnDefinition = "TEXT")
	    private String description;
	    
	    private LocalDateTime deadline;

	    @ManyToOne
	    @JoinColumn(name = "course_id")
	    @JsonIgnoreProperties({"assignments", "enrollments", "instructor"})
	    private Course course;

	    public Assignment() {}

	    public Long getId() { return id; }
	    public String getTitle() { return title; }
	    public String getDescription() { return description; }
	    public LocalDateTime getDeadline() { return deadline; }
	    public Course getCourse() { return course; }

	    public void setTitle(String title) { this.title = title; }
	    public void setDescription(String description) { this.description = description; }
	    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }
	    public void setCourse(Course course) { this.course = course; }
    
}