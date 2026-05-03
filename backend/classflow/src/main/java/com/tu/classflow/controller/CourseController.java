package com.tu.classflow.controller;

import com.tu.classflow.model.*;
import com.tu.classflow.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private UserRepository userRepository;

    // ดูวิชาทั้งหมด
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // อาจารย์สร้างวิชา
    @PostMapping
    public Course createCourse(@RequestBody Course course, @AuthenticationPrincipal Jwt jwt) {
    	 String email = jwt.getClaim("email");

         User instructor = userRepository.findByEmail(email)
                 .orElseThrow(() -> new RuntimeException("User not found"));

         course.setInstructor(instructor);

         return courseRepository.save(course);
    	/*
        String userId = jwt.getSubject(); // ดึง user_id จาก Cognito token
        course.setInstructorId(userId);
        return courseRepository.save(course);
        */
    }

    // นักศึกษา enroll วิชา
    @PostMapping("/{courseId}/enroll")
    public String enrollCourse(@PathVariable Long courseId,
                               @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getClaim("email");

        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // เช็คว่า enroll แล้วหรือยัง
        if (enrollmentRepository.existsByStudent_IdAndCourse_Id(student.getId(), courseId)) {
            return "Already enrolled";
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);

        enrollmentRepository.save(enrollment);

        return "Enrolled successfully";
    }

    /*public String enrollCourse(@PathVariable Long courseId, @AuthenticationPrincipal Jwt jwt) {
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
*/
    // ดูวิชาที่ตัวเองลงทะเบียนไว้
    @GetMapping("/my")
    public List<Course> getMyCourses(@AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getClaim("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Enrollment> enrollments =
                enrollmentRepository.findByStudent_Id(user.getId());

        return enrollments.stream()
                .map(Enrollment::getCourse)
                .collect(Collectors.toList());
    }
    /*
    @GetMapping("/my")
    public List<Course> getMyCourses(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(userId);
        List<Long> courseIds = enrollments.stream().map(Enrollment::getCourseId).toList();
        return courseRepository.findAllById(courseIds);
    }
    */
}