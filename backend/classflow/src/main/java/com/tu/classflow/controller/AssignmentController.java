package com.tu.classflow.controller;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.util.Map;
import java.time.LocalDateTime;

import java.nio.file.*;
import java.io.File;
import java.nio.file.StandardCopyOption;

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
    
    @Autowired
    private AssignmentFileRepository assignmentFileRepository;
    

 // ================= UPDATE ASSIGNMENT =================
    @PutMapping("/{id}")
    public Assignment updateAssignment(
            @PathVariable Long id,
            @RequestBody Assignment updated) {

        Assignment assignment =
                assignmentRepository
                        .findById(id)
                        .orElseThrow();

        assignment.setTitle(
                updated.getTitle());

        assignment.setDescription(
                updated.getDescription());

        assignment.setRequirements(
                updated.getRequirements());

        assignment.setDeadline(
                updated.getDeadline());

        return assignmentRepository
                .save(assignment);
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
 
    }

    
    // ดู assignment ของวิชานั้นๆ
    @GetMapping("/course/{courseId}")
    public List<Assignment> getByCourse(@PathVariable Long courseId) {
        return assignmentRepository.findByCourse_Id(courseId);
    }
    
 // ================= GET ASSIGNMENT BY ID =================
    @GetMapping("/{id}")
    public Assignment getAssignmentById(
            @PathVariable Long id) {

        return assignmentRepository
                .findById(id)
                .orElseThrow();
    }
    
 // ================= DOWNLOAD FILE =================
    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<Resource> previewFile(
            @PathVariable String fileName)
            throws Exception {

        Path filePath = Paths
                .get("uploads")
                .resolve(fileName)
                .normalize();

        Resource resource =
                new UrlResource(filePath.toUri());

        if (!resource.exists()) {

            throw new RuntimeException(
                    "File not found"
            );
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline"
                )
                .body(resource);
    }
    
    
    
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
    
    
    // Upload files
    @PostMapping("/upload")
    public Assignment createAssignmentWithFiles(

            @RequestParam("title") String title,

            @RequestParam("description") String description,
            @RequestParam("requirements") String requirements,

            @RequestParam("deadline") String deadline,

            @RequestParam("courseId") Long courseId,

            @RequestParam(value = "files", required = false)
            MultipartFile[] files

    ) throws Exception {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        Assignment assignment = new Assignment();

        assignment.setTitle(title);

        assignment.setDescription(description);
        assignment.setRequirements(requirements);

        if (deadline != null && !deadline.isEmpty()) {

            assignment.setDeadline(
                    LocalDateTime.parse(deadline)
            );
        }

        assignment.setCourse(course);

        Assignment savedAssignment =
                assignmentRepository.save(assignment);
        
     // debug
     System.out.println("FILES = " + files);

     if (files != null) {

         System.out.println(
                 "FILES LENGTH = "
                 + files.length
         );

         for (MultipartFile file : files) {

             System.out.println(
                     "FILE = "
                     + file.getOriginalFilename()
             );

             if (!file.isEmpty()) {

            	    // =========================
            	    // CREATE uploads FOLDER
            	    // =========================

            	    String uploadDir = "uploads/";

            	    File dir = new File(uploadDir);

            	    if (!dir.exists()) {

            	        dir.mkdirs();
            	    }

            	    // =========================
            	    // SAVE FILE TO uploads
            	    // =========================

            	    String fileName =
            	            file.getOriginalFilename();

            	    Path filePath =
            	            Paths.get(uploadDir + fileName);

            	    Files.copy(
            	            file.getInputStream(),
            	            filePath,
            	            StandardCopyOption.REPLACE_EXISTING
            	    );

            	    // =========================
            	    // SAVE FILE NAME TO DB
            	    // =========================

            	    AssignmentFile af =
            	            new AssignmentFile();

            	    af.setAssignment(savedAssignment);

            	    af.setFileName(fileName);

            	    assignmentFileRepository.save(af);

            	    System.out.println(
            	            "SAVE FILE: " + fileName
            	    );
            	}
         }
     }

        return savedAssignment;
    }
    
    
}