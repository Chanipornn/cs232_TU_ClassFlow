package com.tu.classflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tu.classflow.model.Submission;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
	List<Submission> findByAssignmentId(Long assignmentId);

}
