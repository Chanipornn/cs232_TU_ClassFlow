package com.tu.classflow.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.*;

@Entity
@Table(name = "assignment_files")
public class AssignmentFile {
	
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String fileName;

	    @ManyToOne
	    @JoinColumn(name = "assignment_id")
	    @JsonBackReference
	    private Assignment assignment;

	    public AssignmentFile() {}

	    public Long getId() {
	        return id;
	    }

	    public String getFileName() {
	        return fileName;
	    }

	    public Assignment getAssignment() {
	        return assignment;
	    }

	    public void setFileName(String fileName) {
	        this.fileName = fileName;
	    }

	    public void setAssignment(Assignment assignment) {
	        this.assignment = assignment;
	    }

}
