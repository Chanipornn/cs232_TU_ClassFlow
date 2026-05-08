package com.tu.classflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
public class Submission {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	private String fileName;
	private boolean isLate;

    private String fileUrl; // S3 link

    private String status; // SUBMITTED / PENDING
    
    private String studentName;

    private LocalDateTime submittedAt;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    public Submission() {}

    public Long getId() { return id; }
    public String getFileUrl() { return fileUrl; }
    public String getStatus() { return status; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public User getStudent() { return student; }
    public Assignment getAssignment() { return assignment; }

    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public void setStatus(String status) { this.status = status; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public void setStudent(User student) { this.student = student; }
    public void setAssignment(Assignment assignment) { this.assignment = assignment; }
    
    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

  public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public boolean isLate() {
        return isLate;
    }

    public void setLate(boolean late) {
        isLate = late;
    }

}
