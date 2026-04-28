package com.tu.classflow.controller;

import com.tu.classflow.config.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {

    @Autowired
    private S3Service s3Service;

    // นักศึกษาส่งงาน
    @PostMapping("/upload")
    public Map<String, String> uploadSubmission(
        @RequestParam("file") MultipartFile file,
        @RequestParam("assignmentId") Long assignmentId,
        @AuthenticationPrincipal Jwt jwt
    ) throws IOException {
        String userId = jwt.getSubject();
        String fileUrl = s3Service.uploadFile(file);
        return Map.of(
            "userId", userId,
            "assignmentId", assignmentId.toString(),
            "fileUrl", fileUrl
        );
    }
}