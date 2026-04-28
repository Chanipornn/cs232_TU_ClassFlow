package com.tu.classflow.controller;

import com.tu.classflow.model.Course;
import com.tu.classflow.model.Enrollment;
import com.tu.classflow.repository.CourseRepository;
import com.tu.classflow.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    // ดูวิชาทั้งหมด
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // อาจารย์สร้างวิชา
    @PostMapping
    public Course createCourse(@RequestBody Course course, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject(); // ดึง user_id จาก Cognito token
        course.setInstructorId(userId);
        return courseRepository.save(course);
    }

    // นักศึกษา enroll วิชา
    @PostMapping("/{courseId}/enroll")
    public String enrollCourse(@PathVariable Long courseId, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        if (enrollmentRepository.existsByStudentIdAndCourseId(userId, courseId)) {
            return "Already enrolled";
        }
        Enrollment enrollment = new Enrollment();
        enrollment.setStudentId(userId);
        enrollment.setCourseId(courseId);
        enrollmentRepository.save(enrollment);
        return "Enrolled successfully";
    }

    // ดูวิชาที่ตัวเองลงทะเบียนไว้
    @GetMapping("/my")
    public List<Course> getMyCourses(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(userId);
        List<Long> courseIds = enrollments.stream().map(Enrollment::getCourseId).toList();
        return courseRepository.findAllById(courseIds);
    }
}