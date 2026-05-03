package com.tu.classflow.repository;

import com.tu.classflow.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourse_Id(Long courseId);
    List<Assignment> findByCourse_IdIn(List<Long> courseIds);
}