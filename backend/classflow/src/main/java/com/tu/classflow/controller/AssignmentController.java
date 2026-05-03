package com.tu.classflow.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import com.tu.classflow.model.*;
import com.tu.classflow.repository.*;

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
    
    @Autowired
    private UserRepository userRepository;

    //@Autowired
    //private com.tu.classflow.service.EventBridgeService eventBridgeService;

    @Autowired
    private CourseRepository courseRepository;

    
 // อาจารย์สร้าง assignment
    @PostMapping
    public Map<String, Object> createAssignment(@RequestBody Assignment assignment) {

        if (assignment.getCourse() == null || assignment.getCourse().getId() == null) {
            throw new RuntimeException("Course ID is required");
        }

        // ดึง course จาก DB
        Course course = courseRepository.findById(assignment.getCourse().getId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        assignment.setCourse(course);

        Assignment saved = assignmentRepository.save(assignment);

        // ส่ง event (optional)
        //eventBridgeService.sendAssignmentCreatedEvent(saved.getTitle());

        // สร้าง notification
        List<Enrollment> enrollments =
                enrollmentRepository.findByCourse_Id(course.getId());

        for (Enrollment e : enrollments) {
            Notification notif = new Notification();
            notif.setUser(e.getStudent());
            notif.setMessage("มี assignment ใหม่: " + saved.getTitle());
            notif.setIsRead(false);
            notificationRepository.save(notif);
        }

        return Map.of(
                "id", saved.getId(),
                "title", saved.getTitle(),
                "courseId", course.getId(),
                "status", "created"
        );
    }
    
  
    
    // ดู assignment ของวิชาที่ตัวเองลงไว้
    @GetMapping("/my")
    public List<Assignment> getMyAssignments(@AuthenticationPrincipal Jwt jwt) {
    	  String email = jwt.getClaim("email");

          User user = userRepository.findByEmail(email)
                  .orElseThrow(() -> new RuntimeException("User not found"));

          List<Enrollment> enrollments =
                  enrollmentRepository.findByStudent_Id(user.getId());

              List<Long> courseIds = enrollments.stream()
                      .map(e -> e.getCourse().getId())
                      .collect(Collectors.toList());

              return assignmentRepository.findByCourse_IdIn(courseIds);
              /*
        //String userId = jwt.getSubject();
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(userId);
        List<Long> courseIds = enrollments.stream().map(Enrollment::getCourseId).toList();
        return assignmentRepository.findByCourseIdIn(courseIds);
        */
    }

    
    // ดู assignment ของวิชานั้นๆ
    @GetMapping("/course/{courseId}")
    public List<Assignment> getByCourse(@PathVariable Long courseId) {
        return assignmentRepository.findByCourse_Id(courseId);
    }
}