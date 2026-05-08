package com.tu.classflow.controller;

import java.io.IOException;
import java.util.Map;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



import com.tu.classflow.model.Submission;
import com.tu.classflow.repository.SubmissionRepository;

import com.tu.classflow.config.S3Service;

@RestController
@RequestMapping("/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {

    @Autowired
    private S3Service s3Service;
    
    @Autowired
    private SubmissionRepository submissionRepository;
    
    @GetMapping("/assignment/{assignmentId}")
    public List<Submission> getByAssignment(
            @PathVariable Long assignmentId
    ) {

        return submissionRepository
                .findByAssignmentId(assignmentId);
    }

    // นักศึกษาส่งงาน
    @PostMapping("/upload")
    public Map<String, String> uploadSubmission(
        @RequestParam("file") MultipartFile file,
        @RequestParam("assignmentId") Long assignmentId,
        @RequestHeader("Authorization") String authHeader
    ) throws IOException {
        // ดึง userId จาก token
        String token = authHeader.replace("Bearer ", "");
        String userId = com.auth0.jwt.JWT.decode(token).getSubject();

        String fileUrl = s3Service.uploadFile(file);
        return Map.of(
            "userId", userId,
            "assignmentId", assignmentId.toString(),
            "fileUrl", fileUrl
        );
    }
}