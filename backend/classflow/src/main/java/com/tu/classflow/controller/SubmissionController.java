package com.tu.classflow.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.tu.classflow.config.S3Service;
import com.tu.classflow.dto.FeedbackRequest;
import com.tu.classflow.model.Assignment;
import com.tu.classflow.model.Submission;
import com.tu.classflow.repository.AssignmentRepository;
import com.tu.classflow.repository.SubmissionRepository;
import com.tu.classflow.repository.UserRepository;

@RestController
@RequestMapping("/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {

    @Autowired
    private S3Service s3Service;
    
    @Autowired
    private SubmissionRepository submissionRepository;
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private UserRepository userRepository;

    
    @GetMapping("/assignment/{assignmentId}")
    public List<Submission> getByAssignment(
            @PathVariable Long assignmentId
    ) {

        return submissionRepository
                .findByAssignment_Id(assignmentId);
    }

    // อาจารย์ download งานของนศ ทั้งหมด
    @GetMapping("/assignment/{assignmentId}/download-all")
    public ResponseEntity<byte[]> downloadAllFiles(
            @PathVariable Long assignmentId
    ) throws IOException {

        List<Submission> submissions =
                submissionRepository.findByAssignment_Id(
                        assignmentId
                );

        ByteArrayOutputStream baos =
                new ByteArrayOutputStream();

        ZipOutputStream zipOut =
                new ZipOutputStream(baos);

        for (Submission s : submissions) {

            try {

                URL url =
                        new URL(s.getFileUrl());

                InputStream input =
                        url.openStream();

                String safeFileName =
                        s.getStudentCode()
                        + "_"
                        + s.getFileName();

                ZipEntry entry =
                        new ZipEntry(safeFileName);

                zipOut.putNextEntry(entry);

                byte[] bytes =
                        input.readAllBytes();

                zipOut.write(bytes, 0, bytes.length);

                zipOut.closeEntry();

                input.close();

            } catch (Exception e) {

                System.out.println(
                    "Download failed: "
                    + s.getFileUrl()
                );

                e.printStackTrace();
            }
        }

        zipOut.finish();
        zipOut.close();

        return ResponseEntity.ok()
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=submissions.zip"
                )
                .contentType(
                    MediaType.APPLICATION_OCTET_STREAM
                )
                .body(baos.toByteArray());
    }
    
    @GetMapping("/{submissionId}")
    public Submission getSubmissionById(
            @PathVariable Long submissionId
    ) {

        return submissionRepository
                .findById(submissionId)
                .orElseThrow();
    }
    
    
    // นักศึกษาส่งงาน
    @PostMapping("/upload")
    public Map<String, String> uploadSubmission(
            @RequestParam("file") MultipartFile file,
            @RequestParam("assignmentId") Long assignmentId,
            @RequestParam("studentCode") String studentCode,
            @RequestParam("studentName") String studentName,
            @RequestHeader("Authorization") String authHeader
    ) throws IOException {

        String token = authHeader.replace("Bearer ", "");
        DecodedJWT jwt = com.auth0.jwt.JWT.decode(token);

        String fileUrl = s3Service.uploadFile(file);

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        List<Submission> existingSubmissions = submissionRepository.findByAssignment_Id(assignmentId);
        Submission submission = existingSubmissions.stream()
                .filter(s -> studentCode.equals(s.getStudentCode()))
                .findFirst()
                .orElse(new Submission()); // ถ้าไม่มีสร้างใหม่

        submission.setAssignment(assignment);
        submission.setStudentName(studentName);
        submission.setStudentCode(studentCode);
        submission.setFileUrl(fileUrl);
        submission.setFileName(file.getOriginalFilename()); // ชื่อไฟล์จะถูกเปลี่ยน
        submission.setStatus("SUBMITTED");
        submission.setSubmittedAt(LocalDateTime.now());

        boolean isLate = false;
        if (assignment.getDeadline() != null) {
            isLate = LocalDateTime.now().isAfter(assignment.getDeadline());
        }
        submission.setLate(isLate);

        submissionRepository.save(submission);



        return Map.of(
                "message", "Upload success",
                "fileUrl", fileUrl
        );
    }
    
    
    @PostMapping("/feedback/{submissionId}")
    public Submission saveFeedback(
            @PathVariable Long submissionId,
            @RequestBody FeedbackRequest request
    ) {

        Submission submission =
                submissionRepository
                        .findById(submissionId)
                        .orElseThrow();

        submission.setGrade(
                request.getGrade()
        );

        submission.setMaxScore(
                request.getMaxScore()
        );

        submission.setComment(
                request.getComment()
        );

        submission.setGradedBy(
                request.getGradedBy()
        );

        return submissionRepository.save(
                submission
        );
    }
    
    
    /*
    @PostMapping("/upload")
    public Map<String, String> uploadSubmission(
            @RequestParam("file") MultipartFile file,
            @RequestParam("assignmentId") Long assignmentId,
            @RequestHeader("Authorization") String authHeader
    ) throws IOException {

        String token = authHeader.replace("Bearer ", "");
        DecodedJWT jwt = com.auth0.jwt.JWT.decode(token);
        String email = jwt.getClaim("email").asString();

        // 1. อัปโหลดไฟล์ไป S3
        String fileUrl = s3Service.uploadFile(file);

        // 2. ดึงข้อมูล Assignment
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // 3. ดึงข้อมูล User (เพื่อให้ความสัมพันธ์ student_id ใน DB ถูกต้อง)
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Submission submission = new Submission();
        submission.setAssignment(assignment);

        submission.setStudentId(studentId);
        submission.setStudentName(studentName);


        submission.setStudent(student); // เปลี่ยนจาก setStudentName เป็น setStudent

        submission.setFileUrl(fileUrl);
        submission.setFileName(file.getOriginalFilename());
        submission.setStatus("SUBMITTED");
        submission.setSubmittedAt(LocalDateTime.now());

        // 4. เช็คการส่งเลท (เพิ่ม Null Check สำหรับ Deadline)
        boolean isLate = false;
        if (assignment.getDeadline() != null) {
            isLate = LocalDateTime.now().isAfter(assignment.getDeadline());
        }
        submission.setLate(isLate);

        submissionRepository.save(submission);

        return Map.of(
                "message", "Upload success",
                "fileUrl", fileUrl
        );
    }
    */
}