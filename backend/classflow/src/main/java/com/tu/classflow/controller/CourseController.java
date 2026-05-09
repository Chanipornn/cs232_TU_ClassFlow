package com.tu.classflow.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tu.classflow.model.Course;
import com.tu.classflow.model.Enrollment;
import com.tu.classflow.model.User;
import com.tu.classflow.repository.CourseRepository;
import com.tu.classflow.repository.EnrollmentRepository;
import com.tu.classflow.repository.UserRepository;

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

    private User syncUserWithCognito(Jwt jwt) {
        try {
            String email = jwt.getClaim("email");
            String sub = jwt.getSubject(); 
            List<String> groups = jwt.getClaim("cognito:groups");

            final String role = (groups != null && 
                    groups.stream().anyMatch(g -> g.equalsIgnoreCase("INSTRUCTOR")))
                    ? "INSTRUCTOR"
                    : "STUDENT";

            User user = userRepository.findByCognitoSub(sub).orElse(null);

            if (user == null) {
                user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                	user.setCognitoSub(sub);
                }
            }

            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setCognitoSub(sub);
            }

            user.setRole(role);
            return userRepository.save(user);

        } catch (Exception e) {
            System.err.println("Error in syncUserWithCognito: " + e.getMessage());
            throw e;
        }
    }
    
    
    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }
    
    
    // =============================
    // ดูวิชาทั้งหมด
    // =============================
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    
    // =============================
    // อาจารย์สร้างวิชา
    // =============================
    @PostMapping
    public Course createCourse(@RequestBody Course course,
                               @AuthenticationPrincipal Jwt jwt) {

        User instructor = syncUserWithCognito(jwt);

        if (!"INSTRUCTOR".equals(instructor.getRole())) {
            throw new RuntimeException("Only instructor can create course");
        }

        course.setInstructor(instructor);

        return courseRepository.save(course);
    }
    
    
    // =============================
    // นักศึกษา enroll วิชา
    // =============================
    @PostMapping("/{courseId}/enroll")
    public Map<String, String> enrollCourse(@PathVariable Long courseId,
                                           @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getClaim("email");
        List<String> groups = jwt.getClaim("cognito:groups");

        // student เท่านั้น enroll ได้
        if (groups != null && groups.contains("INSTRUCTOR")) {
            throw new RuntimeException("Instructor cannot enroll");
        }

        User student = syncUserWithCognito(jwt);

        if ("INSTRUCTOR".equals(student.getRole())) {
            throw new RuntimeException("Instructor cannot enroll");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (enrollmentRepository.existsByStudent_IdAndCourse_Id(student.getId(), courseId)) {
            return Map.of("message", "Already enrolled");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);

        enrollmentRepository.save(enrollment);

        return Map.of("message", "Enrolled successfully");
    }

    
    // =============================
    // ดูวิชาที่ตัวเองลงทะเบียน
    // =============================
    @GetMapping("/my")
    public List<Course> getMyCourses(@AuthenticationPrincipal Jwt jwt) {

        User user = syncUserWithCognito(jwt);

        if ("INSTRUCTOR".equals(user.getRole())) {
            // instructor: ดูวิชาที่ตัวเองสอน
            return courseRepository.findByInstructor_Id(user.getId());
        }

        // student: ดูวิชาที่ enroll
        List<Enrollment> enrollments =
                enrollmentRepository.findByStudent_Id(user.getId());

        return enrollments.stream()
                .map(Enrollment::getCourse)
                .toList();
    }
    
    // =============================
    // นับจำนวนนักเรียน
    // =============================
    @GetMapping("/{courseId}/student-count")
    public long getStudentCount(
            @PathVariable Long courseId) {

        return enrollmentRepository
                .countByCourse_Id(courseId);
    }
    
    
    @GetMapping("/courses/available/{studentId}")
    public List<Course> getAvailableCourses(
            @PathVariable Long studentId
    ) {

        // enrollment ของ student
        List<Enrollment> enrollments =
                enrollmentRepository.findByStudent_Id(
                        studentId
                );

        // ดึง course id ที่ลงแล้ว
        List<Long> enrolledCourseIds =
                enrollments.stream()
                        .map(e -> e.getCourse().getId())
                        .toList();

        // ดึงทุกวิชา
        List<Course> allCourses =
                courseRepository.findAll();

        // filter วิชาที่ยังไม่ได้ลง
        return allCourses.stream()
                .filter(course ->
                        !enrolledCourseIds.contains(
                                course.getId()
                        )
                )
                .toList();
    }
    
    @GetMapping("/courses/enrolled/{studentId}")
    public List<Course> getEnrolledCourses(
            @PathVariable Long studentId
    ) {

        List<Enrollment> enrollments =
                enrollmentRepository.findByStudent_Id(
                        studentId
                );

        return enrollments.stream()
                .map(Enrollment::getCourse)
                .toList();
    }
}
