package com.tu.classflow.controller;

import com.tu.classflow.model.Assignment;
import com.tu.classflow.model.Enrollment;
import com.tu.classflow.model.Notification;
import com.tu.classflow.repository.AssignmentRepository;
import com.tu.classflow.repository.EnrollmentRepository;
import com.tu.classflow.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // อาจารย์สร้าง assignment
    @PostMapping
    public Assignment createAssignment(@RequestBody Assignment assignment) {
        Assignment saved = assignmentRepository.save(assignment);

        // สร้าง notification ให้นักศึกษาที่ enroll วิชานั้น
        List<Enrollment> enrollments = enrollmentRepository.findByCourseId(assignment.getCourseId());
        for (Enrollment e : enrollments) {
            Notification notif = new Notification();
            notif.setUserId(e.getStudentId());
            notif.setMessage("มี assignment ใหม่: " + assignment.getTitle());
            notificationRepository.save(notif);
        }

        return saved;
    }

    // ดู assignment ของวิชาที่ตัวเองลงไว้
    @GetMapping("/my")
    public List<Assignment> getMyAssignments(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(userId);
        List<Long> courseIds = enrollments.stream().map(Enrollment::getCourseId).toList();
        return assignmentRepository.findByCourseIdIn(courseIds);
    }

    // ดู assignment ของวิชานั้นๆ
    @GetMapping("/course/{courseId}")
    public List<Assignment> getByCourse(@PathVariable Long courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }
}