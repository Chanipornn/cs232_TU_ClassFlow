package com.tu.classflow.controller;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tu.classflow.model.Assignment;
import com.tu.classflow.model.AssignmentFile;
import com.tu.classflow.model.Course;
import com.tu.classflow.model.Enrollment;
import com.tu.classflow.model.Notification;
import com.tu.classflow.model.User;
import com.tu.classflow.repository.AssignmentFileRepository;
import com.tu.classflow.repository.AssignmentRepository;
import com.tu.classflow.repository.CourseRepository;
import com.tu.classflow.repository.EnrollmentRepository;
import com.tu.classflow.repository.NotificationRepository;
import com.tu.classflow.repository.SubmissionRepository;
import com.tu.classflow.repository.UserRepository;


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
    
    @Autowired
    private SubmissionRepository submissionRepository;

    //@Autowired
    //private com.tu.classflow.service.EventBridgeService eventBridgeService;

    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private AssignmentFileRepository assignmentFileRepository;

    // เพิ่ม Method สำหรับดึงงานทั้งหมดเข้าไปใน AssignmentController.java
    @GetMapping
    public List<Assignment> getAllAssignments() {
    return assignmentRepository.findAll();
    }
    

 // ================= UPDATE ASSIGNMENT =================
    @PutMapping(
    	    value = "/{id}",
    	    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    	)
    	public Assignment updateAssignment(

    	    @PathVariable Long id,

    	    @RequestParam String title,

    	    @RequestParam String description,

    	    @RequestParam(required = false)
    	    String requirements,

    	    @RequestParam String deadline,

    	    @RequestParam(required = false)
    	    MultipartFile[] files

    	) throws Exception {

    	    Assignment assignment =
    	        assignmentRepository
    	            .findById(id)
    	            .orElseThrow();

    	    assignment.setTitle(title);

    	    assignment.setDescription(description);

    	    assignment.setRequirements(requirements);

    	    assignment.setDeadline(
    	        LocalDateTime.parse(deadline)
    	    );

    	    // ================= FILE =================

    	    if (files != null &&
    	        files.length > 0) {

    	        assignment.getFiles().clear();

    	        for (MultipartFile file : files) {

    	            if (!file.isEmpty()) {

    	                String fileName =
    	                    file.getOriginalFilename();

    	                Path uploadPath =
    	                    Paths.get("uploads");

    	                if (!Files.exists(uploadPath)) {

    	                    Files.createDirectories(
    	                        uploadPath
    	                    );
    	                }

    	                Files.copy(
    	                    file.getInputStream(),
    	                    uploadPath.resolve(fileName),
    	                    StandardCopyOption.REPLACE_EXISTING
    	                );

    	                AssignmentFile af =
    	                    new AssignmentFile();

    	                af.setFileName(fileName);

    	                af.setAssignment(assignment);

    	                assignment.getFiles().add(af);
    	            }
    	        }
    	    }

    	    return assignmentRepository.save(
    	        assignment
    	    );
    	}
   /* @PutMapping("/{id}")
    public Assignment updateAssignment(

        @PathVariable Long id,

        @RequestParam String title,

        @RequestParam String description,

        @RequestParam(required = false)
        String requirements,

        @RequestParam String deadline,

        @RequestParam(required = false)
        MultipartFile[] files

    ) throws Exception {

        Assignment assignment =
            assignmentRepository
                .findById(id)
                .orElseThrow();

        assignment.setTitle(title);

        assignment.setDescription(description);

        assignment.setRequirements(requirements);

        assignment.setDeadline(
            LocalDateTime.parse(deadline)
        );

        // =====================
        // SAVE FILES
        // =====================

        if (files != null &&
            files.length > 0) {

            assignment.getFiles().clear();

            for (MultipartFile file : files) {

                if (!file.isEmpty()) {

                    String fileName =
                        file.getOriginalFilename();

                    Path uploadPath =
                        Paths.get("uploads");

                    if (!Files.exists(uploadPath)) {

                        Files.createDirectories(
                            uploadPath
                        );
                    }

                    Files.copy(
                        file.getInputStream(),
                        uploadPath.resolve(fileName),
                        StandardCopyOption.REPLACE_EXISTING
                    );

                    AssignmentFile af =
                        new AssignmentFile();

                    af.setFileName(fileName);

                    af.setAssignment(assignment);

                    assignment.getFiles().add(af);
                }
            }
        }

        return assignmentRepository.save(
            assignment
        );
    }
    */
    // ดู assignment ของวิชาที่ตัวเองลงไว้
    @GetMapping("/my")
    public List<Assignment> getMyAssignments(jakarta.servlet.http.HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("❌ No Authorization header");
                return new java.util.ArrayList<>();
            }
            
            String token = authHeader.substring(7);
            com.auth0.jwt.interfaces.DecodedJWT decodedJWT = 
                com.auth0.jwt.JWT.decode(token);
            
            String cognitoSub = decodedJWT.getSubject();
            System.out.println("✓ cognitoSub: " + cognitoSub);
            
            User user = userRepository.findByCognitoSub(cognitoSub)
                    .orElseThrow(() -> new RuntimeException("User not found: " + cognitoSub));

            List<Enrollment> enrollments =
                    enrollmentRepository.findByStudent_Id(user.getId());

            List<Long> courseIds = enrollments.stream()
                    .map(e -> e.getCourse().getId())
                    .collect(Collectors.toList());

            System.out.println("✓ Found assignments for courses: " + courseIds);
            return assignmentRepository.findByCourse_IdIn(courseIds);
            
        } catch (Exception e) {
            System.out.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error in getMyAssignments: " + e.getMessage());
        }
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
            notif.setAssignmentId(saved.getId());          
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


        // =========================
        // CREATE NOTIFICATION
        // =========================

        List<Enrollment> enrollments =
        enrollmentRepository.findByCourse_Id(course.getId());

        for (Enrollment e : enrollments) {

        Notification notif = new Notification();

        notif.setUser(e.getStudent());

        notif.setMessage(
            "มี assignment ใหม่: "
            + savedAssignment.getTitle()
        );

         notif.setIsRead(false);

        notificationRepository.save(notif);

        System.out.println(
            "Notification created for: "
            + e.getStudent().getId()
         );
    }
        
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
    
    @DeleteMapping("/{id}")
    public void deleteAssignment(
            @PathVariable Long id
    ) {

        assignmentRepository.deleteById(id);
    }
    
}