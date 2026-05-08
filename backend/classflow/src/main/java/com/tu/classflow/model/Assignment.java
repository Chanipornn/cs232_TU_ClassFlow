package com.tu.classflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.*;

@Entity
@Table(name = "assignments")
public class Assignment {
	
	 	@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String title;
	    
	    @Column(columnDefinition = "TEXT")
	    private String description;
	    
	    @Column(columnDefinition = "TEXT")
	    private String requirements;
	    
	    private LocalDateTime deadline;
	    
	    private LocalDateTime dueDate;
	    
	    private String attachmentFileName;

	    @ManyToOne
	    @JoinColumn(name = "course_id")
	    @JsonIgnoreProperties({"assignments", "enrollments", "instructor"})
	    private Course course;
	
	    @OneToMany(
	    		mappedBy = "assignment",
	            cascade = CascadeType.ALL,
	            fetch = FetchType.EAGER
	    )
	    @JsonManagedReference
	    private java.util.List<AssignmentFile> files;

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
	    
	    public String getRequirements() {
	        return requirements;
	    }

	    public void setRequirements(String requirements) {
	        this.requirements = requirements;
	    }
	    
	    public String getAttachmentFileName() {
	        return attachmentFileName;
	    }

	    public void setAttachmentFileName(String attachmentFileName) {
	        this.attachmentFileName = attachmentFileName;
	    }
	    
	    public java.util.List<AssignmentFile> getFiles() {
	        return files;
	    }

	    public void setFiles(java.util.List<AssignmentFile> files) {
	        this.files = files;
	    }
	    
	    public LocalDateTime getDueDate() {
	        return dueDate;
	    }

	    public void setDueDate(LocalDateTime dueDate) {
	        this.dueDate = dueDate;
	    }
	    
	    
    
}