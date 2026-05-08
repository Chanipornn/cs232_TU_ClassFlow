package com.tu.classflow.controller;

import java.io.*;
import java.net.URL;
import java.time.LocalDateTime;

import java.util.Map;
import java.util.List;
import java.util.zip.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.*;
import com.auth0.jwt.interfaces.DecodedJWT;

import com.tu.classflow.model.*;
import com.tu.classflow.repository.*;

import com.tu.classflow.config.S3Service;

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

            URL url =
                    new URL(s.getFileUrl());

            InputStream input =
                    url.openStream();

            ZipEntry entry =
                    new ZipEntry(s.getFileName());

            zipOut.putNextEntry(entry);

            input.transferTo(zipOut);

            zipOut.closeEntry();

            input.close();
        }

        zipOut.close();

        return ResponseEntity.ok()
                .header(
                    "Content-Disposition",
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
}