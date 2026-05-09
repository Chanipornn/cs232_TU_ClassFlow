package com.tu.classflow.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tu.classflow.model.Assignment;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourse_Id(Long courseId);
    List<Assignment> findByCourse_IdIn(List<Long> courseIds);
    List<Assignment> findByDeadlineBetween(LocalDateTime start, LocalDateTime end);
}